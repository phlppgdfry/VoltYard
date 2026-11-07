FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source
COPY . .
RUN dotnet publish src/VoltYard.Api -c Release -o /app --nologo
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_URLS=http://+:8080 Data__Path=/data/yard.json
RUN mkdir /data && chown app:app /data
USER app
EXPOSE 8080
ENTRYPOINT ["dotnet", "VoltYard.Api.dll"]
