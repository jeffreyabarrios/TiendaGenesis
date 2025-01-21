using Microsoft.EntityFrameworkCore;
using TiendaGenesisPrueba.Api.Models;

namespace TiendaGenesisPrueba.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Churrasco> Churrascos { get; set; }
        public DbSet<PorcionChurrasco> PorcionesChurrasco { get; set; }
        public DbSet<DulceTipico> Dulces { get; set; }
        public DbSet<Combo> Combos { get; set; }
        public DbSet<ComboChurrasco> ComboChurrascos { get; set; }
        public DbSet<InventoryItem> Inventario { get; set; }

        public DbSet<Venta> Ventas { get; set; }

        public DbSet<Guarnicion> Guarniciones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relación 1 (Churrasco) -> muchos (PorcionChurrasco)
            modelBuilder.Entity<PorcionChurrasco>()
                .HasOne(p => p.Churrasco)
                .WithMany(c => c.Porciones)
                .HasForeignKey(p => p.ChurrascoId);

            // Relación Combo -> ComboChurrasco
            modelBuilder.Entity<ComboChurrasco>()
                .HasOne(cc => cc.Combo)
                .WithMany(c => c.ChurrascosEnCombo)
                .HasForeignKey(cc => cc.ComboId);

            modelBuilder.Entity<ComboChurrasco>()
                .HasOne(cc => cc.Churrasco)
                .WithMany() 
                .HasForeignKey(cc => cc.ChurrascoId);

            modelBuilder.Entity<Combo>(entity =>
            {
                entity.Property(e => e.Precio).HasPrecision(18, 2);
            });
        }
    }
}
