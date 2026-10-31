// Tarjeta OG de un libro: texto a la izquierda, portada a la derecha.
#import "og_base.typ": *

// Sombra suave a capas (Typst no tiene desenfoque), como la de las
// portadas en el sitio.
#let con-sombra(body, w, h) = {
  for i in range(1, 13) {
    let d = 2pt * i
    place(dx: d / 3, dy: d, rect(width: w, height: h, radius: d, fill: tinta.transparentize(98.4%)))
  }
  body
}

#let og-book-template(
  title: "",
  description: "",
  author: "",
  cover-image: none,
) = pagina({
  let panel = 440pt
  place(
    right + top,
    rect(width: panel, height: H, fill: superficie, stroke: (left: 1pt + filete)),
  )
  if cover-image != none {
    let h = 470pt
    let w = h * 0.707
    place(
      right + horizon,
      dx: -(panel - w) / 2,
      box(width: w, height: h, con-sombra(image(cover-image, width: w, height: h, fit: "cover"), w, h)),
    )
  }
  block(width: W - panel, height: 100%, inset: margen, {
    logo()
    v(1fr)
    antetitulo[Libro gratuito]
    v(22pt)
    titulo(title, ancho: W - panel - 2 * margen)
    if author != "" {
      v(18pt)
      text(size: 26pt, fill: gris, style: "italic")[por]
      h(6pt)
      text(size: 26pt, weight: 600, author)
    }
    v(1fr)
    pie(derecha: [PDF gratis])
  })
})
