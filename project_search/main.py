from sentence_transformers import SentenceTransformer
from data_loader import load_projects
from vector_store import setup_collection, upload_embeddings, search_projects
from config import CSV_FILE_PATH

def main():
    projects = load_projects(CSV_FILE_PATH)
    model = SentenceTransformer('all-MiniLM-L6-v2')

    embeddings = model.encode(list(projects.values()), convert_to_tensor=False)
    setup_collection(embedding_dim=len(embeddings[0]))
    upload_embeddings(projects, embeddings)

    while True:
        query = input("\nType your search query (or 'exit' to quit): ")
        if query.lower() == "exit":
            break
        query_embedding = model.encode([query])
        results = search_projects(query_embedding)

        print("🔍 Results:")
        for result in results:
            print("-", result['title'])

if __name__ == "__main__":
    main()
