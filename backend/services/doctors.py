from schemas.doctors import *
import typesense
from datetime import datetime
from core.client_db import get_typesense_client
from urllib.parse import quote

client = get_typesense_client()


COLLECTION_DOCTORS = 'doctores'
COLLECTION_REVIEWS = 'comments'

class DoctorService:
    @staticmethod
    def search_doctors(payload: DoctorQuery) -> DoctorQueryResult:
        #print("Searching doctors with payload:", payload)
        print("Typesense client:", payload)
        name_query = payload.name
        # speciality = payload.speciality
        top_k = payload.top_k or 10
        top_items = []

        if not name_query:
            name_query = ""
            return DoctorQueryResult(results=[])
        # search with Typesense
        search_parameters = {
            'q': name_query,
            'query_by': 'nombre_completo',
            # 'filter_by': f'specialty:={speciality}' if speciality else '',
            'per_page': top_k
        }

        search_results = client.collections[COLLECTION_DOCTORS].documents.search(
            search_parameters)

        for hit in search_results['hits']:
            doc = hit['document']
            print("Found doctor:", doc)
            top_items.append(Doctor(
                id=doc['id'],
                cmp=doc.get('cmp', ''),
                status=doc.get('estado_cmp', 'active'),
                name=doc.get('nombre_completo', 'john doe'),
                specialties=doc["especialidades"] if "especialidades" in doc else [
                ],
                n_comments=doc['total_resenas'],
                sc_acum=doc['rating_promedio']
            ))

        return DoctorQueryResult(results=top_items)

    @staticmethod
    def get_doctor_by_id(payload: IdDoctorQuery) -> Doctor:
        #print("Getting doctor by ID with payload:", payload)
        encoded_id = quote(payload.doctor_id, safe='')
        doc = client.collections[COLLECTION_DOCTORS].documents[encoded_id].retrieve(
        )
        # what is res?
        doctor_summary = Doctor(
            id=doc['id'],
            cmp=doc.get('cmp', ''),
            status=doc.get('estado_cmp', 'active'),
            name=doc.get('nombre_completo', 'john doe'),
            specialties=doc["especialidades"] if "especialidades" in doc else [],
            n_comments=doc['total_resenas'],
            sc_acum=doc['rating_promedio']
        )
        return doctor_summary

    @staticmethod
    def add_comment(payload: CommentRequest) -> str:
        # DAVID AÑADE UN COLLECTION MAS PARA LOS COMENTARIOS PTMR
        
        doctor_id = payload.doctor_id
        user_id = payload.user_id
        rating = payload.rating
        content = payload.content
        timestamp = str(datetime.now())  # get current timestamp in ISO format

        to_save = Comment(
            doctor_id=doctor_id,
            user_id=user_id,
            rating=rating,
            content=content,
            timestamp=timestamp
        )

        # convert to dict
        to_save_dict = to_save.model_dump()
        client.collections[COLLECTION_REVIEWS].documents.create(to_save_dict)
        return "Comment added successfully."

    @staticmethod
    def get_comments(payload: CommentRequest) -> CommentResult:
        #doctor_id = payload.doctor_id
#
        #search_parameters = {
        #    'q': doctor_id,
        #    'query_by': 'id',
        #    'per_page': 100  # assuming a doctor won't have more than 100 comments
        #}
        #
        #search_results = client.collections[COLLECTION_REVIEWS].documents.search(
        #    search_parameters)
        #
        ## now sort by timestamp descending
        #search_results['hits'].sort(
        #    key=lambda x: x['document']['timestamp'], reverse=True)
        #
        #comments = []
        #for hit in search_results['hits']:
        #    doc = hit['document']
        #    comments.append(Comment(
        #        doctor_id=doc['doctor_id'],
        #        user_id=doc['user_id'],
        #        rating=doc['rating'],
        #        content=doc['content'],
        #        timestamp=doc['timestamp']
        #    ))
        mock_comments : list[Comment] = [
            Comment(
                doctor_id="DOC#104594",
                user_id="user456",
                rating=4.5,
                content="Experiencia excelente con el doctor.",
                timestamp="2023-10-01T10:00:00"
            ),
            Comment(
                doctor_id="DOC#104594",
                user_id="user789",
                rating=3.0,
                content="El doctor fue amable pero la espera fue larga.",
                timestamp="2023-09-15T14:30:00"
            ),
            Comment(
                doctor_id="DOC#104594",
                user_id="user123",
                rating=5.0,
                content="El mejor doctor que he visitado. Muy profesional y atento.",
                timestamp="2023-08-20T09:15:00"
            )
        ]
        return CommentResult(comments=mock_comments)
