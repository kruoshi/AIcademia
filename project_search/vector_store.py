from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import numpy as np
import uuid

COLLECTION_NAME = "project_embeddings"

client = qdrant_client = QdrantClient(
    url="https://92c47a82-3038-4778-8e6e-500fed5414e7.eu-west-1-0.aws.cloud.qdrant.io:6333", 
    api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.2-gRkBodqhWG4gVFaNcwBta5DsE5uiHwnikgv7x6k0c",
)

print(qdrant_client.get_collections())

def setup_collection(embedding_dim):
    if COLLECTION_NAME not in [c.name for c in client.get_collections().collections]:
        client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=embedding_dim, distance=Distance.COSINE)
        )

def upload_embeddings(projects_dict, embeddings):
    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=vector.tolist(),
            payload={"title": title, "description": projects_dict[title]}
        )
        for title, vector in zip(projects_dict.keys(), embeddings)
    ]
    client.upsert(collection_name=COLLECTION_NAME, points=points)

def search_projects(query_embedding, k=3):
    search_result = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding[0].tolist(),
        limit=k
    )
    return [
        {"title": hit.payload['title'], "description": hit.payload['description']}
        for hit in search_result
    ]
