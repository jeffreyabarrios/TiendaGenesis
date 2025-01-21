using System.ComponentModel.DataAnnotations;

namespace TiendaGenesisPrueba.Api.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = default!;

        // Guardamos la contraseña encriptada/hasheada
        public string PasswordHash { get; set; } = default!;
        
        public string Email { get; set; } = default!;
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}
