// (4) Request DTO — data annotations drive both model-state validation and Swagger docs
using System.ComponentModel.DataAnnotations;

namespace ECommerceBE.Core.DTOs
{
    public class CheckoutRequest
    {
        [Required(ErrorMessage = "Full name is required")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "City is required")]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string Phone { get; set; } = string.Empty;

        public List<CheckoutItemRequest> Items { get; set; } = new();
    }

    public class CheckoutItemRequest
    {
        public Guid ProductId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }
    }
}
