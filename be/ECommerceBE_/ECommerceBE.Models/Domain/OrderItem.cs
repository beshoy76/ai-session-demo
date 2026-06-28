using ECommerceBE.Models.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceBE.Models.Domain
{
    public class OrderItem : BaseEntity<Guid>
    {
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }
        public virtual Order Order { get; set; } = null!;

        [ForeignKey("Product")]
        public Guid ProductId { get; set; }
        public virtual Product Product { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
