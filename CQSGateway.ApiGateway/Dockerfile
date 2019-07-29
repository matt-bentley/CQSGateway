FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS source

COPY . .
WORKDIR /CQSGateway.ApiGateway
RUN dotnet restore "CQSGateway.ApiGateway.csproj"

FROM source AS publish
RUN dotnet publish "CQSGateway.ApiGateway.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .

EXPOSE 80

# Set binding for Kestrel if ASP.NET Core
ENV ASPNETCORE_URLS=http://+:80

ENTRYPOINT ["dotnet", "CQSGateway.ApiGateway.dll"]