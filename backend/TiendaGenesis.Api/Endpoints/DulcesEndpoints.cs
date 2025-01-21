using Microsoft.EntityFrameworkCore;
using TiendaGenesisPrueba.Api.Data;
using TiendaGenesisPrueba.Api.Models;

namespace TiendaGenesisPrueba.Api.Endpoints
{
    public static class DulcesEndpoints
    {
       private const string Endpoint = "/api/dulces";

        public static void MapDulcesEndpoints(this WebApplication app)
        {
            // GET all
            app.MapGet(Endpoint, async (AppDbContext db) =>
            {
                return await db.Dulces.ToListAsync();
            });

            // GET by Id
            app.MapGet($"{Endpoint}/{{id}}", async (AppDbContext db, int id) =>
            {
                var dulce = await db.Dulces.FindAsync(id);
                return dulce is not null ? Results.Ok(dulce) : Results.NotFound();
            });

            // POST
            app.MapPost(Endpoint, async (AppDbContext db, DulceTipico dulce) =>
            {
                db.Dulces.Add(dulce);
                await db.SaveChangesAsync();
                return Results.Created($"{Endpoint}/{dulce.Id}", dulce);
            });

            // PUT
            app.MapPut($"{Endpoint}/{{id}}", async (AppDbContext db, int id, DulceTipico updated) =>
            {
                var existing = await db.Dulces.FindAsync(id);
                if (existing == null) return Results.NotFound();

                existing.Nombre = updated.Nombre;
                existing.CantidadDisponible = updated.CantidadDisponible;

                await db.SaveChangesAsync();
                return Results.Ok(existing);
            });

            // DELETE
            app.MapDelete($"{Endpoint}/{{id}}", async (AppDbContext db, int id) =>
            {
                var dulce = await db.Dulces.FindAsync(id);
                if (dulce == null) return Results.NotFound();

                db.Dulces.Remove(dulce);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
