import os

# Define el directorio raíz
root_path = os.path.expanduser("../src/content/blog")

# Recorre todos los archivos en el directorio y subdirectorios
for root, dirs, files in os.walk(root_path):
    for file in files:
        # Cambia solo los archivos que terminan en .md
        if file.endswith(".mdx"):
            # Obtén el nombre completo del archivo
            old_name = os.path.join(root, file)
            # Cambia la extensión a .mdx
            new_name = old_name[:-3] + ".md"
            # Renombra el archivo
            os.rename(old_name, new_name)
            print(f"Renombrado: {old_name} -> {new_name}")
