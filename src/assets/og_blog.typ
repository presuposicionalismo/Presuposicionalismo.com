// Tarjeta OG de un artículo del blog.
#import "og_base.typ": *

#let og-blog-template(title: "", description: "") = pagina(
  block(width: 100%, height: 100%, inset: margen, {
    logo()
    v(1fr)
    antetitulo[Artículo]
    v(22pt)
    titulo(title)
    if description != "" {
      v(20pt)
      block(width: 960pt, {
        set par(leading: 0.55em)
        text(size: 24pt, fill: gris, description)
      })
    }
    v(1fr)
    pie(derecha: [Apologética presuposicional])
  }),
)
