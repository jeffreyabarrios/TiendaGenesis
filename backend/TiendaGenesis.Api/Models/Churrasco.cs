namespace TiendaGenesisPrueba.Api.Models
{
    public class Churrasco
    {
        public int Id { get; set; }

        // "Individual" o "Familiar"
        public string Modalidad { get; set; } = default!;

        // 1 (individual), 3 o 5 (familiar)
        public int NumeroPorciones { get; set; }

        // Nombre asignado por el usuario
        public string NombrePlato { get; set; } = default!;

        // Relación con PorcionChurrasco
        public List<PorcionChurrasco> Porciones { get; set; } = new();
    }
}
