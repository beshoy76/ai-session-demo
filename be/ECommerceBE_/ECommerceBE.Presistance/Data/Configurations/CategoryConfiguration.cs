using ECommerceBE.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public static readonly Guid ElectronicsId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid FashionId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    public static readonly Guid HomeId = Guid.Parse("33333333-3333-3333-3333-333333333333");

    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasData(
            new Category
            {
                Id = ElectronicsId,
                Name = "Electronics"
            },
            new Category
            {
                Id = FashionId,
                Name = "Fashion"
            },
            new Category
            {
                Id = HomeId,
                Name = "Home & Kitchen"
            }
        );
    }
}