using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;

namespace ECommerceBE.Models.Domain.Common
{
    public interface IAuditable
    {
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class BaseEntity<T> : IAuditable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public T Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }

        public string GetColumn(string name)
        {
            PropertyInfo? propertyInfo = GetType().GetProperty(name);

            if (propertyInfo != null)
            {
                object? propertyValue = propertyInfo.GetValue(this);
                if (propertyValue != null)
                {
                    return propertyValue!.ToString()!;
                }
            }
            // Property not found or value is null
            return string.Empty;
        }

        public string GetETag()
        {
            try
            {
                string content = string.Join("-", this.GetType().GetProperties().Where(RemoveVersioning).Select(s => s.GetValue(this)));

                using (var md5 = MD5.Create())
                {
                    byte[] hash = md5.ComputeHash(Encoding.UTF8.GetBytes(content));
                    string hex = BitConverter.ToString(hash).Replace("-", "").ToLower();
                    return $"\"{hex}\"";
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        private bool RemoveVersioning(PropertyInfo prop)
        {
            return (
                prop.Name != nameof(Id)
                && prop.Name != nameof(CreatedAt)
                && prop.Name != nameof(CreatedBy)
                && prop.Name != nameof(UpdatedAt)
                && prop.Name != nameof(UpdatedBy)
                );
        }
    }
}
