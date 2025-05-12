from sentence_transformers import SentenceTransformer
import numpy as np

def get_model(model_name):
    return SentenceTransformer(model_name)

def encode_projects(model, descriptions):
    embeddings = model.encode(descriptions, convert_to_tensor=False)
    return np.array(embeddings)
