from schemas.centers import *
from core.client_db import get_typesense_client
from urllib.parse import quote
import typesense


client = get_typesense_client()
COLLECTION_CENTERS = 'ipress'

class CenterService:
    @staticmethod
    def search_centers(payload: HealthCenterQuery) -> HealthCentersQueryResult:
        """
        Search health centers using Typesense, combining geographical proximity
        with text-based search for name and description.
        """
        name_query = payload.name
        ubication = payload.location
        description = payload.description
        max_radius = payload.max_radius if payload.max_radius is not None else 10  # Default to 10km
        top_k = 15  # default value for results per page

        search_parameters = {
            'per_page': top_k,
            'prioritize_exact_match': False  # Adjust as needed
        }

        text_queries_parts = []
        query_by_fields_parts = []

        if name_query:
            text_queries_parts.append(name_query)
            query_by_fields_parts.append('nombre_completo')

        if description:
            text_queries_parts.append(description)
            query_by_fields_parts.append('descripcion')

        if text_queries_parts:
            search_parameters['q'] = ' '.join(text_queries_parts)
            search_parameters['query_by'] = ','.join(query_by_fields_parts)
        else:
            search_parameters['q'] = '*'
            search_parameters['query_by'] = 'nombre_completo'

        if ubication and len(ubication) == 2:
            lat, lon = ubication[0], ubication[1]
            geo_filter = f'ubicacion_geopoint:({lat}, {lon}, {max_radius} km)'

            if 'filter_by' in search_parameters:
                search_parameters['filter_by'] += f' && {geo_filter}'
            else:
                search_parameters['filter_by'] = geo_filter

            search_parameters['sort_by'] = f'ubicacion_geopoint:({lat}, {lon}):asc'
        #print(f"Final Typesense search parameters: {search_parameters}")
        try:
            search_results = client.collections[COLLECTION_CENTERS].documents.search(
                search_parameters)
            mr = []
            for hit in search_results['hits']:
                doc = hit['document']
                mr.append(HealthCenter(
                    id=doc['id'],
                    name=doc.get('nombre', 'Unnamed Center'),
                    ubication=doc.get('ubicacion', [0.0, 0.0]),
                    specialties=doc.get('especialidades', []),
                    category=doc.get('categoria', 'General'),
                    ubigeo=doc.get('ubigeo', '000000')
                ))
            return HealthCentersQueryResult(centers=mr)
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return HealthCentersQueryResult()

    @staticmethod
    def get_center_by_id(payload: IdHealthCenter) -> HealthCenter:
        """Retrieve health center data placeholder."""
        encoded_id = quote(payload.id, safe='')
        doc = client.collections[COLLECTION_CENTERS].documents[encoded_id].retrieve(
        )
        center_summary = HealthCenter(
            id=doc['id'],
            name=doc.get('nombre', 'Unnamed Center'),
            ubication=doc.get('ubicacion', [0.0, 0.0]),
            specialties=doc.get('especialidades', []),
            category=doc.get('categoria', 'General'),
            ubigeo=doc.get('ubigeo', '000000')
        )
        return center_summary
