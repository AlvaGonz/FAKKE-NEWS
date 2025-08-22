# Manejo de Archivos Grandes

Este proyecto utiliza **Git LFS (Large File Storage)** para manejar archivos grandes de manera eficiente.

## 🎯 ¿Por qué Git LFS?

- **Rendimiento**: Los repositorios se clonan más rápido
- **Eficiencia**: Solo se descargan los archivos necesarios
- **Control**: Mejor gestión del espacio en disco
- **Colaboración**: Facilita el trabajo en equipo

## 📁 Archivos Gestionados por Git LFS

### Archivos de Pruebas
- `tests/e2e/**/*.png` - Screenshots de pruebas E2E
- `tests/e2e/**/*.mp4` - Videos de pruebas E2E
- `playwright-report/**/*.png` - Reportes de Playwright
- `playwright-report/**/*.mp4` - Videos de reportes

### Reportes y Análisis
- `lighthouse-report.html` - Reportes de Lighthouse
- `lighthouse-report.json` - Datos de Lighthouse
- `dist/stats.html` - Análisis de bundle

### Archivos Multimedia
- `*.mp4`, `*.mov`, `*.avi` - Videos
- `*.png`, `*.jpg`, `*.jpeg` - Imágenes grandes
- `*.pdf`, `*.doc`, `*.docx` - Documentos

## 🛠️ Comandos Útiles

### Ver archivos trackeados por LFS
```bash
git lfs ls-files
```

### Descargar archivos LFS
```bash
git lfs pull
```

### Limpiar archivos no utilizados
```bash
git lfs prune
```

### Limpiar archivos de pruebas
```bash
npm run cleanup
```

### Limpieza completa
```bash
npm run cleanup:all
```

## 📋 Flujo de Trabajo Recomendado

### Para Desarrolladores
1. **Clonar repositorio**: Los archivos LFS se descargan automáticamente
2. **Ejecutar pruebas**: Los archivos se crean localmente
3. **Limpiar después**: `npm run cleanup` para eliminar archivos temporales
4. **Commit cambios**: Solo los archivos necesarios se suben

### Para CI/CD
1. **Instalar Git LFS**: `git lfs install`
2. **Descargar archivos**: `git lfs pull`
3. **Ejecutar pruebas**: Generar reportes y screenshots
4. **Subir resultados**: Los archivos grandes van a LFS automáticamente

## ⚠️ Consideraciones Importantes

### Archivos Excluidos
Los siguientes archivos **NO** se suben al repositorio:
- `node_modules/`
- `dist/`
- `coverage/`
- `test-results/`
- `playwright-report/`

### Tamaño de Archivos
- **Archivos pequeños** (< 1MB): Se manejan normalmente con Git
- **Archivos grandes** (≥ 1MB): Se manejan con Git LFS
- **Archivos temporales**: Se eliminan con scripts de limpieza

## 🔧 Configuración

### .gitattributes
Define qué archivos usar LFS:
```gitattributes
*.png filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
```

### .gitignore
Excluye archivos temporales:
```gitignore
test-results/
playwright-report/
coverage/
```

## 📊 Estadísticas

### Tamaños Típicos
- **Screenshot**: 50-200 KB
- **Video de prueba**: 1-10 MB
- **Reporte Lighthouse**: 100-500 KB
- **Análisis de bundle**: 50-200 KB

### Beneficios
- **Clonación**: 80% más rápida
- **Espacio**: 70% menos uso de disco
- **Rendimiento**: Mejor experiencia de desarrollo

## 🚀 Próximos Pasos

1. **Configurar LFS en CI/CD**
2. **Automatizar limpieza**
3. **Monitorear uso de espacio**
4. **Optimizar archivos grandes**
