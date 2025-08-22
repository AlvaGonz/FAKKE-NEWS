#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Limpiando archivos de pruebas...');

// Directorios a limpiar
const dirsToClean = [
  'test-results',
  'playwright-report',
  'coverage',
  'dist/stats.html',
  'lighthouse-report.html',
  'lighthouse-report.json'
];

// Limpiar directorios
dirsToClean.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    if (fs.lstatSync(fullPath).isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Eliminado directorio: ${dir}`);
    } else {
      fs.unlinkSync(fullPath);
      console.log(`✅ Eliminado archivo: ${dir}`);
    }
  }
});

// Limpiar archivos de Git LFS que no están trackeados
try {
  execSync('git lfs prune', { stdio: 'inherit' });
  console.log('✅ Git LFS limpiado');
} catch (error) {
  console.log('⚠️  Git LFS no disponible o no hay archivos para limpiar');
}

console.log('🎉 Limpieza completada!');
console.log('\n📝 Nota: Los archivos de pruebas grandes se almacenan en Git LFS');
console.log('   Para ver los archivos trackeados: git lfs ls-files');
console.log('   Para descargar archivos LFS: git lfs pull');
