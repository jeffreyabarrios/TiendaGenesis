using System.ComponentModel.DataAnnotations.Schema;

namespace TiendaGenesisPrueba.Api.Models
{
    public class Combo
    {
        public int Id { get; set; }

        // Nombre del combo (ej: "Combo Familiar", "Combo de Verano", etc.)
        public string Nombre { get; set; } = default!;

        // Descripción adicional
        public string Descripcion { get; set; } = default!;

        // Cantidad de cajas de dulces incluidas
        public int CajasDulces { get; set; }

        public decimal Precio { get; set; }
        // Relación con la tabla intermedia
        public List<ComboChurrasco> ChurrascosEnCombo { get; set; } = new();
    }
}

