using System.ComponentModel.DataAnnotations;

namespace TiendaGenesisPrueba.Api.Models
{
    public class Venta
    {
        public int Id { get; set; }
        
        public string Descripcion { get; set; } = default!; 

        public DateTime FechaVenta { get; set; } = DateTime.UtcNow;

        public decimal MontoTotal { get; set; }
    }
}
