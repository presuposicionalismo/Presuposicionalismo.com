
#let og-template(
  title: "Título del Post",
  description: "Una breve descripción del contenido para dar contexto al lector sobre lo que encontrará en el artículo o libro.",
  site-title: "Presuposicionalismo.com",
  font-regular: none,
  font-bold: none,
) = {
  // Configuración de página
  set page(
    width: 1200pt,
    height: 630pt,
    margin: 0pt,
  )

  // Colores (Dark Theme)
  let bg-color = rgb("#09090b")
  let surface-color = rgb("#18181b")
  let accent-color = rgb("#818cf8")
  let text-color = rgb("#fafafa")
  let dim-text-color = rgb("#a1a1aa") // zinc-400

  // Fuentes
  let body-font = "Atkinson Hyperlegible"

  // Fondo con patrón radial sutil
  rect(
    width: 100%,
    height: 100%,
    fill: bg-color,
  )[
    // Patrón decorativo
    #place(
      center + horizon,
      circle(radius: 400pt, fill: gradient.radial(
        (surface-color, 0%),
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

        // Header: Logo/Sitio
        #place(top + left)[
          #stack(dir: ltr, spacing: 20pt)[
            // Icono simulado (triángulo simple)
            #path(
              fill: accent-color,
              closed: true,
              ((0pt, 0pt), (20pt, 30pt), (40pt, 0pt)),
            )
            #text(size: 28pt, weight: "bold", tracking: 2pt, fill: accent-color)[#upper(site-title)]
          ]
        ]

        // Contenido Central
        #align(horizon + left)[
          #stack(dir: ttb, spacing: 30pt)[
            // Título
            #par(leading: 0.9em)[
              #text(size: 72pt, weight: "bold", title)
            ]

            // Separador (línea pequeña)
            #rect(width: 100pt, height: 6pt, fill: accent-color, radius: 3pt)

            // Descripción
            #block(width: 90%)[
              #text(size: 36pt, fill: dim-text-color, weight: "regular", description)
            ]
          ]
        ]

        // Footer: URL
        #place(bottom + right)[
          #text(size: 24pt, weight: "medium", fill: accent-color)[presuposicionalismo.com]
        ]
      ],
    )
  ]
}
