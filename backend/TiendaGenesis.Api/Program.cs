using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TiendaGenesisPrueba.Api.Data;
using TiendaGenesisPrueba.Api.Endpoints;
using TiendaGenesisPrueba.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Configurar JWT
var jwtKey = builder.Configuration.GetValue<string>("JwtSettings:SecretKey")
             ?? "TextoSuperSecretoParaDemoDeJWT";

// Configurar la autenticación con JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// Agregar autorización
builder.Services.AddAuthorization();

// Configuración de la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configuración de EF Core con PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(p => p.AddPolicy("AllowAll", policy => {
    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
}));

var app = builder.Build();

app.UseCors("AllowAll");

// Map Endpoints
app.MapChurrascosEndpoints();
app.MapDulcesEndpoints();
app.MapCombosEndpoints();
app.MapInventarioEndpoints();
app.MapVentasEndpoints();
app.MapAuthEndpoints();


// Migrate & Seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    DbInitializer.Initialize(db);
}

// Activar autenticación/autorización
app.UseAuthentication();
app.UseAuthorization();

app.Run();