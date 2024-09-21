import os
import csv
import re

def read_csv(csv_file):
    data = {}
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data[row['filename']] = {
                'title': row['title'],
                'description': row['description']
            }
    return data

def update_frontmatter(content, new_title, new_description):
    # Extraer el frontmatter existente
    frontmatter_match = re.search(r'(---\s*)(.*?)(\s*---)', content, re.DOTALL)
    if not frontmatter_match:
        return content  # No hay frontmatter, devolver contenido sin cambios

    frontmatter = frontmatter_match.group(2)

    # Actualizar title y description
    frontmatter = re.sub(r'title\s*:.*', f'title: "{new_title}"', frontmatter)
    frontmatter = re.sub(r'description\s*:.*', f'description: "{new_description}"', frontmatter)

    # Reconstruir el contenido con el frontmatter actualizado
    updated_content = f"{frontmatter_match.group(1)}{frontmatter}{frontmatter_match.group(3)}{content[frontmatter_match.end():]}"
    return updated_content

def process_md_files(directory, csv_data):
    for filename in os.listdir(directory):
        if filename.endswith('.md') and filename in csv_data:
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()

            new_title = csv_data[filename]['title']
            new_description = csv_data[filename]['description']

            updated_content = update_frontmatter(content, new_title, new_description)

            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(updated_content)

            print(f"Actualizado: {filename}")

# Uso del script
directory = '../src/content/blog'  # Reemplaza con la ruta a tu directorio de archivos .md
csv_file = 'output_final.csv'  # El archivo CSV generado anteriormente

csv_data = read_csv(csv_file)
process_md_files(directory, csv_data)

print("Proceso de actualización completado.")
