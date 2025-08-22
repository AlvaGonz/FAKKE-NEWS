using System.ComponentModel.DataAnnotations;

namespace FAKKE_NEWS_MVC.Models
{
    public class RegisterViewModel
    {
        [Required]
        [Display(Name = "Usuario")]
        public string Username { get; set; } = string.Empty;

        [EmailAddress]
        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [MinLength(6)]
        [Display(Name = "Contraseña")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Rol")]
        public string Role { get; set; } = "Editor";
    }
}


