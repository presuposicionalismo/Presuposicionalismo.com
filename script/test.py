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

def write_csv(results, output_file):
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['filename', 'title', 'description'])
        writer.writerows(results)

# Uso del script
directory = '../src/content/blog'  # Reemplaza con la ruta a tu directorio
output_file = 'output.csv'  # Nombre del archivo CSV de salida

results = process_md_files(directory)
write_csv(results, output_file)

print(f"Se ha creado el archivo CSV: {output_file}")
