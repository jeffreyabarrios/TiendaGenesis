namespace TiendaGenesisPrueba.Api.Models
{
    public class PorcionChurrasco
    {
        public int Id { get; set; }

        // Relación con Churrasco
        public int ChurrascoId { get; set; }
        public Churrasco? Churrasco { get; set; }

        // Tipo de carne
        public string TipoCarne { get; set; } = default!; 
        // Término de cocción
        public string TerminoCoccion { get; set; } = default!; 
        // Guarniciones (ej: "frijoles,chile de árbol")
        public string Guarniciones { get; set; } = ""; 
    }
}
