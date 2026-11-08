using System.Text.Json;
using VoltYard.Application;
using VoltYard.Domain;
namespace VoltYard.Infrastructure;

// One process owns one store. Writes use copy-on-write and atomic replacement.
public sealed class FileYardStore : IYardStore, IDisposable
{
    public static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web) { WriteIndented = false };
    private readonly object gate = new();
    private readonly string path;
    private readonly TimeProvider clock;
    private YardData data;
    private readonly FileStream processLock;
    private bool disposed;
    private static YardData Clone(YardData d) => JsonSerializer.Deserialize<YardData>(JsonSerializer.Serialize(d,Json),Json)!;
    public FileYardStore(string path, string seedPath, TimeProvider clock)
    {
        this.path=Path.GetFullPath(path); this.clock=clock;
        Directory.CreateDirectory(Path.GetDirectoryName(this.path)!);
        processLock = new FileStream(this.path + ".lock", FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None);
        try
        {
            if (File.Exists(this.path)) data=JsonSerializer.Deserialize<YardData>(File.ReadAllText(this.path),Json) ?? throw new InvalidDataException("Empty yard store.");
            else
            {
                data=JsonSerializer.Deserialize<YardData>(File.ReadAllText(seedPath),Json)!;
                var shift=Today.DayNumber-DateOnly.Parse(data.ReferenceDate).DayNumber;
                string Shift(string d) => DateOnly.Parse(d).AddDays(shift).ToString("yyyy-MM-dd");
                foreach (var v in data.Vehicles)
                {
                    v.Arrival=Shift(v.Arrival);v.LastInspection=Shift(v.LastInspection);
                    if(v.Departure is not null)v.Departure=Shift(v.Departure);
                    foreach(var h in v.History)h.T=Shift(h.T);
                    if(v.Dossier is not null)v.Dossier.Opened=Shift(v.Dossier.Opened);
                }
                data.ChargingSessions=data.ChargingSessions.Select(s=>s with {Start=s.Start.AddDays(shift),End=s.End.AddDays(shift)}).ToList();
                data.ReferenceDate=Today.ToString("yyyy-MM-dd");
                Save(data);
            }
        }
        catch
        {
            processLock.Dispose();
            throw;
        }
    }
    private DateOnly Today => DateOnly.FromDateTime(clock.GetUtcNow().UtcDateTime);
    public T Read<T>(Func<YardData,T> query)
    {
        lock(gate)
        {
            ObjectDisposedException.ThrowIf(disposed, this);
            var copy=Clone(data);copy.ReferenceDate=Today.ToString("yyyy-MM-dd");
            return query(copy);
        }
    }
    public T Write<T>(long revision,string actor,string action,string subject,Func<YardData,T> command)
    {
        lock(gate)
        {
            ObjectDisposedException.ThrowIf(disposed, this);
            if(revision!=data.Revision)throw new DomainException("The yard changed. Reload and try again.",409);
            var next=Clone(data);next.ReferenceDate=Today.ToString("yyyy-MM-dd");
            var result=command(next);
            next.Revision++;
            next.Audit.Add(new(Guid.NewGuid(),clock.GetUtcNow(),actor,action,subject,"Command committed"));
            foreach(var z in next.Zones)z.Count=next.Vehicles.Count(v=>!v.Departed && v.Zone==z.Code);
            Save(next);data=next;return result;
        }
    }
    public void Dispose()
    {
        lock(gate)
        {
            if(disposed) return;
            disposed = true;
            processLock.Dispose();
        }
    }
    private void Save(YardData next)
    {
        var temporary=path+".tmp";
        using(var stream=new FileStream(temporary,FileMode.Create,FileAccess.Write,FileShare.None))
        { JsonSerializer.Serialize(stream,next,Json);stream.Flush(true); }
        File.Move(temporary,path,true);
    }
}
