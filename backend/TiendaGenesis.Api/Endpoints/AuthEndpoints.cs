using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TiendaGenesisPrueba.Api.Data;
using TiendaGenesisPrueba.Api.Models;

namespace TiendaGenesisPrueba.Api.Endpoints
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(this WebApplication app)
        {
            // Registrar un nuevo usuario
            app.MapPost("/api/register", async (AppDbContext db, RegisterRequest request) =>
            {
                // Valida si el usuario no existe
                if (await db.Usuarios.AnyAsync(u => u.Username == request.Username))
                {
                    return Results.BadRequest("Usuario ya existe.");
                }

                // Crea el hash de contraseña
                var passwordHash = HashPassword(request.Password);

                var newUser = new Usuario
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = passwordHash
                };

                db.Usuarios.Add(newUser);
                await db.SaveChangesAsync();
                return Results.Ok("Usuario registrado con éxito.");
            });

            // Login
            app.MapPost("/api/login", async (AppDbContext db, IConfiguration config, LoginRequest login) =>
            {
                // Busca el usuario
                var user = await db.Usuarios.FirstOrDefaultAsync(u => u.Username == login.Username);
                if (user == null) 
                    return Results.Unauthorized();

                // Verificar contraseña
                var passwordOk = VerifyPassword(login.Password, user.PasswordHash);
                if (!passwordOk) 
                    return Results.Unauthorized();

                // Generar JWT
                var jwtKey = config.GetValue<string>("JwtSettings:SecretKey") ?? "";
                var token = GenerateJwtToken(user, jwtKey);

                // Devolvemos el token (y/o datos del usuario si se necesita)
                return Results.Ok(new { token });
            });
        }

        // Genera un JWT con el username
        private static string GenerateJwtToken(Usuario user, string secretKey)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
            };

            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),  // token válido 2h
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Hashear Contraseña (ejemplo con PBKDF2)
        private static string HashPassword(string password)
        {
            // Generar salt
            // En producción se recomienda un salt único y almacenarlo.
            byte[] salt = Encoding.UTF8.GetBytes("thisisasalt");

            // Derivar la key
            var hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password!,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32));

            return hashed;
        }

        // Verificar Contraseña
        private static bool VerifyPassword(string password, string storedHash)
        {
            // Hasheamos la contraseña que ingresa el usuario
            var hashInput = HashPassword(password);
            // Comparamos con el hash en DB
            return hashInput == storedHash;
        }
    }

    public record RegisterRequest(string Username, string Email, string Password);
    public record LoginRequest(string Username, string Password);
}
