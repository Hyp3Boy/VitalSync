import os
import typesense

# Configuración usando variables de entorno
TYPESENSE_HOST = os.environ.get('TYPESENSE_HOST', '54.208.121.82')
TYPESENSE_PORT = os.environ.get('TYPESENSE_PORT', '8108')
TYPESENSE_PROTOCOL = os.environ.get('TYPESENSE_PROTOCOL', 'http')
TYPESENSE_API_KEY = os.environ.get('TYPESENSE_API_KEY', 'sk-QClwVrriqhEYsJoiOE7wfStYfIvdeey5L32qvrk3ruLJqMcN')

# Cliente Typesense singleton
_client = None

def get_typesense_client():
    global _client
    if _client is None:
        _client = typesense.Client({
            'nodes': [{
                'host': TYPESENSE_HOST,
                'port': TYPESENSE_PORT,
                'protocol': TYPESENSE_PROTOCOL
            }],
            'api_key': TYPESENSE_API_KEY,
            'connection_timeout_seconds': 2
        })
    return _client
