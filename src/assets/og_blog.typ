
#let og-blog-template(
  title: "Título del Post",
  description: "Una breve descripción del contenido para dar contexto al lector sobre lo que encontrará en el artículo o libro.",
  site-title: "Presuposicionalismo.com",
) = {
  // Configuración de página
  set page(
    width: 1200pt,
    height: 630pt,
    margin: 0pt,
  )

  // Colores (Light Theme - Inverted)
  let bg-color = rgb("#fafafa") // Zinc-50
  let surface-color = rgb("#ffffff") // White
  let accent-color = rgb("#4f46e5") // Indigo-600 (adjusted for light mode visibility/contrast)
  let text-color = rgb("#18181b") // Zinc-900
  let dim-text-color = rgb("#52525b") // Zinc-600

  // Fuentes
  let body-font = "Urbanist"

  // Fondo con patrón radial sutil (invertido)
  rect(
    width: 100%,
    height: 100%,
    fill: bg-color,
  )[
    // Patrón decorativo
    #place(
      center + horizon,
      circle(radius: 400pt, fill: gradient.radial(
        (rgb("#f4f4f5"), 0%), // Zinc-100
        (bg-color, 100%),
      )),
    )

    // Contenedor Principal (Tarjeta)
    #place(
      center + horizon,
      rect(
        width: 90%,
        height: 85%,
        radius: 32pt,
        fill: surface-color,
        stroke: (thickness: 4pt, paint: accent-color),
        inset: 60pt,
      )[
        #set text(font: body-font, fill: text-color)



        // Contenido Central
        #align(horizon + left)[
          #stack(dir: ttb, spacing: 24pt)[
            // Título
            #par(leading: 0.9em)[
              #text(size: 50pt, weight: "extrabold", title)
            ]

            // Separador (línea pequeña)
            #rect(width: 100pt, height: 5pt, fill: accent-color, radius: 2.5pt)

            // Descripción
            #block(width: 90%)[
              #text(size: 26pt, fill: dim-text-color, weight: "medium", description)
            ]
          ]
        ]

        // Footer: URL
        #place(bottom + right)[
          #text(size: 20pt, weight: "bold", fill: accent-color)[presuposicionalismo.com]
        ]
      ],
    )
  ]
}
