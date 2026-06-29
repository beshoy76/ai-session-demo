using ECommerceBE.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.Property(p => p.Price).HasColumnType("decimal(18,2)");

        builder.HasData(
            new Product
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                Name = "iPhone 16 Pro",
                Description = "Apple flagship smartphone",
                Price = 999.99m,
                CategoryId = CategoryConfiguration.ElectronicsId
            },
            new Product
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                Name = "Samsung Galaxy S25",
                Description = "Samsung flagship smartphone",
                Price = 899.99m,
                CategoryId = CategoryConfiguration.ElectronicsId
            },
            new Product
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                Name = "Men's Casual T-Shirt",
                Description = "100% Cotton T-Shirt",
                Price = 24.99m,
                CategoryId = CategoryConfiguration.FashionId
            },
            new Product
            {
                Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                Name = "Coffee Maker",
                Description = "Automatic coffee machine",
                Price = 129.99m,
                CategoryId = CategoryConfiguration.HomeId
            },
            new Product
            {
                Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                Name = "Gaming Laptop",
                Description = "16GB RAM, RTX 4060",
                Price = 1499.99m,
                CategoryId = CategoryConfiguration.ElectronicsId
            }
        );
    }
}