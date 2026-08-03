# **Presuposicionalismo.com**

Un sitio web dedicado a promover la literatura y filosofía cristiana presuposicional, enfocándose en la metodología apologética del Dr. Cornelius Van Til y sus estudiantes. Destaca el trabajo de importantes "vantilianos" como James Anderson y Scott Oliphint.

**🚀 Estado actual: MVP (Minimum Viable Product)**

## 📖 **Acerca del Proyecto**

Este repositorio contiene el código fuente de Presuposicionalismo.com, construido con tecnologías web modernas para ofrecer una experiencia de lectura optimizada y accesible.

**Objetivo**: Bendecir a los visitantes y promover la gloria de Dios a través de contenido apologético de calidad.

## 🛠️ **Stack Tecnológico**

- **Framework**: [Astro](https://astro.build/) 5.3.0
- **UI Components**: [Svelte](https://svelte.dev/) 5.20.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.0.6 + [Open Props](https://open-props.style/)
- **Content**: Markdown/MDX con validación de schema
- **Search**: Fuse.js
- **Database**: Turso (libSQL)
- **Deploy**: Vercel
- **Package Manager**: Bun

## ✅ **Características Implementadas (MVP)**

### **Core Funcionalidad**

- [x] **Página de inicio** - Presentación general del sitio
- [x] **Blog completo** - 73+ artículos de apologética presuposicional
- [x] **Biblioteca de libros** - Catálogo de 9+ libros con descargas
- [x] **Navegación responsive** - Compatible con todos los dispositivos
- [x] **Sistema de búsqueda** - Búsqueda en tiempo real con Fuse.js

### **SEO y Performance**

- [x] **SEO optimizado** - Meta tags, sitemap, RSS feed
- [x] **Imágenes optimizadas** - Componente `<Image />` de Astro
- [x] **Sitio estático** - Generación estática para máximo rendimiento

### **UX Básica**

- [x] **Dark mode** - Toggle entre tema claro y oscuro
- [x] **Footer rediseñado** - Información de contacto y enlaces
- [x] **Paginación** - Navegación en listados de contenido

## 📊 **Contenido Actual**

| Tipo                | Cantidad | Estado           |
| ------------------- | -------- | ---------------- |
| Artículos de blog   | 73+      | ✅ Publicados    |
| Libros catalogados  | 9+       | ✅ Disponibles   |
| Páginas principales | 3        | ✅ Funcionales   |
| Componentes Astro   | 36+      | ✅ Implementados |

## 🚧 **Roadmap - Próximas Características**

### **🎯 Prioridad Alta**

- [ ] **Página de autores** - Perfiles y biografías de escritores presupuestos
  - [ ] Agregar collection `autores` en `/content/config.ts`
  - [ ] Crear componentes y páginas relacionadas
- [ ] **View Transition API** - Transiciones suaves entre páginas
- [ ] **Optimización de performance**
  - [ ] Lazy loading de imágenes
  - [ ] Compresión de assets
  - [ ] Implementar cache estratégico

### **🎨 Mejoras de UX**

- [ ] **Scroll-driven animations** - Animaciones basadas en scroll
- [ ] **Header rediseñado** - Navegación mejorada y más atractiva
- [ ] **Secciones adicionales** en página de inicio
  - [ ] Autores destacados
  - [ ] Libros recientes
  - [ ] Testimonios

### **🔧 Tareas Técnicas**

- [ ] **Refactorización de CSS** - Organizar y optimizar estilos
- [ ] **Componentización** - Modularizar secciones reutilizables
- [ ] **Testing** - Implementar pruebas automatizadas
- [ ] **Accesibilidad** - Cumplir estándares WCAG
- [ ] **PWA** - Funcionalidad offline básica

## 🚀 **Instalación y Desarrollo**

### **Prerrequisitos**

- Node.js 18+
- Bun (recomendado) o npm

### **Configuración Local**

```bash
# Clonar el repositorio
git clone https://github.com/usuario/presuposicionalismo.com.git
cd presuposicionalismo.com

# Instalar dependencias
bun install
# o npm install

# Ejecutar en desarrollo
bun run dev
# o npm run dev

# Construir para producción
bun run build
# o npm run build
```

### **Scripts Disponibles**

- `bun run dev` - Servidor de desarrollo
- `bun run build` - Construcción para producción
- `bun run preview` - Vista previa del build
- `bun run check` - Verificación de tipos TypeScript

## 🌐 **Deploy**

El sitio se despliega automáticamente en [Vercel](https://vercel.com) desde la rama `main`.

- **Producción**: https://presuposicionalismo.com
- **Vista previa**: Ramas automáticamente desplegadas

## 📁 **Estructura del Proyecto**

```
src/
├── components/     # Componentes Astro y Svelte
├── content/        # Contenido en Markdown
│   ├── blog/       # Artículos del blog
│   └── libros/     # Catálogo de libros
├── layouts/        # Plantillas de página
├── pages/          # Rutas del sitio
├── styles/         # Estilos CSS
└── utils/          # Utilidades y helpers
```

## 🤝 **Contribuir**

Las contribuciones son bienvenidas. Por favor:

1. Fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📧 **Contacto**

Para sugerencias de contenido o reportar problemas, por favor abre un issue en este repositorio.

## 📄 **Licencia**

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

**🙏 "Toda escritura es inspirada por Dios y útil para enseñar, para reprender, para corregir y para instruir en la justicia"** - 2 Timoteo 3:16
