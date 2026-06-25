// (1) New entity — persists checkout shipping details, status, and computed total
using ECommerceBE.Models.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace ECommerceBE.Models.Domain
{
    public class Order : BaseEntity<Guid>
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending";

        public decimal Total { get; set; }

        public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
