namespace VoltYard.Domain;

public sealed record WorkAssignmentChange(string Vin,string Kind,string? Owner,DateTimeOffset? DueAt,string Actor,DateTimeOffset At);
public sealed class WorkAssignment
{
    public string Vin { get; set; } = "";
    public string Kind { get; set; } = "";
    public string Owner { get; set; } = "";
    public DateTimeOffset DueAt { get; set; }
    public string AssignedBy { get; set; } = "";
    public DateTimeOffset AssignedAt { get; set; }
}
public sealed record WorkItem(string Id,string Vin,string Kind,string Title,string? Owner,DateTimeOffset? DueAt,
    bool Completed,bool Overdue,int Priority,string Explanation);

public static class ShiftWork
{
    public static readonly string[] Owners=["admin","planner","operator","hse"];
    public static bool Eligible(string kind,string owner) => owner=="admin" || (kind switch
    {
        "safety"=>owner=="hse", "inspection"=>owner=="operator", "charging"=>owner is "operator" or "planner",
        "handover"=>owner=="planner", _=>false
    });
    public static List<WorkItem> Build(YardData data,DateTimeOffset now)
    {
        var today=DateOnly.FromDateTime(now.UtcDateTime);
        var open=new Dictionary<string,(Vehicle Vehicle,string Kind,int Rank,string Reason)>();
        foreach(var v in data.Vehicles.Where(v=>!v.Departed))
        {
            var p=data.Profiles.First(p=>p.Id==v.Profile);
            double target;
            try {target=Rules.Target(v,p,today);} catch(DomainException) {target=double.NaN;}
            var alerts=Rules.Evaluate(v,p,data.Zones.First(z=>z.Code==v.Zone),today);
            void Add(string kind,int rank,string reason)=>open[v.Vin+":"+kind]=(v,kind,rank,reason);
            if(double.IsNaN(target))Add("rules",300,"Charging target conflicts with the departure minimum; an administrator must review the rule profile.");
            if(v.QuarantineRequired||v.Zone=="Q-QUAR")Add("safety",400,"Unresolved quarantine workflow; HSE review takes precedence.");
            else
            {
                if(alerts.Any(a=>a.Code is "INSPECTION_REQUIRED" or "INSPECTION_OVERDUE" or "TWELVE_VOLT_WEAK" or "NOT_DRIVEABLE") || alerts.Any(a=>a.Code=="SOC_PREDICTED_LOW")&&target<=v.Soc)
                    Add("inspection",alerts.Any(a=>a.Code is "NOT_DRIVEABLE" or "INSPECTION_REQUIRED")?300:200,"Observation or forecast exception needs review: "+string.Join("; ",alerts.Where(a=>a.Code is "INSPECTION_REQUIRED" or "INSPECTION_OVERDUE" or "TWELVE_VOLT_WEAK" or "NOT_DRIVEABLE" or "SOC_PREDICTED_LOW").Select(a=>a.Msg))+".");
                if(data.Orders.ContainsKey(v.Vin)||target>v.Soc&&alerts.Any(a=>a.Code is "SOC_CRITICAL" or "SOC_BELOW_MIN" or "SOC_PREDICTED_LOW" or "DEPARTURE_SOC_LOW"))
                    Add("charging",alerts.Any(a=>a.Code=="SOC_CRITICAL")?300:200,"Charging follow-up: "+(data.Orders.GetValueOrDefault(v.Vin)?.Status??string.Join("; ",alerts.Where(a=>a.Code is "SOC_CRITICAL" or "SOC_BELOW_MIN" or "SOC_PREDICTED_LOW" or "DEPARTURE_SOC_LOW").Select(a=>a.Msg)))+". Charging remains subject to safety and target checks.");
            }
            if(v.Departure is not null)Add("handover",100,alerts.Count>0||v.QuarantineRequired||v.Zone=="Q-QUAR"?"Departure is planned but current exceptions must be resolved first.":"Departure is planned; review evidence and record handover.");
        }
        var ids=open.Keys.Concat(data.WorkAssignments.Keys).Distinct();
        return ids.Select(id=>
        {
            data.WorkAssignments.TryGetValue(id,out var assignment);
            var pending=open.TryGetValue(id,out var item);
            var kind=pending?item.Kind:assignment!.Kind;var vin=pending?item.Vehicle.Vin:assignment!.Vin;
            var overdue=pending&&assignment is not null&&assignment.DueAt<now;
            var departureSoon=pending&&item.Vehicle.Departure is not null&&DateOnly.Parse(item.Vehicle.Departure)<=today.AddDays(1);
            var priority=pending?item.Rank+(overdue?50:0)+(departureSoon?25:0):0;
            return new WorkItem(id,vin,kind,kind switch {"inspection"=>"Inspect vehicle","charging"=>"Coordinate charging","safety"=>"Review quarantine","rules"=>"Review rule profile",_=>"Prepare handover"},
                assignment?.Owner,assignment?.DueAt,!pending,overdue,priority,
                pending?item.Reason+(overdue?" Assigned deadline is overdue (+50).":"")+(departureSoon?" Departure within one day (+25).":"")+" Base priority "+item.Rank+".":"The triggering condition is no longer present. New observations can reopen this task.");
        }).OrderBy(t=>t.Completed).ThenByDescending(t=>t.Priority).ThenBy(t=>t.DueAt??DateTimeOffset.MaxValue).ThenBy(t=>t.Id,StringComparer.Ordinal).ToList();
    }
}
