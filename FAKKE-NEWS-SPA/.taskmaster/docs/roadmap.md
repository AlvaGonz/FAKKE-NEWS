# Roadmap (Taskmaster-style)

## ✅ Milestone 1: Conectar API y estados (D1-2) - COMPLETADO
- ✅ Fix base path y `VITE_API_BASE` en SPA
- ✅ Estado loading/vacío/error en Home y Search
- ✅ Mensajes y CTA para limpiar filtros o reintentar
- ✅ Resolver imágenes: helper `resolveImageUrl` y soporte `VITE_ASSET_ORIGIN`

## ✅ Milestone 2: Estilo global y navegación (D3-4) - COMPLETADO
- ✅ Tipografía editorial (headlines serif, body system)
- ✅ Header con logomark + barra de secciones sticky, menús desplegables dinámicos (categorías/países)
- ✅ Grilla responsive (desktop 3-4 col, tablet 2, mobile 1) con gutters consistentes
- ✅ Dropdowns estilizados en filtros y header (reemplazar selects nativos)
- ✅ Fix z-index y superposición de menús
- ✅ Reestructuración completa del layout (App.vue, vistas, estilos globales)
- ✅ Simplificación de filtros: solo search en header y filtros, dropdowns removidos
- ✅ Layout full-width para aprovechar todo el espacio disponible
- ✅ Eliminación de buscador duplicado: solo header search
- ✅ Fix layout móvil en desktop: CSS full-width completo
- ✅ Restauración de dropdowns en header para navegación
- ✅ Mejora del sidebar con diseño más estilizado
- ✅ **Dropdowns junto a búsqueda con estado activo**
- ✅ **Header dinámico con categoría/país seleccionada**

## ✅ Milestone 3: Página de artículo (D5) - COMPLETADO
- ✅ Lead, drop-cap opcional, hero full-bleed
- ✅ Metadatos completos y enlaces a categoría/país
- ✅ Botones de compartir
- ✅ **Imagen clickeable con modal para vista detallada**
- ✅ **Footer full-width que usa todo el espacio disponible**
- ✅ **Difuminado del área del título para mejor legibilidad**

## ✅ Milestone 4: Estados y paginación (D6) - COMPLETADO
- ✅ Contador total, infinite scroll accesible
- ✅ Empty patterns en filtros sin resultados
- ✅ **Loading states mejorados con spinner animado**
- ✅ **Indicador de página actual y total de páginas**
- ✅ **Mensaje de "fin de resultados"**
- ✅ **Estados vacíos personalizados por vista (categoría, país, búsqueda)**

## ✅ Milestone 5: Dark mode + microanimaciones (D7) - COMPLETADO
- ✅ Toggle persistente (localStorage)
- ✅ Animaciones hover/focus inspiradas en uiverse
- ✅ **Composable useDarkMode con detección de preferencia del sistema**
- ✅ **Variables CSS para modo claro y oscuro**
- ✅ **Transiciones suaves entre temas**
- ✅ **Microanimaciones en tarjetas de noticias con efectos uiverse.io**
- ✅ **Botones de acción con animaciones escalonadas**

## 🚀 Milestone 6: Favicon/manifest (D8) - EN PROGRESO
- [ ] Generar favicons + `manifest.json` con isologo

## Milestone 7: QA final (D9)
- [ ] Responsiveness y a11y (focus rings, roles, contrastes)
- [ ] Lighthouse >= 85 mobile / >= 95 desktop

---

## Backlog técnico
- [ ] TTL de caché por query en cliente
- [ ] Manejo de CORS y headers en API
- [ ] Documentación Swagger actualizada
- [ ] Resolver errores de cookies mixed content HTTP/HTTPS
- ✅ Fix imágenes 404 del backend (servir /uploads correctamente)
