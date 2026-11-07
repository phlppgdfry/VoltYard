using System.Text.RegularExpressions;
namespace VoltYard.Domain;

public static class Vin
{
    private static readonly int[] Weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
    private const string Characters = "0123456789ABCDEFGHJKLMNPRSTUVWXYZ";
    private static readonly int[] Values = [0,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,1,2,3,4,5,7,9,2,3,4,5,6,7,8,9];
    // Demo imports require a check digit. Some real markets require a configurable policy.
    public static bool IsValid(string? value)
    {
        if (value is null || value.Length != 17 || value.Any(c => !Characters.Contains(c))) return false;
        var remainder = value.Select((c,i) => Values[Characters.IndexOf(c)] * Weights[i]).Sum() % 11;
        return value[8] == (remainder == 10 ? 'X' : (char)('0' + remainder));
    }
}
public static class Rules
{
    public static RuleProfile SelectProfile(IEnumerable<RuleProfile> profiles, Vehicle vehicle)
    {
        var matches = profiles.Where(p => p.ManufacturerCode == vehicle.Fab && p.Powertrain == vehicle.Powertrain).ToList();
        return matches.Where(p => p.ModelPattern is not null && Regex.IsMatch(vehicle.Model,
                "^" + Regex.Escape(p.ModelPattern).Replace("\\*", ".*") + "$", RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(100)))
            .OrderByDescending(p => p.ModelPattern!.Replace("*", "").Length).FirstOrDefault()
            ?? matches.FirstOrDefault(p => p.ModelPattern is null)
            ?? profiles.First(p => p.Id == "TERMINAL-DEFAULT");
    }
    public static bool WithinWindow(Vehicle v, DateOnly today) => v.Departure is not null && DateOnly.Parse(v.Departure).DayNumber - today.DayNumber <= 7;
    public static double Target(Vehicle v, RuleProfile p, DateOnly today)
    {
        var departure = p.DepartureRules.Find(r => r.DestinationType == v.Destination);
        var target = Math.Min(p.TargetStorageSoc, p.MaxChargeSoc);
        if (departure is not null && WithinWindow(v,today))
        {
            target = Math.Min(Math.Max(target,departure.MinSoc),Math.Min(p.MaxChargeSoc,departure.MaxSoc));
            if (target < departure.MinSoc) throw new DomainException("Profile and departure limits conflict; review the profile.",409);
        }
        return target;
    }
    public static double Discharge(Vehicle v, RuleProfile p)
    {
        if (v.History.Count >= 2)
        {
            var a=v.History[^2]; var b=v.History[^1];
            var days=DateOnly.Parse(b.T).DayNumber-DateOnly.Parse(a.T).DayNumber;
            if (days>0 && a.Soc>b.Soc) return (a.Soc-b.Soc)/days;
        }
        return p.DefaultDischargePerDay;
    }
    public static List<RuleAlert> Evaluate(Vehicle v, RuleProfile p, Zone zone, DateOnly today)
    {
        if (v.Departed) return [];
        List<RuleAlert> result=[];
        void Add(string code,string severity,string msg,string action) => result.Add(new(code,severity,msg,action));
        if(v.History.Count==0)
        {
            Add("INSPECTION_REQUIRED","High","No battery observation has been recorded","Record an arrival inspection before charging or departure");
            if(v.QuarantineRequired && zone.Type!="Quarantine") Add("QUARANTINE_REQUIRED","Critical","Unresolved concern without an inspection","Follow site HSE procedure");
            if(zone.Type=="Standard") Add("WRONG_ZONE","Medium","EV in standard storage zone","Move to approved EV zone");
            return result.OrderByDescending(a=>a.Severity=="Critical"?4:a.Severity=="High"?3:2).ToList();
        }
        var age=today.DayNumber-DateOnly.Parse(v.LastInspection).DayNumber;
        var socAge=today.DayNumber-DateOnly.Parse(v.History[^1].T).DayNumber;
        var horizon=v.Departure is null ? 14 : Math.Min(14,Math.Max(0,DateOnly.Parse(v.Departure).DayNumber-today.DayNumber));
        var predicted=Math.Max(0,v.Soc-Discharge(v,p)*(Math.Max(0,socAge)+horizon));
        if (v.Soc<p.CriticalSoc) Add("SOC_CRITICAL","Critical",$"SOC {v.Soc}% below critical {p.CriticalSoc}%","Inspect and arrange urgent charging if safe");
        else if (v.Soc<p.MinStorageSoc) Add("SOC_BELOW_MIN","High",$"SOC {v.Soc}% below storage minimum {p.MinStorageSoc}%","Review charging task");
        else if (predicted<p.MinStorageSoc) Add("SOC_PREDICTED_LOW","Medium",$"Estimated SOC {predicted:F1}% in {horizon} days","Schedule an inspection or charging");
        if (age>p.InspectionIntervalDays) Add("INSPECTION_OVERDUE","Medium",$"Last inspection {age} days ago","Inspect vehicle");
        if (v.TwelveV=="Weak") Add("TWELVE_VOLT_WEAK","Medium","12V battery weak","Inspect auxiliary battery");
        if (v.TwelveV=="Dead" || !v.Driveable) Add("NOT_DRIVEABLE","High","Vehicle cannot drive","Arrange recovery; include in emergency inventory");
        var departure=p.DepartureRules.Find(r=>r.DestinationType==v.Destination);
        if (departure is not null && WithinWindow(v,today))
        {
            if (v.Soc>departure.MaxSoc) Add("DEPARTURE_SOC_HIGH","High",$"SOC above departure maximum {departure.MaxSoc}%","Hold departure and request review");
            if (v.Soc<departure.MinSoc) Add("DEPARTURE_SOC_LOW","High",$"SOC below departure minimum {departure.MinSoc}%","Arrange charging before departure");
        }
        if (v.QuarantineRequired && zone.Type!="Quarantine") Add("QUARANTINE_REQUIRED","Critical","Unresolved damage or battery concern","Follow site HSE procedure and isolate vehicle");
        if (zone.Type=="Standard") Add("WRONG_ZONE","Medium","EV in standard storage zone","Move to approved EV zone");
        return result.OrderByDescending(a=>a.Severity=="Critical"?4:a.Severity=="High"?3:2).ToList();
    }
    public static void Validate(RuleProfile p)
    {
        if(string.IsNullOrWhiteSpace(p.Id) || string.IsNullOrWhiteSpace(p.Name) || p.DepartureRules is null || p.DepartureRules.Count==0 || p.DepartureRules.Any(r=>r is null))
            throw new DomainException("Profile ID, name and non-empty departure rules are required.");
        if (!double.IsFinite(p.CriticalSoc+p.MinStorageSoc+p.TargetStorageSoc+p.MaxChargeSoc+p.DefaultDischargePerDay) ||
            p.CriticalSoc<0 || p.CriticalSoc>p.MinStorageSoc || p.MinStorageSoc>p.TargetStorageSoc ||
            p.TargetStorageSoc>p.MaxChargeSoc || p.MaxChargeSoc>100 || p.InspectionIntervalDays is <1 or >365 ||
            p.TwelveVoltIntervalDays is <1 or >365 || p.DefaultDischargePerDay is <0 or >100 ||
            p.DepartureRules.Any(r=>!double.IsFinite(r.MinSoc+r.MaxSoc) || r.MinSoc<0 || r.MaxSoc>100 || r.MinSoc>r.MaxSoc))
            throw new DomainException("Use 0 ≤ critical ≤ minimum ≤ target ≤ maximum ≤ 100, valid departure ranges and positive inspection intervals.");
    }
}
