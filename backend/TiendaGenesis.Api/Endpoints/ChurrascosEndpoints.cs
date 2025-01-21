using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TiendaGenesisPrueba.Api.Data;
using TiendaGenesisPrueba.Api.Models;

namespace TiendaGenesisPrueba.Api.Endpoints
{
    public static class ChurrascosEndpoints
    {
        private const string Endpoint = "/api/churrascos";

        public static void MapChurrascosEndpoints(this WebApplication app)
        {
            // GET all (incluir porciones)
            app.MapGet(Endpoint, async (AppDbContext db) =>
            {
                var list = await db.Churrascos
                    .Include(ch => ch.Porciones)
                    .ToListAsync();
                
                var churrascos = list.Select(ch => new {
                    ch.Id,
                    ch.Modalidad,
                    ch.NumeroPorciones,
                    ch.NombrePlato,
                    Porciones = ch.Porciones.Select(p => new {
                        p.Id,
                        p.TipoCarne,
                        p.TerminoCoccion,
                        Guarniciones = p.Guarniciones.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    })
                });

                return churrascos;
            });

            // GET by Id (incluir porciones)
            app.MapGet($"{Endpoint}/{{id}}", async (AppDbContext db, int id) =>
            {
                var churrasco = await db.Churrascos
                    .Include(c => c.Porciones)
                    .FirstOrDefaultAsync(c => c.Id == id);

                return churrasco is not null ? Results.Ok(churrasco) : Results.NotFound();
            });

            // POST: Crear un churrasco con X porciones // [Authorize] .RequireAuthorization()
            app.MapPost(Endpoint, async (AppDbContext db, CreateChurrascoRequest request) =>
            {
                // Validaciones mínimas
                if (request.Modalidad == "Individual" && request.NumeroPorciones != 1)
                {
                    return Results.BadRequest("Para Individual se requiere 1 porción.");
                }
                if (request.Modalidad == "Familiar" && (request.NumeroPorciones != 3 && request.NumeroPorciones != 5))
                {
                    return Results.BadRequest("Para Familiar se requiere 3 o 5 porciones.");
                }

                // Crear la entidad Churrasco
                var churrasco = new Churrasco
                {
                    Modalidad = request.Modalidad,
                    NumeroPorciones = request.NumeroPorciones,
                    NombrePlato = request.NombrePlato,
                    Porciones = new List<PorcionChurrasco>()
                };

                db.Churrascos.Add(churrasco);
                await db.SaveChangesAsync(); 

                // Crear las porciones
                foreach (var porcionReq in request.Porciones)
                {
                    var porcion = new PorcionChurrasco
                    {
                        ChurrascoId = churrasco.Id,
                        TipoCarne = porcionReq.TipoCarne,
                        TerminoCoccion = porcionReq.TerminoCoccion,
                        Guarniciones = string.Join(",", porcionReq.Guarniciones)
                    };
                    db.PorcionesChurrasco.Add(porcion);
                }

                await db.SaveChangesAsync();

                // Retornar el churrasco con sus porciones
                var churrascoCreado = await db.Churrascos
                    .Include(c => c.Porciones)
                    .FirstOrDefaultAsync(c => c.Id == churrasco.Id);

                return Results.Created($"{Endpoint}/{churrasco.Id}", churrascoCreado);
            });

            // PUT: Actualizar un churrasco y sus porciones
            app.MapPut($"{Endpoint}/{{id}}", async (AppDbContext db, int id, UpdateChurrascoRequest request) =>
            {
                var existing = await db.Churrascos
                    .Include(c => c.Porciones)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (existing is null) return Results.NotFound();

                // Validar
                if (request.Modalidad == "Individual" && request.NumeroPorciones != 1)
                {
                    return Results.BadRequest("Para Individual se requiere 1 porción.");
                }
                if (request.Modalidad == "Familiar" && (request.NumeroPorciones != 3 && request.NumeroPorciones != 5))
                {
                    return Results.BadRequest("Para Familiar se requiere 3 o 5 porciones.");
                }

                // Actualizar datos del churrasco
                existing.Modalidad = request.Modalidad;
                existing.NumeroPorciones = request.NumeroPorciones;
                existing.NombrePlato = request.NombrePlato;

                // Manejo de porciones:
                // Elimina porciones actuales
                db.PorcionesChurrasco.RemoveRange(existing.Porciones);

                // Crea porciones nuevas (del request)
                foreach (var porcionReq in request.Porciones)
                {
                    var newPorcion = new PorcionChurrasco
                    {
                        ChurrascoId = existing.Id,
                        TipoCarne = porcionReq.TipoCarne,
                        TerminoCoccion = porcionReq.TerminoCoccion,
                        Guarniciones = string.Join(",", porcionReq.Guarniciones)
                    };
                    db.PorcionesChurrasco.Add(newPorcion);
                }

                await db.SaveChangesAsync();

                // Recargar con sus porciones
                var updatedChurrasco = await db.Churrascos
                    .Include(c => c.Porciones)
                    .FirstOrDefaultAsync(c => c.Id == existing.Id);

                return Results.Ok(updatedChurrasco);
            });

            // DELETE
            app.MapDelete($"{Endpoint}/{{id}}", async (AppDbContext db, int id) =>
            {
                var churrasco = await db.Churrascos.FindAsync(id);
                if (churrasco is null) return Results.NotFound();

                db.Churrascos.Remove(churrasco);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }

    public record CreateChurrascoRequest(
        string Modalidad,          // "Individual" o "Familiar"
        int NumeroPorciones,       // 1, 3 o 5
        string NombrePlato,
        List<PorcionChurrascoDto> Porciones
    );

    public record UpdateChurrascoRequest(
        string Modalidad,
        int NumeroPorciones,
        string NombrePlato,
        List<PorcionChurrascoDto> Porciones
    );

    public record PorcionChurrascoDto(
        string TipoCarne,         // "Puyazo", "Culotte", "Costilla"
        string TerminoCoccion,    // "Término medio", etc.
        List<string> Guarniciones     // "frijoles,chile de árbol"
    );
}
