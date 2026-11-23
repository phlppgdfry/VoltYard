using System.Text.Json;
using VoltYard.Domain;
using VoltYard.Application;
using VoltYard.Infrastructure;
using Xunit;
namespace VoltYard.Tests;
public class ShiftWorkTests
{
    private static readonly DateTimeOffset Now=new(2026,9,28,12,0,0,TimeSpan.Zero);
    private static YardData Seed()=>new(){ReferenceDate="2026-09-28",Profiles=[new(){Id="P",Name="Demo",CriticalSoc=15,MinStorageSoc=30,TargetStorageSoc=50,MaxChargeSoc=60,InspectionIntervalDays=14,DepartureRules=[new("Truck",20,60)]}],Zones=[new(){Code="EV",Capacity=100,MaxEvs=100},new(){Code="Q-QUAR",Type="Quarantine",Capacity=20,MaxEvs=20}],Vehicles=[new(){Vin="VIN",Profile="P",Zone="EV",Arrival="2026-09-28",LastInspection="2026-09-28",Soc=10,History=[new(){T="2026-09-28",Soc=10}],Departure="2026-09-28",Destination="Truck"}]};
    [Fact] public void Overdue_and_departure_urgency_are_explicit_and_safety_takes_precedence()
    {
        var d=Seed();d.WorkAssignments["VIN:charging"]=new(){Vin="VIN",Kind="charging",Owner="operator",DueAt=Now.AddHours(-1)};
        var task=ShiftWork.Build(d,Now).First();Assert.Equal(375,task.Priority);Assert.True(task.Overdue);Assert.Contains("(+50)",task.Explanation);
        d.Vehicles[0].QuarantineRequired=true;Assert.Equal("safety",ShiftWork.Build(d,Now).First().Kind);
    }
    [Fact] public void A_forecast_below_minimum_at_an_already_reached_charge_target_requires_review()
    {
        var d=Seed();d.Vehicles[0].Departure=null;d.Vehicles[0].Soc=60;d.Profiles[0].DefaultDischargePerDay=5;
        var tasks=ShiftWork.Build(d,Now);Assert.Contains(tasks,t=>t.Kind=="inspection");Assert.DoesNotContain(tasks,t=>t.Kind=="charging");
    }
    [Fact] public void Completion_is_derived_and_a_new_trigger_reopens_the_assignment()
    {
        var d=Seed();d.WorkAssignments["VIN:charging"]=new(){Vin="VIN",Kind="charging",Owner="operator",DueAt=Now};
        d.Vehicles[0].Soc=50;Assert.True(ShiftWork.Build(d,Now).Single(t=>t.Kind=="charging").Completed);
        d.Vehicles[0].Soc=10;Assert.False(ShiftWork.Build(d,Now).Single(t=>t.Kind=="charging").Completed);
    }
    [Theory][InlineData("hse",0)][InlineData("unknown",0)][InlineData("operator",366)]
    public void Invalid_assignment_leaves_store_unchanged(string owner,int days)
    {
        using var f=new Fixture();var service=new YardService(f.Store,new Clock());
        Assert.Throws<DomainException>(()=>service.Execute("task-save",new(){Vin="VIN",Kind="charging",Owner=owner,DueAt=Now.AddDays(days)},"planner"));
        Assert.Equal(0,f.Store.Read(d=>d.Revision));Assert.Empty(f.Store.Read(d=>d.WorkAssignments));
    }
    [Fact] public void Assignment_reschedule_unassignment_and_provenance_are_persistent()
    {
        using var f=new Fixture();var service=new YardService(f.Store,new Clock());
        service.Execute("task-save",new(){Vin="VIN",Kind="charging",Owner="operator",DueAt=Now},"planner");
        service.Execute("task-save",new(){Revision=1,Vin="VIN",Kind="charging",Owner="admin",DueAt=Now.AddHours(2)},"admin");
        Assert.Equal("planner",f.Store.Read(d=>d.WorkAssignmentChanges[0].Actor));Assert.Equal("admin",f.Store.Read(d=>d.WorkAssignments["VIN:charging"].Owner));
        service.Execute("task-unassign",new(){Revision=2,Vin="VIN",Kind="charging"},"planner");
        Assert.Empty(f.Store.Read(d=>d.WorkAssignments));Assert.Equal(3,f.Store.Read(d=>d.WorkAssignmentChanges.Count));
        f.Store.Dispose();using var reopened=new FileYardStore(f.Path,f.SeedPath,new Clock());Assert.Equal(3,reopened.Read(d=>d.WorkAssignmentChanges.Count));
    }
    [Fact] public void Invented_or_completed_work_cannot_be_assigned()
    {
        using var f=new Fixture();var service=new YardService(f.Store,new Clock());
        Assert.Throws<DomainException>(()=>service.Execute("task-save",new(){Vin="VIN",Kind="inspection",Owner="operator",DueAt=Now},"planner"));
        f.Store.Write(0,"test","resolve","VIN",d=>{d.Vehicles[0].Soc=50;return true;});
        Assert.Throws<DomainException>(()=>service.Execute("task-save",new(){Revision=1,Vin="VIN",Kind="charging",Owner="operator",DueAt=Now},"planner"));
    }
    private sealed class Clock:TimeProvider {public override DateTimeOffset GetUtcNow()=>Now;}
    private sealed class Fixture:IDisposable
    {
        private readonly string dir=System.IO.Path.Combine(System.IO.Path.GetTempPath(),"voltyard-shift-"+Guid.NewGuid());
        public string Path=>System.IO.Path.Combine(dir,"yard.json");public string SeedPath=>System.IO.Path.Combine(dir,"seed.json");public FileYardStore Store{get;}
        public Fixture(){Directory.CreateDirectory(dir);File.WriteAllText(SeedPath,JsonSerializer.Serialize(Seed(),FileYardStore.Json));Store=new(Path,SeedPath,new Clock());}
        public void Dispose(){Store.Dispose();Directory.Delete(dir,true);}
    }
}
