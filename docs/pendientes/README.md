# Pendientes / Fe de erratas

Documentación interna de trabajo pendiente, errata conocida y deuda técnica del sitio. No es contenido publicable — vive fuera de `src/`, Astro no lo procesa ni le genera rutas.

## Organización

Un archivo por categoría:

- [`tecnico.md`](./tecnico.md) — deuda técnica: configuración, dependencias, warnings de build, migraciones pendientes.
- [`contenido.md`](./contenido.md) — errata de contenido: notas al pie incompletas, portadas sin asignar, texto pendiente de revisión editorial.

Si aparece una categoría nueva (por ejemplo, algo de SEO, o de infraestructura de despliegue), se agrega su propio archivo aquí y se referencia en esta lista.

## Convención de cada entrada

Cada pendiente debe indicar:

- **Archivo(s) afectado(s)** (ruta relativa).
- **Qué falta o qué está mal.**
- **Qué se necesita para resolverlo** (ej: "localizar la fuente original en inglés", "confirmar con el usuario").
- **Fecha en que se detectó** (para saber si algo lleva mucho tiempo sin resolverse).

Cuando se resuelve un pendiente, se borra la entrada (no hace falta mantener un historial de "resueltos" — para eso está el historial de git).
