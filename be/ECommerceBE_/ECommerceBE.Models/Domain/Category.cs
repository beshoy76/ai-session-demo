

using ECommerceBE.Models.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace ECommerceBE.Models.Domain
{
    public class Category : BaseEntity<Guid>
    {
        [Required]
        public string Name { get; set; }
    }
}
