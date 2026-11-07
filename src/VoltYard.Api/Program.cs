using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.RateLimiting;
using VoltYard.Application;
using VoltYard.Domain;
using VoltYard.Infrastructure;

var builder=WebApplication.CreateBuilder(args);
var password=builder.Configuration["Demo:Password"];
if(string.IsNullOrEmpty(password))
{
    if(!builder.Environment.IsDevelopment())throw new InvalidOperationException("Set Demo__Password (at least 12 characters) or use the Development profile on localhost.");
    password="VoltYard-demo-2026";
}
if(password.Length<12)throw new InvalidOperationException("Demo__Password must have at least 12 characters.");
var secretHash=SHA256.HashData(Encoding.UTF8.GetBytes(password));
var accounts=new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase) { ["admin"]="Admin",["planner"]="Planner",["operator"]="Operator",["hse"]="HSE",["account"]="Account" };
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<IYardStore>(sp=>new FileYardStore(builder.Configuration["Data:Path"] ?? Path.Combine(builder.Environment.ContentRootPath,"../../var/yard.json"),
    Path.Combine(AppContext.BaseDirectory,"Assets/application-data.json"),sp.GetRequiredService<TimeProvider>()));
builder.Services.AddSingleton<YardService>();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(o=>
{
    o.Cookie.Name="voltyard.session";o.Cookie.HttpOnly=true;o.Cookie.SameSite=SameSiteMode.Strict;
    o.Cookie.SecurePolicy=builder.Environment.IsDevelopment()?CookieSecurePolicy.SameAsRequest:CookieSecurePolicy.Always;
    o.ExpireTimeSpan=TimeSpan.FromHours(8);o.SlidingExpiration=false;
    o.Events.OnRedirectToLogin=c=>{c.Response.StatusCode=401;return Task.CompletedTask;};
    o.Events.OnRedirectToAccessDenied=c=>{c.Response.StatusCode=403;return Task.CompletedTask;};
});
builder.Services.AddAuthorization();
builder.Services.AddRateLimiter(o=> { o.RejectionStatusCode=429; o.AddPolicy("login",ctx=>RateLimitPartition.GetFixedWindowLimiter(ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
    _=>new FixedWindowRateLimiterOptions {PermitLimit=5,Window=TimeSpan.FromMinutes(15),QueueLimit=0})); });
var app=builder.Build();
// Force store loading before accepting requests; corrupt stores must never silently reset.
_ = app.Services.GetRequiredService<IYardStore>();
app.Use(async (ctx,next)=>
{
    ctx.Response.Headers["X-Content-Type-Options"]="nosniff";
    ctx.Response.Headers["X-Frame-Options"]="DENY";
    ctx.Response.Headers.CacheControl="no-store";
    if(HttpMethods.IsPost(ctx.Request.Method))
    {
        var origin=ctx.Request.Headers.Origin.ToString();
        if(ctx.Request.Headers["X-VoltYard-Client"]!="web" || (origin.Length>0 && origin!=$"{ctx.Request.Scheme}://{ctx.Request.Host}"))
        {ctx.Response.StatusCode=403;return;}
    }
    try {await next();}
    catch(DomainException ex) {await Results.Problem(statusCode:ex.Status,title:ex.Message).ExecuteAsync(ctx);}
    catch(Microsoft.VisualBasic.FileIO.MalformedLineException) {await Results.Problem(statusCode:400,title:"Malformed CSV quoting.").ExecuteAsync(ctx);}
});
app.UseRateLimiter();app.UseAuthentication();app.UseAuthorization();
app.MapGet("/health",()=>new {status="ok",service="VoltYard"});
app.MapGet("/",()=>Results.Content(File.ReadAllText(Path.Combine(AppContext.BaseDirectory,"Assets/index.template.html")).Replace("__DATA__","null"),"text/html"));
app.MapGet("/favicon.ico",()=>Results.NoContent());
app.MapPost("/api/login",async (Login request,HttpContext ctx)=>
{
    var candidate=SHA256.HashData(Encoding.UTF8.GetBytes(request.Password ?? ""));
    if(!CryptographicOperations.FixedTimeEquals(candidate,secretHash) || !accounts.TryGetValue(request.User ?? "",out var role))return Results.Unauthorized();
    var identity=new ClaimsIdentity([new(ClaimTypes.Name,request.User!.ToLowerInvariant()),new(ClaimTypes.Role,role)],CookieAuthenticationDefaults.AuthenticationScheme);
    await ctx.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,new ClaimsPrincipal(identity));
    return Results.Ok(new {user=request.User,role});
}).RequireRateLimiting("login");
app.MapPost("/api/logout",async (HttpContext ctx)=>{await ctx.SignOutAsync();return Results.Ok();}).RequireAuthorization();
app.MapGet("/api/state",(IYardStore store,HttpContext ctx)=>store.Read(d=>new {data=d,user=ctx.User.Identity!.Name,role=ctx.User.FindFirstValue(ClaimTypes.Role),
    alerts=d.Vehicles.ToDictionary(v=>v.Vin,v=>Rules.Evaluate(v,d.Profiles.First(p=>p.Id==v.Profile),d.Zones.First(z=>z.Code==v.Zone),DateOnly.Parse(d.ReferenceDate)))})).RequireAuthorization();
app.MapPost("/api/commands/{action}",(string action,YardCommand command,YardService service,HttpContext ctx)=>
{
    if(!YardService.Permissions.TryGetValue(action,out var roles))return Results.NotFound();
    if(!roles.Any(ctx.User.IsInRole))return Results.Forbid();
    return Results.Ok(service.Execute(action,command,ctx.User.Identity!.Name!));
}).RequireAuthorization();
app.MapGet("/api/reports/{vin}",(string vin,IYardStore store,TimeProvider clock)=>store.Read(d=>
{
    var vehicle=d.Vehicles.Find(v=>v.Vin==vin) ?? throw new DomainException("Vehicle not found.",404);
    return new {id=Guid.NewGuid(),generatedAt=clock.GetUtcNow(),terminal="Demo Terminal Zeebrugge",vehicle,
        profile=d.Profiles.First(p=>p.Id==vehicle.Profile),profileHistory=d.ProfileHistory.Where(p=>p.Id==vehicle.Profile),
        chargingSessions=d.ChargingSessions.Where(s=>s.Vin==vin),audit=d.Audit.Where(a=>a.Subject==vin),
        alerts=Rules.Evaluate(vehicle,d.Profiles.First(p=>p.Id==vehicle.Profile),d.Zones.First(z=>z.Code==vehicle.Zone),DateOnly.Parse(d.ReferenceDate))};
})).RequireAuthorization();
app.Run();
public sealed record Login(string? User,string? Password);
