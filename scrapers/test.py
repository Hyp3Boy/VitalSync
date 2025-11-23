import os
import typesense
import json
TYPESENSE_HOST = os.environ.get('TYPESENSE_HOST', '54.208.121.82')
TYPESENSE_PORT = os.environ.get('TYPESENSE_PORT', '8108')
TYPESENSE_PROTOCOL = os.environ.get('TYPESENSE_PROTOCOL', 'http')
TYPESENSE_API_KEY = os.environ.get('TYPESENSE_API_KEY', 'sk-QClwVrriqhEYsJoiOE7wfStYfIvdeey5L32qvrk3ruLJqMcN')
client = typesense.Client({
    'nodes': [{'host': TYPESENSE_HOST, 'port': TYPESENSE_PORT, 'protocol': 'http'}],
    'api_key': TYPESENSE_API_KEY,
    'connection_timeout_seconds': 5
})

def export_specialties():
    print(f"🧠 Consultando especialidades únicas en Typesense...")

    # Hacemos una búsqueda vacía (*) pero pedimos los FACETS (categorías)
    search_params = {
        'q': '*',
        'query_by': 'nombre',
        'per_page': 0,             # No queremos los documentos, solo los contadores
        'facet_by': 'especialidades',
        'max_facet_values': 2000   # Traer hasta 2000 especialidades únicas (suficiente)
    }

    try:
        results = client.collections['ipress'].documents.search(search_params)
        
        # Extraemos la magia de los facets
        facet_counts = results.get('facet_counts', [])
        
        if not facet_counts:
            print("❌ No se encontraron facets. ¿Seguro que el campo 'especialidades' tiene 'facet: True' en el esquema?")
            return

        # Buscamos el facet específico de especialidades
        specialty_facet = next((f for f in facet_counts if f['field_name'] == 'especialidades'), None)
        
        if not specialty_facet:
            print("❌ No se encontró el facet de especialidades.")
            return

        counts = specialty_facet.get('counts', [])
        print(f"✅ Se encontraron {len(counts)} especialidades únicas.")

        # --- GUARDAR PARA EL LLM ---
        filename = "lista_especialidades.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write("LISTA DE ESPECIALIDADES MÉDICAS DISPONIBLES EN PERÚ (IPRESS):\n")
            f.write("============================================================\n")
            
            for item in counts:
                # Formato: NOMBRE (Cantidad de centros)
                # Ej: CARDIOLOGIA (500)
                line = f"{item['value']}"
                f.write(line + "\n")
                
        print(f"📄 Archivo generado: {filename}")
        print("\n--- VISTA PREVIA (Top 10) ---")
        for item in counts[:10]:
            print(f"  • {item['value']} ({item['count']})")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    export_specialties()