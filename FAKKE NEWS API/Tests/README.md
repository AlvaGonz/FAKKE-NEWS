**Endpoints Principales para Probar**:

### **📰 News (Noticias)**
- `GET /api/News` - Lista paginada con filtros
- `GET /api/News/ByCountry/1` - Por país
- `GET /api/News/ByCategory/1` - Por categoría  
- `GET /api/News/Search/tecnología` - Búsqueda por texto
- `GET /api/News/1` - Noticia específica

### **🏷️ Categories (Categorías)**
- `GET /api/Categories` - Todas las categorías
- `POST /api/Categories` - Crear nueva categoría

### **🌍 Countries (Países)**
- `GET /api/Countries` - Todos los países
- `POST /api/Countries` - Crear nuevo país

### **👥 Users (Usuarios)**
- `GET /api/Users` - Lista de usuarios (sin contraseñas)

## 🔍 Ejemplos de Pruebas

### **Buscar Noticias con Filtros**
```
GET /api/News?search=política&countryId=1&page=1&pageSize=5
```

### **Crear Nueva Categoría**
```json
POST /api/Categories
{
  "name": "Deportes"
}
```

### **Crear Nueva Noticia**
```json
POST /api/News
{
  "title": "Nueva Noticia",
  "content": "Contenido de la noticia",
  "publicationDate": "2025-08-18T12:00:00",
  "countryId": 1,
  "categoryId": 1,
  "authorId": 1
}
```

## ✅ Casos de Prueba Incluidos

- **CRUD Completo** para todas las entidades
- **Filtros y Búsquedas** en noticias
- **Paginación** en listados
- **Manejo de Errores** (404, 400, etc.)
- **Validaciones** de datos
