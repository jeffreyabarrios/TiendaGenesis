namespace TiendaGenesisPrueba.Api.Models
{
    public class InventoryItem
    {
        public int Id { get; set; }
        public string Categoria { get; set; } = default!; // "Carne", "Guarnicion", "Dulce", "Empaque", "Combustible"
        public string Nombre { get; set; } = default!;    // "Puyazo", "Culotte", etc.
        public int Cantidad { get; set; }
        public string UnidadMedida { get; set; } = default!;
    }
}
