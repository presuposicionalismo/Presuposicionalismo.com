# Fotos de autores

Pon aquí la foto de cada autor y referénciala desde
`src/content/autores/{slug}.mdx` con:

```yaml
photo: "/src/assets/autores/{nombre-de-archivo}.jpg"
```

## Convención

- Nombre de archivo recomendado: igual al slug del autor (el nombre del
  archivo `.mdx`), p. ej. `cornelius-van-til.jpg` para
  `src/content/autores/cornelius-van-til.mdx`. No es obligatorio que
  coincida — lo único que importa es que la ruta en `photo:` apunte al
  archivo correcto — pero mantenerlos iguales hace más fácil encontrar
  cuál falta.
- Formatos aceptados: `.jpg`, `.jpeg`, `.png`, `.webp`.
- Aspecto cuadrado (1:1) — el componente `AuthorAvatar` la recorta a un
  círculo con `object-cover`, así que un retrato centrado en la cara
  funciona mejor que una foto de cuerpo completo o de grupo.
- Mínimo recomendado: 400×400px (se reoptimiza automáticamente a los
  tamaños que necesita cada tarjeta — no hace falta generar variantes).

## Por qué no un `<img src>` directo

Astro solo copia al build final los archivos de `src/assets/` que
alguna página realmente `import`a — un `<img src="/src/assets/...">`
crudo funciona en `npm run dev` (Vite sirve cualquier cosa bajo `src/`
al vuelo) pero da 404 en producción. `AuthorAvatar.astro` ya resuelve
esto por `import.meta.glob` + `astro:assets` `<Image>` (el mismo patrón
que usan las portadas de libros y del blog) — cualquier archivo que
pongas aquí y referencies correctamente en `photo:` funciona en dev y
en build sin pasos adicionales.

## Roster pendiente (12 autores, ninguno tiene foto todavía)

- `cornelius-van-til`
- `greg-bahnsen`
- `john-frame`
- `francis-schaeffer`
- `gordon-h-clark`
- `james-n-anderson`
- `k-scott-oliphint`
- `william-edgar`
- `brian-g-mattson`
- `michael-warren`
- `nathan-d-shannon`
- `jose-angel-ramirez`
