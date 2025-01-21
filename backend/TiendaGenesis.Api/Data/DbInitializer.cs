using TiendaGenesisPrueba.Api.Models;

namespace TiendaGenesisPrueba.Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
           // Churrascos de ejemplo
            if (!context.Churrascos.Any())
            {
                var ch1 = new Churrasco
                {
                    Modalidad = "Familiar",
                    NumeroPorciones = 3,
                    NombrePlato = "Churrasco Familiar Demo",
                    Porciones = new List<PorcionChurrasco>
                    {
                        new PorcionChurrasco {
                            TipoCarne = "Puyazo",
                            TerminoCoccion = "Término medio",
                            Guarniciones = "Frijoles,Chile de árbol"
                        },
                        new PorcionChurrasco {
                            TipoCarne = "Costilla",
                            TerminoCoccion = "Bien cocido",
                            Guarniciones = "Tortillas,Cebollín"
                        },
                        new PorcionChurrasco {
                            TipoCarne = "Culotte",
                            TerminoCoccion = "Término tres cuartos",
                            Guarniciones = "Chirmol"
                        }
                    }
                };

                var ch2 = new Churrasco
                {
                    Modalidad = "Individual",
                    NumeroPorciones = 1,
                    NombrePlato = "Churrasco Individual Demo",
                    Porciones = new List<PorcionChurrasco>
                    {
                        new PorcionChurrasco {
                            TipoCarne = "Puyazo",
                            TerminoCoccion = "Término medio",
                            Guarniciones = "Chirmol,frijoles"
                        }
                    }
                };

                context.Churrascos.AddRange(ch1, ch2);
                context.SaveChanges();
            }

            // Dulces típicos
            if (!context.Dulces.Any())
            {
                var dulcesList = new List<string>
                {
                    "Canillitas de leche",
                    "Pepitoria",
                    "Cocadas",
                    "Dulces de higo",
                    "Mazapanes",
                    "Chilacayotes",
                    "Conservas de coco",
                    "Colochos de guayaba"
                };

                foreach (var nombreDulce in dulcesList)
                {
                    context.Dulces.Add(new DulceTipico
                    {
                        Nombre = nombreDulce,
                        CantidadDisponible = 100 // valor de ejemplo
                    });
                }
            }

            // Combos
            if (!context.Combos.Any())
            {
                context.Combos.AddRange(
                    new Combo
                    {
                        Nombre = "Combo Familiar",
                        Descripcion = "1 plato familiar de churrasco + 1 caja de dulces típicos",
                        Precio = 100m
                    },
                    new Combo
                    {
                        Nombre = "Combo para Eventos",
                        Descripcion = "3 platos familiares + 2 cajas grandes de dulces",
                        Precio = 300m
                    },
                    new Combo
                    {
                        Nombre = "Combo Temporada",
                        Descripcion = "Combo personalizado de temporada",
                        Precio = 150m
                    }
                );
            }

            // Inventario básico
            if(!context.Inventario.Any())
            {
                // Carnes
                context.Inventario.AddRange(
                    new InventoryItem { Categoria = "Carne", Nombre = "Puyazo", Cantidad = 50, UnidadMedida = "libras" },
                    new InventoryItem { Categoria = "Carne", Nombre = "Culotte", Cantidad = 30, UnidadMedida = "libras" },
                    new InventoryItem { Categoria = "Carne", Nombre = "Costilla", Cantidad = 40, UnidadMedida = "libras" }
                );

                // Guarniciones
                context.Inventario.AddRange(
                    new InventoryItem { Categoria = "Guarnicion", Nombre = "frijoles", Cantidad = 100, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Guarnicion", Nombre = "chile de árbol", Cantidad = 80, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Guarnicion", Nombre = "cebollín", Cantidad = 60, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Guarnicion", Nombre = "tortillas", Cantidad = 200, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Guarnicion", Nombre = "chirmol", Cantidad = 50, UnidadMedida = "unidades" }
                );

                // Dulces
                context.Inventario.AddRange(
                    new InventoryItem { Categoria = "Dulce", Nombre = "Canillitas de leche", Cantidad = 100, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Dulce", Nombre = "Pepitoria", Cantidad = 80, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Dulce", Nombre = "Cocadas", Cantidad = 60, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Dulce", Nombre = "Dulces de higo", Cantidad = 40, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Dulce", Nombre = "Mazapanes", Cantidad = 50, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Dulce", Nombre = "Chilacayotes", Cantidad = 30, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Dulce", Nombre = "Conservas de coco", Cantidad = 20, UnidadMedida = "unidades" },
                    new InventoryItem { Categoria = "Dulce", Nombre = "Colochos de guayaba", Cantidad = 100, UnidadMedida = "unidades" }
                );

                // Cajas y empaques
                context.Inventario.Add(
                    new InventoryItem { Categoria = "Empaque", Nombre = "Cajas y empaques", Cantidad = 40, UnidadMedida = "unidades" }
                );

                // Carbón y leña
                context.Inventario.Add(
                    new InventoryItem { Categoria = "Combustible", Nombre = "Carbón y leña", Cantidad = 20, UnidadMedida = "unidades" }
                );

                context.SaveChanges();
            }


            context.SaveChanges();
        }
    }
}
