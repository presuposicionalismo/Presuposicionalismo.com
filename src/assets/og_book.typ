
#let og-book-template(
  title: "Título del Libro",
  description: "Descripción del libro...",
  author: "Autor del Libro",
  cover-image: none, // Expects path or none
  site-title: "Presuposicionalismo.com",
) = {
  // Configuración de página
  set page(
    width: 1200pt,
    height: 630pt,
    margin: 0pt,
  )

  // Colores (Light Theme)
  let bg-color = rgb("#fafafa")
  let surface-color = rgb("#ffffff")
  let accent-color = rgb("#4f46e5")
  let text-color = rgb("#18181b")
  let dim-text-color = rgb("#52525b")

  // Fuentes
  let body-font = "Urbanist"

  rect(
    width: 100%,
    height: 100%,
    fill: bg-color,
  )[
    #place(
      center + horizon,
      block(
        width: 90%,
        height: 85%,
        radius: 32pt,
        fill: surface-color,
        stroke: (thickness: 4pt, paint: accent-color),
        inset: 0pt, // Reset inset for grid layout control
        clip: true,
      )[
        #grid(
          columns: (1.4fr, 1fr),
          rows: 100%,
          gutter: 0pt,

          // Columna Izquierda: Info
          block(
            width: 100%,
            height: 100%,
            inset: (left: 60pt, top: 60pt, bottom: 60pt, right: 30pt),
          )[
            #set text(font: body-font, fill: text-color)

            // Header
            #stack(dir: ltr, spacing: 20pt)[
              #polygon(
                fill: accent-color,
                (0pt, 0pt),
                (20pt, 30pt),
                (40pt, 0pt),
              )
              #text(size: 24pt, weight: "bold", tracking: 2pt, fill: accent-color)[#upper(site-title)]
            ]

            #v(1fr)

            #par(leading: 0.9em)[
              #text(size: 64pt, weight: "extrabold", title)
            ]

            #v(20pt)

            #text(size: 32pt, weight: "bold", fill: accent-color, author)



            #v(1fr)

            #text(size: 24pt, weight: "bold", fill: accent-color)[presuposicionalismo.com]
          ],

          // Columna Derecha: Imagen
          block(
            width: 100%,
            height: 100%,
            fill: rgb("#f4f4f5"), // Placeholder background
          )[
            #if cover-image != none {
              // We use 'fit: "cover"' equivalent logic if possible, or just place it center
              // Typst images are simple.
              align(center + horizon, image(cover-image, width: 80%))
            } else {
              align(center + horizon, text(size: 40pt, fill: dim-text-color)[Sin Portada])
            }
          ],
        )
      ],
    )
  ]
}
