using Microsoft.EntityFrameworkCore;
using TiendaGenesisPrueba.Api.Data;
using TiendaGenesisPrueba.Api.Models;

namespace TiendaGenesisPrueba.Api.Endpoints
{
    public static class InventarioEndpoints
    {
        private const string Endpoint = "/api/inventario";

        public static void MapInventarioEndpoints(this WebApplication app)
        {
            // GET: /api/inventario
            app.MapGet(Endpoint, async (AppDbContext db) =>
            {
                return await db.Inventario.ToListAsync();
            });

            // PUT: /api/inventario/{id}
            app.MapPut($"{Endpoint}/{{id}}", async (AppDbContext db, int id, InventoryItem updated) =>
            {
                var existing = await db.Inventario.FindAsync(id);
                if (existing is null) 
                    return Results.NotFound("No existe este ítem en el inventario.");

                existing.Cantidad = updated.Cantidad;
                existing.UnidadMedida = updated.UnidadMedida;

                await db.SaveChangesAsync();
                return Results.Ok(existing);
            });
        }
    }
}
