import os
import csv
import re

def extract_frontmatter(content):
    frontmatter_match = re.search(r'---\s*(.*?)\s*---', content, re.DOTALL)
    if frontmatter_match:
        return frontmatter_match.group(1)
    return ''

def extract_value(frontmatter, key):
    match = re.search(rf'{key}\s*:\s*"(.+?)"', frontmatter)
    if match:
        return match.group(1)
    return ''

def process_md_files(directory):
    results = []
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()

            frontmatter = extract_frontmatter(content)
            title = extract_value(frontmatter, 'title')
            description = extract_value(frontmatter, 'description')

            results.append([filename, title, description])

    return results

def read_resumenes_csv(file_path):
    resumenes = {}
    with open(file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            resumenes[row['title']] = row['description']
    return resumenes

def is_lorem_ipsum(text):
    return 'lorem ipsum' in text.lower()

def compare_and_update(results, resumenes):
    updated_results = []
    for result in results:
        filename, title, description = result
        if is_lorem_ipsum(description) and title in resumenes:
            description = resumenes[title]
        updated_results.append([filename, title, description])
    return updated_results

def write_csv(results, output_file):
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['filename', 'title', 'description'])
        writer.writerows(results)

# Uso del script
directory = '../src/content/blog'  # Reemplaza con la ruta a tu directorio
resumenes_file = 'Resume.csv'  # Asegúrate de que este archivo esté en la misma carpeta que el script
output_file = 'output_final.csv'  # Nombre del archivo CSV de salida

results = process_md_files(directory)
resumenes = read_resumenes_csv(resumenes_file)
updated_results = compare_and_update(results, resumenes)
write_csv(updated_results, output_file)

print(f"Se ha creado el archivo CSV final: {output_file}")
