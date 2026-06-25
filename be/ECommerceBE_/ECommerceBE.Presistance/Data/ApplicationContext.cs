using ECommerceBE.Models.Domain;
using ECommerceBE.Models.Domain.Common;
using Microsoft.EntityFrameworkCore;
using System;
using DbContext = Microsoft.EntityFrameworkCore.DbContext;

namespace ECommerceBE.Presistance.Data;

public class ApplicationContext : DbContext
{
    public ApplicationContext()
    {

    }
    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options) { }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }


    public new async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new())
    {
        foreach (var entry in ChangeTracker.Entries<IAuditable>())
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.CreatedBy = string.IsNullOrEmpty(entry.Entity.CreatedBy) ? "Admin" ?? "" : "";
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Deleted:
                    entry.Entity.IsDeleted = true;
                    entry.State = EntityState.Modified;
                    break;
                case EntityState.Unchanged:
                    string test = "";
                    break;
            }

        return await base.SaveChangesAsync(cancellationToken);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
       
    }
}
