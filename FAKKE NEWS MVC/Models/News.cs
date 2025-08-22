using System;
using System.ComponentModel.DataAnnotations;

namespace FAKKE_NEWS_MVC.Models
{
    public class News
    {
        public int Id { get; set; }

        [Display(Name = "Título")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Contenido")]
        public string Content { get; set; } = string.Empty;

        [Display(Name = "Fecha de publicación")]
        public DateTime PublicationDate { get; set; }

        [Display(Name = "País")]
        public int CountryId { get; set; }

        [Display(Name = "Categoría")]
        public int CategoryId { get; set; }
        public string AuthorId { get; set; } = string.Empty;

        [Display(Name = "Imagen (ruta relativa)")]
        public string? ImagePath { get; set; }
    }
}


