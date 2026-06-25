using ECommerceBE.Models.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceBE.Models.Domain
{
    public class Product : BaseEntity<Guid>
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public string? ImageUrl { get; set; }

        [ForeignKey("Category")]
        public Guid CategoryId { get; set; }
        public virtual Category Category { get; set; }
    }
}
