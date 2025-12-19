# 📰 FAKKE NEWS - Plataforma de Noticias

Una aplicación web moderna para consulta de noticias con diseño editorial inspirado en WSJ y The New Yorker.

## 🚀 Características Principales

### Frontend (Vue.js SPA)
- **Vue 3 + Composition API** - Framework moderno y reactivo
- **TypeScript** - Tipado fuerte para mayor robustez
- **Vite** - Build tool ultra-rápido
- **Vue Router** - Navegación SPA
- **Responsive Design** - Adaptable a móvil, tablet y desktop
- **PWA Ready** - Service Worker y manifest configurados

### Backend (ASP.NET Core)
- **ASP.NET Core 9** - API REST moderna
- **Entity Framework Core** - ORM para SQL Server
- **CORS** - Configurado para SPA
- **Swagger/Scalar** - Documentación automática de API

### Funcionalidades
- 📰 **Consulta de noticias** por categoría, país o búsqueda
- 🎨 **Diseño editorial** con tipografía profesional
- 📱 **Responsive** y optimizado para móviles
- 🔍 **Búsqueda avanzada** con filtros
- 📄 **Páginas de artículos** con diseño completo
- 🔄 **Infinite scroll** para mejor UX
- 🎯 **Micro-interacciones** y animaciones suaves

## 🏗️ Arquitectura del Proyecto

```
FAKKE NEWS/
├── FAKKE-NEWS-SPA/          # Frontend Vue.js
│   ├── src/
│   │   ├── components/      # Componentes Vue
│   │   ├── views/          # Páginas de la aplicación
│   │   ├── composables/    # Lógica reutilizable
│   │   ├── router/         # Configuración de rutas
│   │   └── assets/         # Estilos y recursos
│   ├── tests/              # Tests unitarios y E2E
│   └── docs/               # Documentación técnica
├── FAKKE NEWS API/         # Backend ASP.NET Core
│   ├── Controllers/        # Controladores de API
│   ├── Models/            # Modelos de datos
│   └── Data/              # Contexto de base de datos
└── FAKKE NEWS MVC/         # Panel de administración
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Vue 3** - Framework progresivo
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Vue Router** - Enrutamiento
- **Vitest** - Testing unitario
- **Playwright** - Testing E2E
- **Git LFS** - Gestión de archivos grandes

### Backend
- **ASP.NET Core 9** - Framework web
- **Entity Framework Core** - ORM
- **SQL Server** - Base de datos
- **Swagger/Scalar** - Documentación API
- **CORS** - Cross-Origin Resource Sharing

### Herramientas
- **Git LFS** - Archivos grandes
- **Lighthouse** - Análisis de rendimiento
- **ESLint + Prettier** - Linting y formateo
- **Husky** - Git hooks

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- .NET 9 SDK
- SQL Server (LocalDB o Express)
- Git con LFS

### Frontend (SPA)
```bash
cd FAKKE-NEWS-SPA
npm install
npm run dev
```

### Backend (API)
```bash
cd "FAKKE NEWS API"
dotnet restore
dotnet run
```

### Base de Datos
1. Configurar connection string en `appsettings.json`
2. Ejecutar migraciones: `dotnet ef database update`

## 🚀 Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run test         # Tests unitarios
npm run test:e2e     # Tests end-to-end
npm run cleanup      # Limpiar archivos temporales
npm run lighthouse   # Análisis de rendimiento
```

### Backend
```bash
dotnet run           # Ejecutar API
dotnet test          # Ejecutar tests
dotnet ef migrate    # Crear migración
dotnet ef update     # Aplicar migraciones
```

## 📊 Estado del Proyecto

### ✅ Completado (70%)
- ✅ **Milestone 1-6**: Base SPA + API, UI/UX, Artículos, Estados, Dark Mode, Favicon
- ✅ **Milestone 7**: Optimización, Testing (11 tests unitarios, 45 tests E2E)
- ✅ **Git LFS**: Gestión eficiente de archivos grandes
- ✅ **Tipografía**: Bebas Neue + Poppins optimizadas
- ✅ **Responsive**: Mobile, tablet, desktop
- ✅ **Performance**: Bundle optimizado (132 kB total)

### 🚧 En Progreso
- 🔄 **Milestone 8**: Features avanzadas (notificaciones, modo offline)
- 🔄 **Milestone 9**: SEO y Analytics
- 🔄 **Milestone 10**: Deployment y CI/CD

## 🎨 Diseño y UX

### Inspiración Editorial
- **WSJ (Wall Street Journal)** - Layout y tipografía
- **The New Yorker** - Estilo visual y micro-interacciones
- **uiverse.io** - Animaciones y efectos

### Paleta de Colores
- **Primario**: Rojo (#e23b2e, #ff4757)
- **Secundario**: Grises (#f7f7f7, #666, #eee)
- **Acento**: Blanco y negro para contraste

### Tipografía
- **Bebas Neue**: Títulos y elementos de impacto
- **Poppins**: Texto del cuerpo y legibilidad

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```env
# Frontend (.env.local)
VITE_API_BASE=/api

# Backend (appsettings.json)
ConnectionStrings__DefaultConnection=Data Source=...;Initial Catalog=FAKKE NEWS
```

### Proxy de Desarrollo
El frontend usa un proxy para conectar con la API:
```typescript
proxy: {
  '/api': {
    target: 'https://localhost:7258',
    changeOrigin: true,
    secure: false
  }
}
```

## 📈 Métricas de Rendimiento

### Bundle Analysis
- **Vue Vendor**: 90.69 kB (34.68 kB gzipped)
- **Main Bundle**: 16.60 kB (6.01 kB gzipped)
- **CSS Total**: ~25.99 kB (4.92 kB gzipped)
- **Tamaño Total**: ~132 kB (51 kB gzipped)

### Testing Coverage
- **Tests Unitarios**: 11/11 pasando (100%)
- **Tests E2E**: 45/45 pasando (100%)
- **Cross-browser**: Chrome, Firefox, Safari, Mobile

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

- **Proyecto**: [FAKKE NEWS Repository](https://github.com/your-username/fakke-news)
- **Issues**: [GitHub Issues](https://github.com/your-username/fakke-news/issues)

---

**FAKKE NEWS** - Donde las noticias cobran vida 🚀
