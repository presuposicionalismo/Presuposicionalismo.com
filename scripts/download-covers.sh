#!/bin/bash
# Descarga las 23 portadas de Unsplash que faltaban para el blog.
# Correr desde la raiz del repo: bash scripts/download-covers.sh
# Es un script de un solo uso -- puedes borrarlo despues de correrlo.
set -e
cd "$(dirname "$0")/../src/assets/coverblog"

# 1. Qué es una Presuposición - old brick building foundation - Foto de Emmanuel Munoz en Unsplash
curl -L "https://images.unsplash.com/photo-1768902545145-62211bae6b62?fm=webp&w=1200&q=80" -o "old-brick-foundation.webp"

# 2. Son la ciencia y la lógica neutrales - black microscope - Foto de Yassine Khalfalli en Unsplash
curl -L "https://images.unsplash.com/photo-1572884267966-02340ebc90ac?fm=webp&w=1200&q=80" -o "black-microscope.webp"

# 3. Venciendo el Prejuicio Anti-Metafísica - star cluster night sky - Foto de Aron Visuals en Unsplash
curl -L "https://images.unsplash.com/photo-1677926405168-fa86268b7295?fm=webp&w=1200&q=80" -o "star-cluster-night-sky.webp"

# 4. Van Til y Plantinga Más Cerca de lo que Parece - concrete bridge landscape - Foto de Cody Hiscox en Unsplash
curl -L "https://images.unsplash.com/photo-1522775559573-2f76d540932b?fm=webp&w=1200&q=80" -o "concrete-bridge-landscape.webp"

# 5. Van Til contra Aristóteles - marble bust statue (generico, sin nombre) - Foto de Omair Parvez en Unsplash
curl -L "https://images.unsplash.com/photo-1565170556450-bdfc81864ca1?fm=webp&w=1200&q=80" -o "marble-bust-statue.webp"

# 6. Razón Evidencia y Apologética Presuposicional - gavel and book - Foto de Sasun Bughdaryan en Unsplash
curl -L "https://images.unsplash.com/photo-1767972463877-b64ba4283cd0?fm=webp&w=1200&q=80" -o "gavel-and-book.webp"

# 7. Razonamiento por Presuposición - spiral stairs (white variant) - Foto de Dan Freeman en Unsplash
curl -L "https://images.unsplash.com/photo-1507097489474-c9212a8f8597?fm=webp&w=1200&q=80" -o "spiral-stairs-white.webp"

# 8. Pruebas Teístas - sunbeams over mountain peaks - Foto de Daniel Seßler en Unsplash
curl -L "https://images.unsplash.com/photo-1757269267274-085b02b0ce8a?fm=webp&w=1200&q=80" -o "sunbeams-mountain-peaks.webp"

# 9. Liberalismo y Fundamentalismo Teológico - forked road two paths - Foto de Y en Unsplash
curl -L "https://images.unsplash.com/photo-1779636437913-3a6e0ac98a40?fm=webp&w=1200&q=80" -o "forked-road-two-paths.webp"

# 10. Las Presuposiciones son la Clave - skeleton key - Foto de Everyday basics en Unsplash
curl -L "https://images.unsplash.com/photo-1584985429926-08867327d3a6?fm=webp&w=1200&q=80" -o "skeleton-key.webp"

# 11. La Futilidad del Pensamiento No Cristiano - aerial maze in a field - Foto de Marina Reich en Unsplash
curl -L "https://images.unsplash.com/photo-1634471887351-8bed1dbf37b3?fm=webp&w=1200&q=80" -o "aerial-maze-field.webp"

# 12. La Creación Bajo Ataque - nimbus storm clouds - Foto de Jari Hytönen en Unsplash
curl -L "https://images.unsplash.com/photo-1516469679150-4fdd1f114f97?fm=webp&w=1200&q=80" -o "nimbus-storm-clouds.webp"

# 13. La Controversia Gordon Clark y Cornelius Van Til - chess pieces confrontation - Foto de Piotr Makowski en Unsplash
curl -L "https://images.unsplash.com/photo-1560174038-da43ac74f01b?fm=webp&w=1200&q=80" -o "chess-pieces-confrontation.webp"

# 14. La Biblia y la Ciencia - binoculars on a book - Foto de Kotagauni Srinivas en Unsplash
curl -L "https://images.unsplash.com/photo-1673540328996-d95d3eb00e2f?fm=webp&w=1200&q=80" -o "binoculars-on-book.webp"

# 15. La Base Epistemológica de la Fe Cristiana - tree roots in cracked earth - Foto de Benjamin Hibbert-Hingston en Unsplash
curl -L "https://images.unsplash.com/photo-1749135840537-3e0ece049413?fm=webp&w=1200&q=80" -o "tree-roots-cracked-earth.webp"

# 16. La Apologética De Justino Mártir - ancient roman pillars - Foto de Giu Vicente en Unsplash
curl -L "https://images.unsplash.com/photo-1667345648621-30a66fc3227f?fm=webp&w=1200&q=80" -o "ancient-roman-pillars.webp"

# 17. Falacia de Petición de Principio en el Razonamiento Ateo - spiral staircase (b&w variant) - Foto de Nicolas Hoizey en Unsplash
curl -L "https://images.unsplash.com/photo-1601629736795-3da639aa9f23?fm=webp&w=1200&q=80" -o "spiral-staircase-bw.webp"

# 18. El Problema de los Absolutos de la Moral - lady justice statue - Foto de Tingey Injury Law Firm en Unsplash
curl -L "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?fm=webp&w=1200&q=80" -o "lady-justice-statue.webp"

# 19. El Problema Del Lenguaje Religioso - dictionary index page - Foto de Romain Vignes en Unsplash
curl -L "https://images.unsplash.com/photo-1451226428352-cf66bf8a0317?fm=webp&w=1200&q=80" -o "dictionary-index-page.webp"

# 20. El Problema De Conocer Lo «Sobrenatural» - foggy forest - Foto de Inggrid Koe en Unsplash
curl -L "https://images.unsplash.com/photo-1486707471592-8e7eb7e36f78?fm=webp&w=1200&q=80" -o "foggy-forest.webp"

# 21. Dos Guerreros Cristianos - crossed swords on shield - Foto de Patrick Hendry en Unsplash
curl -L "https://images.unsplash.com/photo-1541543975512-86aad5d2cf93?fm=webp&w=1200&q=80" -o "crossed-swords-shield.webp"

# 22. Definición de las Posiciones - signpost multiple directions - Foto de Javier Allegue Barros en Unsplash
curl -L "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?fm=webp&w=1200&q=80" -o "signpost-multiple-directions.webp"

# 23. Charles Hodge - antique library books shelf - Foto de Prateek Katyal en Unsplash
curl -L "https://images.unsplash.com/photo-1595123550441-d377e017de6a?fm=webp&w=1200&q=80" -o "antique-books-shelf.webp"

echo "Listo. 23 imagenes descargadas en src/assets/coverblog/"
