using VoltYard.Domain;
namespace VoltYard.Application;
public interface IYardStore
{
    T Read<T>(Func<YardData,T> query);
    T Write<T>(long revision, string actor, string action, string subject, Func<YardData,T> command);
}
