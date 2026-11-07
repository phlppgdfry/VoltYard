namespace VoltYard.Domain;

public sealed class YardData
{
    public string ReferenceDate { get; set; } = "";
    public List<RuleProfile> Profiles { get; set; } = [];
    public List<Manufacturer> Manufacturers { get; set; } = [];
    public List<Zone> Zones { get; set; } = [];
    public List<Charger> Chargers { get; set; } = [];
    public Dictionary<string, Billing> Billing { get; set; } = [];
    public List<Vehicle> Vehicles { get; set; } = [];
    public int TotalVehicles => Vehicles.Count;
    public List<ChargingSession> ChargingSessions { get; set; } = [];
    public Dictionary<string, ChargingOrder> Orders { get; set; } = [];
    public List<AuditEntry> Audit { get; set; } = [];
    public List<RuleProfile> ProfileHistory { get; set; } = [];
    public long Revision { get; set; }
}
public sealed record Manufacturer(string Code, string Name);
public sealed class Vehicle
{
    public string Vin { get; set; } = "";
    public string Fab { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Model { get; set; } = "";
    public string Powertrain { get; set; } = "BEV";
    public double Kwh { get; set; }
    public string Zone { get; set; } = "";
    public string Profile { get; set; } = "";
    public string Arrival { get; set; } = "";
    public string? Departure { get; set; }
    public string? Destination { get; set; }
    public bool Departed { get; set; }
    public bool Driveable { get; set; } = true;
    public double Soc { get; set; }
    public string TwelveV { get; set; } = "OK";
    public string LastInspection { get; set; } = "";
    public List<Inspection> History { get; set; } = [];
    public bool QuarantineRequired { get; set; }
    public QuarantineCase? Dossier { get; set; }
}
public sealed class Inspection
{
    public string T { get; set; } = "";
    public double Soc { get; set; }
    public string TwelveV { get; set; } = "OK";
    public bool Damage { get; set; }
    public bool Suspected { get; set; }
    public string Note { get; set; } = "";
    public string Source { get; set; } = "Manual";
    public string ProfileId { get; set; } = "";
    public int ProfileVersion { get; set; }
    public string Actor { get; set; } = "";
    public DateTimeOffset? RecordedAt { get; set; }
}
public sealed class QuarantineCase
{
    public string Reason { get; set; } = "";
    public string Opened { get; set; } = "";
    public string Decision { get; set; } = "Open";
    public string? Justification { get; set; }
    public string? DecidedBy { get; set; }
}
public sealed class RuleProfile
{
    public string Id { get; set; } = "";
    public string? ManufacturerCode { get; set; }
    public string Name { get; set; } = "";
    public string Powertrain { get; set; } = "BEV";
    public string? ModelPattern { get; set; }
    public double MinStorageSoc { get; set; }
    public double TargetStorageSoc { get; set; }
    public double MaxChargeSoc { get; set; }
    public double CriticalSoc { get; set; }
    public int InspectionIntervalDays { get; set; }
    public int TwelveVoltIntervalDays { get; set; }
    public double DefaultDischargePerDay { get; set; }
    public int Version { get; set; }
    public string EffectiveFrom { get; set; } = "";
    public List<DepartureRule> DepartureRules { get; set; } = [];
}
public sealed record DepartureRule(string DestinationType, double MinSoc, double MaxSoc);
public sealed class Zone
{
    public string Code { get; set; } = "";
    public string Type { get; set; } = "EV";
    public int Capacity { get; set; }
    public int MaxEvs { get; set; }
    public int Count { get; set; }
}
public sealed class Charger
{
    public string Code { get; set; } = "";
    public string Type { get; set; } = "Fixed";
    public double PowerKw { get; set; }
    public string? Zone { get; set; }
    public int Connectors { get; set; } = 1;
    public string Status { get; set; } = "Available";
    public string? OccupiedBy { get; set; }
}
public sealed class Billing { public int Sessions { get; set; } public double Kwh { get; set; } }
public sealed class ChargingOrder
{
    public string Status { get; set; } = "Approved";
    public string? Charger { get; set; }
    public double StartSoc { get; set; }
    public DateTimeOffset? StartedAt { get; set; }
}
public sealed record ChargingSession(string Vin, string ManufacturerCode, string Charger, DateTimeOffset Start,
    DateTimeOffset End, double StartSoc, double EndSoc, double Kwh, bool EstimatedKwh);
public sealed record AuditEntry(Guid Id, DateTimeOffset At, string Actor, string Action, string Subject, string Detail);
public sealed record RuleAlert(string Code, string Severity, string Msg, string Action);
public sealed class DomainException(string message, int status = 400) : Exception(message) { public int Status { get; } = status; }
