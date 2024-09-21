import os
import shutil
import re

def extraer_titulo(contenido):
    match = re.search(r'title:\s*"([^"]*)"', contenido)
    return match.group(1) if match else None

def obtener_archivos_md(directorio):
    archivos = {}
    for root, _, files in os.walk(directorio):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                ruta_completa = os.path.join(root, file)
                with open(ruta_completa, 'r', encoding='utf-8') as f:
                    contenido = f.read()
                    titulo = extraer_titulo(contenido)
                    if titulo:
                        archivos[titulo] = ruta_completa
    return archivos

def comparar_y_copiar(origen, destino):
    archivos_origen = obtener_archivos_md(origen)
    archivos_destino = obtener_archivos_md(destino)

    for titulo, ruta_origen in archivos_origen.items():
        if titulo not in archivos_destino:
            # Determinar la ruta de destino
            nombre_archivo = os.path.basename(ruta_origen)
            ruta_destino = os.path.join(destino, nombre_archivo)

            # Asegurarse de que el archivo de destino tenga extensión .md
            if not ruta_destino.endswith('.md'):
                ruta_destino = os.path.splitext(ruta_destino)[0] + '.md'

            # Copiar el archivo
            shutil.copy2(ruta_origen, ruta_destino)
            print(f"Copiado: {ruta_origen} -> {ruta_destino}")

# Rutas de los directorios
directorio_origen = '/home/luis/Documentos/blog'
directorio_destino = '../src/content/blog'

# Ejecutar la comparación y copia
comparar_y_copiar(directorio_origen, directorio_destino)
