using System.Text.Json.Serialization;

namespace TiendaGenesisPrueba.Api.Models
{
    public class ComboChurrasco
    {
        public int Id { get; set; }

        // Relación con Combo
        public int ComboId { get; set; }

        [JsonIgnore]
        public Combo? Combo { get; set; }

        // Relación con Churrasco
        public int ChurrascoId { get; set; }

        [JsonIgnore]
        public Churrasco? Churrasco { get; set; }
    }
}
