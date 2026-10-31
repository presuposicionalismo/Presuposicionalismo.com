// Piezas comunes de las tarjetas OG (1200 × 630). Siguen la piel Ledger,
// la de por defecto del sitio (src/styles/tokens.css): blanco, tinta casi
// negra, sin acento de color, Urbanist.

#let tinta = rgb("#0b0c0e")
#let gris = rgb("#6d7178")
#let filete = rgb("#e6e8eb")
#let superficie = rgb("#fafafa")
#let fondo = rgb("#ffffff")

#let W = 1200pt
#let H = 630pt
#let margen = 72pt

#let pagina(body) = {
  set page(width: W, height: H, margin: 0pt, fill: fondo)
  set text(font: "Urbanist", fill: tinta, lang: "es", number-type: "lining")
  set par(leading: 0.3em)
  body
}

// El logo es el mismo SVG de la cabecera del sitio: si cambia ahí,
// cambia aquí.
#let logo(width: 190pt) = {
  let svg = read("/src/components/Logo.astro").split("</svg>").first() + "</svg>"
  svg = svg
    .replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"", count: 1)
    .replace("currentColor", tinta.to-hex())
  image(bytes(svg), format: "svg", width: width)
}

// "—— ARTÍCULO", como el antetítulo del hero de la portada.
#let antetitulo(body) = {
  box(line(length: 34pt, stroke: 1pt + gris), baseline: -0.32em)
  h(14pt)
  text(size: 15pt, weight: 700, fill: gris, tracking: 0.28em, upper(body))
}

// Cuanto más largo el título, más pequeño, para que quepa en tres líneas.
#let titulo(body, ancho: 1056pt) = {
  let n = body.len()
  let size = if n <= 36 { 72pt } else if n <= 60 { 60pt } else if n <= 90 { 50pt } else { 42pt }
  block(width: ancho, text(size: size, weight: 700, tracking: -0.02em, hyphenate: false, body))
}

#let pie(derecha: none) = {
  line(length: 100%, stroke: 1pt + filete)
  v(18pt)
  grid(
    columns: (1fr, auto),
    text(size: 18pt, weight: 500, fill: gris)[presuposicionalismo.com],
    if derecha != none { text(size: 14pt, weight: 700, fill: gris, tracking: 0.22em, upper(derecha)) },
  )
}
