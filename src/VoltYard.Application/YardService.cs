using System.Globalization;
using Microsoft.VisualBasic.FileIO;
using VoltYard.Domain;
namespace VoltYard.Application;

public sealed class YardCommand
{
    public long Revision { get; set; }
    public string Vin { get; set; } = "";
    public double? Soc { get; set; }
    public string TwelveV { get; set; } = "";
    public bool Damage { get; set; }
    public bool Suspected { get; set; }
    public bool Confirm { get; set; }
    public string Note { get; set; } = "";
    public string Zone { get; set; } = "";
    public string Reason { get; set; } = "";
    public string Decision { get; set; } = "";
    public string Justification { get; set; } = "";
    public RuleProfile? Profile { get; set; }
    public string Csv { get; set; } = "";
    public string? Departure { get; set; }
    public string? Destination { get; set; }
    public double? Kwh { get; set; }
}
public sealed class YardService(IYardStore store, TimeProvider clock)
{
    public static readonly Dictionary<string,string[]> Permissions = new()
    {
        ["inspect"]=["Admin","Planner","Operator"], ["charge-approve"]=["Admin","Planner"],
        ["charge-start"]=["Admin","Planner","Operator"], ["charge-stop"]=["Admin","Planner","Operator"],
        ["quarantine"]=["Admin","Planner","Operator","HSE"], ["move"]=["Admin","Planner","Operator","HSE"],
        ["decide"]=["Admin","HSE"], ["profile"]=["Admin"], ["import"]=["Admin","Planner"],
        ["plan"]=["Admin","Planner"], ["depart"]=["Admin","Planner"]
    };
    public object Execute(string action,YardCommand c,string actor) => store.Write(c.Revision,actor,action,c.Vin,d=>Apply(d,action,c,actor));
    private object Apply(YardData d,string action,YardCommand c,string actor)
    {
        var today=DateOnly.FromDateTime(clock.GetUtcNow().UtcDateTime);
        var stamp=today.ToString("yyyy-MM-dd");
        var observedSoc=c.Soc ?? double.NaN;
        c.Note ??= ""; c.Reason ??= ""; c.Justification ??= "";
        if(action=="import")return Import(d,c.Csv,today);
        if(action=="profile")
        {
            var p=c.Profile ?? throw new DomainException("Profile is required.");
            Rules.Validate(p);
            var old=d.Profiles.Find(p_=>p_.Id==p.Id) ?? throw new DomainException("Profile not found.",404);
            if(p.ManufacturerCode!=old.ManufacturerCode || p.ModelPattern!=old.ModelPattern || p.Powertrain!=old.Powertrain)
                throw new DomainException("Profile scope cannot be changed through the threshold editor.");
            d.ProfileHistory.Add(old);p.Version=old.Version+1;p.EffectiveFrom=stamp;
            d.Profiles[d.Profiles.IndexOf(old)]=p;
            return new { message=$"Profile saved as version {p.Version}." };
        }
        var v=d.Vehicles.Find(v_=>v_.Vin==c.Vin) ?? throw new DomainException("Vehicle not found.",404);
        if(v.Departed)throw new DomainException("Vehicle already departed.",409);
        var profile=d.Profiles.First(p=>p.Id==v.Profile);
        void Record(double soc,string source)
        {
            v.History.Add(new() {T=stamp,Soc=soc,TwelveV=c.TwelveV,Damage=c.Damage,Suspected=c.Suspected,Note=c.Note,
                Source=source,ProfileId=profile.Id,ProfileVersion=profile.Version,Actor=actor,RecordedAt=clock.GetUtcNow()});
            v.Soc=soc;
        }
        switch(action)
        {
            case "inspect":
                if(!double.IsFinite(observedSoc) || observedSoc is <0 or >100 || !new[]{"OK","Weak","Dead"}.Contains(c.TwelveV) || c.Note.Length>2000)
                    throw new DomainException("SOC must be 0–100, with a valid 12V status and a note of at most 2,000 characters.");
                if(!c.Confirm && (observedSoc<5 || v.Soc-observedSoc>20))throw new DomainException("Confirm this unusually low reading.",409);
                if(d.Orders.GetValueOrDefault(v.Vin)?.Status=="Running")throw new DomainException("Stop charging before recording a manual inspection.",409);
                Record(observedSoc,"Manual");v.TwelveV=c.TwelveV;v.Driveable=c.TwelveV!="Dead";v.LastInspection=stamp;
                if(c.Damage || c.Suspected)
                {
                    v.QuarantineRequired=true;
                    v.Dossier=new(){Reason=c.Suspected?"Suspected battery reported during inspection":"Damage reported during inspection",Opened=stamp};
                    d.Orders.Remove(v.Vin);
                }
                break;
            case "charge-approve":
                EnsureSafe(v);
                if(d.Orders.ContainsKey(v.Vin))throw new DomainException("Charging order already exists.",409);
                if(Rules.Target(v,profile,today)<=v.Soc)throw new DomainException("No charging is needed for this target.",409);
                d.Orders.Add(v.Vin,new());break;
            case "charge-start":
                EnsureSafe(v);
                var order=d.Orders.GetValueOrDefault(v.Vin) ?? throw new DomainException("Approve the order first.",409);
                if(order.Status!="Approved")throw new DomainException("Only approved orders can start.",409);
                if(Rules.Target(v,profile,today)<=v.Soc)throw new DomainException("Target has already been reached.",409);
                var charger=d.Chargers.FirstOrDefault(l=>l.Status=="Available" && l.OccupiedBy is null) ?? throw new DomainException("No charger is available.",409);
                charger.OccupiedBy=v.Vin;order.Status="Running";order.Charger=charger.Code;order.StartSoc=v.Soc;order.StartedAt=clock.GetUtcNow();break;
            case "charge-stop":
                var running=d.Orders.GetValueOrDefault(v.Vin);
                if(running?.Status!="Running")throw new DomainException("No running session for this vehicle.",409);
                if(!double.IsFinite(observedSoc) || observedSoc<running.StartSoc || observedSoc>100 || c.Kwh is <0 or >1000 || (c.Kwh.HasValue && !double.IsFinite(c.Kwh.Value)))
                    throw new DomainException("Provide a valid final SOC and non-negative energy reading.");
                var energy=c.Kwh ?? Math.Round((observedSoc-running.StartSoc)/100*v.Kwh/.9,2);
                d.ChargingSessions.Add(new(v.Vin,v.Fab,running.Charger!,running.StartedAt!.Value,clock.GetUtcNow(),running.StartSoc,observedSoc,energy,!c.Kwh.HasValue));
                d.Chargers.First(l=>l.Code==running.Charger).OccupiedBy=null;
                var bill=d.Billing.GetValueOrDefault(v.Fab) ?? new Billing();d.Billing[v.Fab]=bill;bill.Sessions++;bill.Kwh+=energy;
                c.TwelveV=v.TwelveV;Record(observedSoc,"Charging");d.Orders.Remove(v.Vin);break;
            case "quarantine":
                if(c.Reason.Trim().Length<10 || c.Reason.Length>2000)throw new DomainException("Explain the concern in 10–2,000 characters.");
                if(d.Orders.GetValueOrDefault(v.Vin)?.Status=="Running")throw new DomainException("Stop the charging session before opening quarantine.",409);
                v.QuarantineRequired=true;v.Dossier=new(){Reason=c.Reason.Trim(),Opened=stamp};d.Orders.Remove(v.Vin);break;
            case "move":Move(d,v,c.Zone);break;
            case "decide":
                if(v.Zone!="Q-QUAR" || v.Dossier is null)throw new DomainException("Move the vehicle into quarantine first.",409);
                if(!new[]{"Released","Repair required","Awaiting manufacturer"}.Contains(c.Decision) || c.Justification.Trim().Length<10 || c.Justification.Length>2000)
                    throw new DomainException("Choose a decision and give a justification of 10–2,000 characters.");
                v.Dossier.Decision=c.Decision;v.Dossier.Justification=c.Justification.Trim();v.Dossier.DecidedBy=actor;
                if(c.Decision=="Released") {v.QuarantineRequired=false;Move(d,v,"B-EV-1");}
                break;
            case "plan":
                if(!DateOnly.TryParseExact(c.Departure,"yyyy-MM-dd",CultureInfo.InvariantCulture,DateTimeStyles.None,out var date) || date<today ||
                    !profile.DepartureRules.Any(r=>r.DestinationType==c.Destination))throw new DomainException("Choose a valid destination and a date from today onwards.");
                if(d.Orders.GetValueOrDefault(v.Vin)?.Status=="Running")throw new DomainException("Stop the running session before changing its departure limits.",409);
                v.Departure=date.ToString("yyyy-MM-dd");v.Destination=c.Destination;break;
            case "depart":
                EnsureSafe(v);
                if(v.Departure is null)throw new DomainException("Plan a departure first.",409);
                // Validate departure limits even when the planned date is outside the normal warning window.
                var check=new Vehicle {Soc=v.Soc,TwelveV=v.TwelveV,Driveable=v.Driveable,Destination=v.Destination,Departure=stamp,
                    LastInspection=v.LastInspection,Zone=v.Zone,History=v.History};
                if(Rules.Evaluate(check,profile,d.Zones.First(z=>z.Code==v.Zone),today).Any())throw new DomainException("Resolve all vehicle alerts before confirming departure.",409);
                if(d.Orders.ContainsKey(v.Vin))throw new DomainException("Complete the charging order before departure.",409);
                v.Departed=true;break;
            default:throw new DomainException("Unknown command.",404);
        }
        return new {message="Changes saved."};
    }
    private static void EnsureSafe(Vehicle v)
    {
        if(v.History.Count==0)throw new DomainException("Record an arrival inspection first.",409);
        if(v.QuarantineRequired || v.Zone=="Q-QUAR")throw new DomainException("Vehicle is quarantined or awaiting HSE review.",409);
    }
    private static void Move(YardData d,Vehicle v,string code)
    {
        var zone=d.Zones.Find(z=>z.Code==code) ?? throw new DomainException("Unknown zone.");
        if(d.Orders.GetValueOrDefault(v.Vin)?.Status=="Running")throw new DomainException("Stop charging before moving the vehicle.",409);
        if(v.Zone==code)return;
        if((v.QuarantineRequired || v.Zone=="Q-QUAR") && zone.Type!="Quarantine" && v.Dossier?.Decision!="Released")
            throw new DomainException("HSE must release this vehicle before it leaves quarantine.",409);
        if(zone.Type=="Standard")throw new DomainException("EVs require an EV-compatible zone.",409);
        var count=d.Vehicles.Count(v_=>!v_.Departed && v_.Zone==code);
        if(count>=Math.Min(zone.Capacity,zone.MaxEvs))throw new DomainException("Destination zone is at its EV capacity.",409);
        v.Zone=code;
        if(zone.Type=="Quarantine")
        {
            v.QuarantineRequired=false;
            if(v.Dossier is null || v.Dossier.Decision=="Released")v.Dossier=new(){Reason="Moved directly into quarantine for HSE review",Opened=d.ReferenceDate};
        }
    }
    private static object Import(YardData d,string csv,DateOnly today)
    {
        if(string.IsNullOrWhiteSpace(csv) || csv.Length>2_000_000)throw new DomainException("Provide a CSV file smaller than 2 MB.");
        using var parser=new TextFieldParser(new StringReader(csv));parser.SetDelimiters(",");parser.HasFieldsEnclosedInQuotes=true;
        string[] columns=parser.ReadFields() ?? [];
        var required=new[]{"vin","brand","model","powertrain","kwh","manufacturerCode"};
        if(required.Any(k=>!columns.Contains(k)) || columns.Distinct().Count()!=columns.Length)throw new DomainException("CSV requires unique columns: "+string.Join(", ",required));
        var known=d.Vehicles.Select(v=>v.Vin).ToHashSet();var accepted=0;var line=1;
        List<object> errors=[];
        while(!parser.EndOfData)
        {
            line++;if(line>10001)throw new DomainException("Maximum 10,000 rows per import.");
            var cells=parser.ReadFields() ?? [];
            string Cell(string key) {var i=Array.IndexOf(columns,key);return i>=0 && i<cells.Length ? cells[i].Trim() : "";}
            var vin=Cell("vin").ToUpperInvariant();
            string? error=null;
            if(cells.Length!=columns.Length)error="Column count does not match header.";
            else if(!Vin.IsValid(vin))error="Invalid VIN format or check digit.";
            else if(known.Contains(vin))error="VIN already exists.";
            else if(!new[]{"BEV","PHEV"}.Contains(Cell("powertrain")))error="Powertrain must be BEV or PHEV.";
            else if(!double.TryParse(Cell("kwh"),CultureInfo.InvariantCulture,out var capacity) || !double.IsFinite(capacity) || capacity is <=0 or >300)error="Invalid battery capacity.";
            else if(!d.Manufacturers.Any(f=>f.Code==Cell("manufacturerCode")))error="Unknown manufacturer code.";
            else if(Cell("brand").Length is 0 or >100 || Cell("model").Length is 0 or >100)error="Brand and model are required, at most 100 characters.";
            if(error is not null){errors.Add(new {line,vin,error});continue;}
            var v=new Vehicle {Vin=vin,Fab=Cell("manufacturerCode"),Brand=Cell("brand"),Model=Cell("model"),Powertrain=Cell("powertrain"),
                Kwh=double.Parse(Cell("kwh"),CultureInfo.InvariantCulture),Arrival=today.ToString("yyyy-MM-dd"),Zone="B-EV-1",Soc=0,TwelveV="OK",LastInspection=today.AddDays(-366).ToString("yyyy-MM-dd")};
            var zone=d.Zones.First(z=>z.Code==v.Zone);
            if(d.Vehicles.Count(x=>!x.Departed && x.Zone==zone.Code)>=Math.Min(zone.Capacity,zone.MaxEvs)){errors.Add(new {line,vin,error="Arrival zone full; split this import or free capacity."});continue;}
            var p=Rules.SelectProfile(d.Profiles,v);v.Profile=p.Id;
            // No fabricated arrival measurement: imported vehicles require a real inspection.
            if(!string.IsNullOrWhiteSpace(Cell("departure")))
            {
                if(!DateOnly.TryParseExact(Cell("departure"),"yyyy-MM-dd",CultureInfo.InvariantCulture,DateTimeStyles.None,out var date) || !p.DepartureRules.Any(r=>r.DestinationType==Cell("destination")))
                {errors.Add(new {line,vin,error="Invalid departure date or destination."});continue;}
                v.Departure=date.ToString("yyyy-MM-dd");v.Destination=Cell("destination");
            }
            d.Vehicles.Add(v);known.Add(vin);accepted++;
        }
        return new {accepted,rejected=errors.Count,errors};
    }
}
