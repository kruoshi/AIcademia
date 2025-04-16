from sentence_transformers import SentenceTransformer
import numpy as np
import faiss

def get_model(model_name):
    return SentenceTransformer(model_name)

def encode_projects(model, descriptions):
    embeddings = model.encode(descriptions, convert_to_tensor=False)
    return np.array(embeddings)

def create_faiss_index(embeddings):
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index
