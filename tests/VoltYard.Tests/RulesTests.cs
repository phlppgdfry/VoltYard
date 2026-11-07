using System.Text.Json;
using VoltYard.Application;
using VoltYard.Domain;
using VoltYard.Infrastructure;
using Xunit;
namespace VoltYard.Tests;

public class RulesTests
{
    private static readonly DateOnly Today=new(2026,9,28);
    private static RuleProfile Profile()=>new(){Id="TEST",Name="Test profile",MinStorageSoc=30,TargetStorageSoc=50,MaxChargeSoc=60,CriticalSoc=15,
        InspectionIntervalDays=14,TwelveVoltIntervalDays=14,DefaultDischargePerDay=.1,DepartureRules=[new("Shipping",20,50),new("Dealer",50,80)]};
    private static Vehicle Vehicle(double soc=50)=>new(){Vin="1HGCM82633A004352",Profile="TEST",Soc=soc,Zone="EV",LastInspection="2026-09-28",Arrival="2026-09-01"};
    private static Zone Zone()=>new(){Code="EV",Type="EV",Capacity=20,MaxEvs=20};
    [Theory]
    [InlineData(12,"SOC_CRITICAL")][InlineData(15,"SOC_BELOW_MIN")][InlineData(24,"SOC_BELOW_MIN")]
    public void Storage_rules_have_exclusive_severity(double soc,string expected)
    {
        var alerts=Rules.Evaluate(Vehicle(soc),Profile(),Zone(),Today);
        Assert.Single(alerts,a=>a.Code.StartsWith("SOC_"));
        Assert.Contains(alerts,a=>a.Code==expected);
    }
    [Fact] public void Exact_storage_minimum_is_allowed_but_forecast_can_warn()
    {
        var alerts=Rules.Evaluate(Vehicle(30),Profile(),Zone(),Today);
        Assert.DoesNotContain(alerts,a=>a.Code=="SOC_BELOW_MIN");
        Assert.Contains(alerts,a=>a.Code=="SOC_PREDICTED_LOW");
    }
    [Theory][InlineData(14,false)][InlineData(15,true)]
    public void Inspection_interval_boundary(int days,bool overdue)
    {
        var v=Vehicle();v.LastInspection=Today.AddDays(-days).ToString("yyyy-MM-dd");
        Assert.Equal(overdue,Rules.Evaluate(v,Profile(),Zone(),Today).Any(a=>a.Code=="INSPECTION_OVERDUE"));
    }
    [Fact] public void Forecast_accounts_for_age_of_last_measurement()
    {
        var v=Vehicle(32);v.LastInspection="2026-09-01";
        Assert.Contains(Rules.Evaluate(v,Profile(),Zone(),Today),a=>a.Code=="SOC_PREDICTED_LOW");
    }
    [Fact] public void Forecast_uses_latest_declining_segment_after_charging()
    {
        var v=Vehicle(49);v.History=[new(){T="2026-09-10",Soc=30},new(){T="2026-09-12",Soc=50,Source="Charging"},new(){T="2026-09-28",Soc=49}];
        Assert.Equal(1d/16,Rules.Discharge(v,Profile()),6);
    }
    [Theory][InlineData(4,true)][InlineData(7,true)][InlineData(8,false)]
    public void Departure_window_is_inclusive(int days,bool expected)
    {
        var v=Vehicle(58);v.Departure=Today.AddDays(days).ToString("yyyy-MM-dd");v.Destination="Shipping";
        Assert.Equal(expected,Rules.Evaluate(v,Profile(),Zone(),Today).Any(a=>a.Code=="DEPARTURE_SOC_HIGH"));
    }
    [Fact] public void Target_respects_departure_maximum_and_minimum()
    {
        var v=Vehicle();var p=Profile();p.TargetStorageSoc=55;p.DepartureRules=[new("Shipping",20,45),new("Dealer",60,80)];v.Departure="2026-10-01";v.Destination="Shipping";
        Assert.Equal(45,Rules.Target(v,p,Today));v.Destination="Dealer";Assert.Equal(60,Rules.Target(v,p,Today));
    }
    [Fact] public void Conflicting_limits_require_review()
    {
        var v=Vehicle();v.Departure="2026-10-01";v.Destination="Dealer";var p=Profile();p.DepartureRules=[new("Dealer",70,80)];
        Assert.Throws<DomainException>(()=>Rules.Target(v,p,Today));
    }
    [Fact] public void Quarantine_and_wrong_zone_are_detected()
    {
        var v=Vehicle();v.QuarantineRequired=true;var zone=Zone();zone.Type="Standard";
        var alerts=Rules.Evaluate(v,Profile(),zone,Today);
        Assert.Contains(alerts,a=>a.Code=="QUARANTINE_REQUIRED");Assert.Contains(alerts,a=>a.Code=="WRONG_ZONE");
    }
    [Theory][InlineData("1HGCM82633A004352",true)][InlineData("1HGCM82643A004352",false)][InlineData("1HGCM82633AO04352",false)][InlineData("short",false)]
    public void Vin_requires_format_and_check_digit(string vin,bool valid)=>Assert.Equal(valid,Vin.IsValid(vin));
    [Fact] public void Model_specific_profile_wins_and_unknown_brand_falls_back()
    {
        var fallback=Profile();fallback.Id="TERMINAL-DEFAULT";var generic=Profile();generic.ManufacturerCode="VLT";
        var specific=Profile();specific.ManufacturerCode="VLT";specific.ModelPattern="Voltara V7*";specific.Id="V7";
        var v=Vehicle();v.Fab="VLT";v.Model="Voltara V7 Long Range";
        Assert.Same(specific,Rules.SelectProfile([fallback,generic,specific],v));v.Fab="OTHER";
        Assert.Same(fallback,Rules.SelectProfile([fallback,generic,specific],v));
    }
    [Theory][InlineData(-1,30,50,60)][InlineData(15,51,50,60)][InlineData(15,30,70,60)][InlineData(15,30,50,101)]
    public void Invalid_profile_order_is_rejected(double critical,double minimum,double target,double maximum)
    {
        var p=Profile();p.CriticalSoc=critical;p.MinStorageSoc=minimum;p.TargetStorageSoc=target;p.MaxChargeSoc=maximum;
        Assert.Throws<DomainException>(()=>Rules.Validate(p));
    }
    [Fact] public void Persistence_rejects_stale_revision_and_rolls_back_failed_commands()
    {
        using var fixture=new StoreFixture();var store=fixture.Store;
        store.Write(0,"test","test","vin",d=>{d.Vehicles[0].Soc=42;return true;});
        Assert.Throws<DomainException>(()=>store.Write(0,"test","stale","vin",d=>true));
        Assert.Throws<DomainException>(()=>store.Write<bool>(1,"test","failure","vin",d=>{d.Vehicles[0].Soc=1;throw new DomainException("fail");}));
        Assert.Equal(42,store.Read(d=>d.Vehicles[0].Soc));
        Assert.Equal(42,new FileYardStore(fixture.Path,fixture.Seed,new FixedClock()).Read(d=>d.Vehicles[0].Soc));
        Assert.Single(store.Read(d=>d.Audit));
    }
    [Fact] public void Charging_is_blocked_in_quarantine_and_requires_approval()
    {
        using var f=new StoreFixture();var service=new YardService(f.Store,new FixedClock());
        Assert.Throws<DomainException>(()=>service.Execute("charge-start",new(){Vin="1HGCM82633A004352"},"test"));
        f.Store.Write(0,"test","isolate","vin",d=>{d.Vehicles[0].Zone="Q-QUAR";return true;});
        Assert.Throws<DomainException>(()=>service.Execute("charge-approve",new(){Vin="1HGCM82633A004352",Revision=1},"test"));
    }
    [Fact] public void Inspection_history_is_append_only_and_profile_version_is_recorded()
    {
        using var f=new StoreFixture();var service=new YardService(f.Store,new FixedClock());
        service.Execute("inspect",new(){Vin="1HGCM82633A004352",Soc=40,TwelveV="Weak"},"operator");
        var h=f.Store.Read(d=>d.Vehicles[0].History.Single());Assert.Equal("operator",h.Actor);Assert.Equal(1,h.ProfileVersion);
    }
    [Fact] public void Null_departure_rules_are_rejected_as_validation_errors()
    {
        var p=Profile();p.DepartureRules=null!;Assert.Throws<DomainException>(()=>Rules.Validate(p));
    }
    [Fact] public void Direct_quarantine_movement_creates_a_review_case()
    {
        using var f=new StoreFixture();var service=new YardService(f.Store,new FixedClock());
        service.Execute("move",new(){Vin="1HGCM82633A004352",Zone="Q-QUAR"},"operator");
        var v=f.Store.Read(d=>d.Vehicles[0]);Assert.Equal("Q-QUAR",v.Zone);Assert.NotNull(v.Dossier);Assert.Equal("Open",v.Dossier.Decision);
    }
    [Fact] public void Charging_requires_a_real_arrival_observation()
    {
        using var f=new StoreFixture();var service=new YardService(f.Store,new FixedClock());
        var error=Assert.Throws<DomainException>(()=>service.Execute("charge-approve",new(){Vin="1HGCM82633A004352"},"planner"));
        Assert.Contains("arrival inspection",error.Message);
    }
    private sealed class FixedClock:TimeProvider {public override DateTimeOffset GetUtcNow()=>new(2026,9,28,12,0,0,TimeSpan.Zero);}
    private sealed class StoreFixture:IDisposable
    {
        private readonly string directory=System.IO.Path.Combine(System.IO.Path.GetTempPath(),"voltyard-tests-"+Guid.NewGuid());
        public string Path=>System.IO.Path.Combine(directory,"store.json");
        public string Seed=>System.IO.Path.Combine(directory,"seed.json");
        public FileYardStore Store {get;}
        public StoreFixture()
        {
            Directory.CreateDirectory(directory);var p=Profile();p.Version=1;
            var data=new YardData{ReferenceDate="2026-09-28",Profiles=[p],Vehicles=[Vehicle(20)],Zones=[Zone(),new(){Code="Q-QUAR",Type="Quarantine",Capacity=20,MaxEvs=20}]};
            File.WriteAllText(Seed,JsonSerializer.Serialize(data,FileYardStore.Json));Store=new(Path,Seed,new FixedClock());
        }
        public void Dispose()=>Directory.Delete(directory,true);
    }
}
