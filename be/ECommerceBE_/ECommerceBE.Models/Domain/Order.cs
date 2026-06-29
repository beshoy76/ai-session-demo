using System.ComponentModel.DataAnnotations.Schema;
using ECommerceBE.Models.Domain.Common;

namespace ECommerceBE.Models.Domain
{
    public class Order : BaseEntity<Guid>
    {
        public string OrderNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }
        public string Status { get; set; } = "Pending";
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
