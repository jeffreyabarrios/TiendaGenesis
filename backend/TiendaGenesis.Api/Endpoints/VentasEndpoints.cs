using Microsoft.EntityFrameworkCore;
using TiendaGenesisPrueba.Api.Data;
using TiendaGenesisPrueba.Api.Models;

namespace TiendaGenesisPrueba.Api.Endpoints
{
    public static class VentasEndpoints
    {
        private const string Endpoint = "/api/ventas";

        public static void MapVentasEndpoints(this WebApplication app)
        {
            // POST: Registrar una venta
            app.MapPost(Endpoint, async (AppDbContext db, VentaRequest request) =>
            {
                // Crear la venta
                var nuevaVenta = new Venta
                {
                    Descripcion = request.Descripcion,
                    MontoTotal = request.MontoTotal
                };
                
                db.Ventas.Add(nuevaVenta);

                // Descontar del inventario según lo vendido
                foreach (var itemVendido in request.ItemsVendidos)
                {
                    if (itemVendido.Tipo == "Churrasco")
                    {
                        await DescontarInventarioChurrasco(db, itemVendido);
                    }
                    else if (itemVendido.Tipo == "Dulce")
                    {
                        // Descontar dulces
                        await DescontarInventarioDulces(db, itemVendido);
                    }
                    else if (itemVendido.Tipo == "Combo")
                    {
                        // Lógica especial de combos: 
                        await DescontarInventarioCombo(db, itemVendido);
                    }
                }

                await db.SaveChangesAsync();

                return Results.Created($"{Endpoint}/{nuevaVenta.Id}", nuevaVenta);
            });
        }

        private static async Task DescontarInventarioChurrasco(AppDbContext db, ItemVendido item)
        {

            var inventarioCarne = await db.Inventario
                .FirstOrDefaultAsync(i => i.Nombre.ToLower() == item.Name.ToLower() && i.Categoria == "Carne");
            if (inventarioCarne != null)
            {

                inventarioCarne.Cantidad -= item.Cantidad; 
                if (inventarioCarne.Cantidad < 0) inventarioCarne.Cantidad = 0;
            }
        }

        private static async Task DescontarInventarioDulces(AppDbContext db, ItemVendido item)
        {

            var inventarioDulce = await db.Inventario
                .FirstOrDefaultAsync(i => i.Nombre.ToLower() == item.Name.ToLower() && i.Categoria == "Dulce");
            if (inventarioDulce != null)
            {
                inventarioDulce.Cantidad -= item.Cantidad;
                if (inventarioDulce.Cantidad < 0) inventarioDulce.Cantidad = 0;
            }

            var dulceTipico = await db.Dulces
                .FirstOrDefaultAsync(d => d.Nombre.ToLower() == item.Name.ToLower());
            if (dulceTipico != null)
            {
                dulceTipico.CantidadDisponible -= item.Cantidad;
                if (dulceTipico.CantidadDisponible < 0) dulceTipico.CantidadDisponible = 0;
            }
        }

        private static async Task DescontarInventarioCombo(AppDbContext db, ItemVendido item)
        {
            if (item.Name == "Combo Familiar")
            {
                await DescontarCarne(db, 3);
                await DescontarCajasDulces(db, 1, 6);
            }
            else if (item.Name == "Combo para eventos")
            {
                // 3 platos familiares => 3 * 3 = 9 libras (ejemplo), 
                // 2 cajas grandes => "Cajas de 24 dulces" x 2
                await DescontarCarne(db, 9);
                await DescontarCajasDulces(db, 2, 24);
            }
        }

        private static async Task DescontarCarne(AppDbContext db, int libras)
        {
            var carneInventario = await db.Inventario
                .FirstOrDefaultAsync(i => i.Nombre == "Puyazo"); 
            if (carneInventario != null)
            {
                carneInventario.Cantidad -= libras;
                if (carneInventario.Cantidad < 0) carneInventario.Cantidad = 0;
            }
        }

        private static async Task DescontarCajasDulces(AppDbContext db, int quantity, int dulcesPorCaja)
        {
            // localiza item en Inventario
            var nombreCaja = dulcesPorCaja == 24 ? "Cajas de 24 dulces"
                : dulcesPorCaja == 12 ? "Cajas de 12 dulces"
                : "Cajas de 6 dulces";

            var caja = await db.Inventario
                .FirstOrDefaultAsync(i => i.Nombre == nombreCaja);
            if (caja != null)
            {
                caja.Cantidad -= quantity;
                if (caja.Cantidad < 0) caja.Cantidad = 0;
            }
        }
    }

    // Este record define cómo viene la petición de venta
    public record VentaRequest(
        string Descripcion,
        decimal MontoTotal,
        List<ItemVendido> ItemsVendidos
    );

    public record ItemVendido(
        string Tipo,   // "Churrasco", "Dulce", "Combo", etc.
        string Name,   // "Puyazo", "Combo Familiar", "Cocadas" ...
        int Cantidad
    );
}
