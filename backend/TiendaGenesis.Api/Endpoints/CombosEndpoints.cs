using Microsoft.EntityFrameworkCore;
using TiendaGenesisPrueba.Api.Data;
using TiendaGenesisPrueba.Api.Models;

namespace TiendaGenesisPrueba.Api.Endpoints
{
    public static class CombosEndpoints
    {
        private const string Endpoint = "/api/combos";

        public static void MapCombosEndpoints(this WebApplication app)
        {
            // GET all combos (incluir churrascos en combo)
            app.MapGet(Endpoint, async (AppDbContext db) =>
            {
                var combos = await db.Combos
                    .Include(c => c.ChurrascosEnCombo)
                    .ThenInclude(cc => cc.Churrasco)
                    .ThenInclude(ch => ch.Porciones) // si deseas ver porciones
                    .ToListAsync();
                return combos;
            });

            // POST: crear un combo
            app.MapPost(Endpoint, async (AppDbContext db, CreateComboRequest request) =>
            {
                // Creamos el combo
                var combo = new Combo
                {
                    Nombre = request.Nombre,
                    Descripcion = request.Descripcion,
                    CajasDulces = request.CajasDulces
                };
                db.Combos.Add(combo);
                await db.SaveChangesAsync();

                // Crea las filas en ComboChurrasco
                foreach (var churrascoId in request.ChurrascosFamiliaresIds)
                {
                    var cc = new ComboChurrasco
                    {
                        ComboId = combo.Id,
                        ChurrascoId = churrascoId
                    };
                    db.ComboChurrascos.Add(cc);
                }
                await db.SaveChangesAsync();

                // Retorna combo con sus churrascos
                var comboCreado = await db.Combos
                    .Include(c => c.ChurrascosEnCombo)
                    .ThenInclude(cc => cc.Churrasco)
                    .ThenInclude(ch => ch.Porciones)
                    .FirstOrDefaultAsync(c => c.Id == combo.Id);

                return Results.Created($"{Endpoint}/{combo.Id}", comboCreado);
            });

            // DELETE /api/combos/{id}
            app.MapDelete($"{Endpoint}/{{id}}", async (AppDbContext db, int id) =>
            {
                var existing = await db.Combos.FindAsync(id);
                if (existing == null) return Results.NotFound("No existe el combo con ese ID");

                db.Combos.Remove(existing);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }

    public record CreateComboRequest(
        string Nombre,
        string Descripcion,
        int CajasDulces,
        List<int> ChurrascosFamiliaresIds
    );
}
