from config import CSV_FILE_PATH, MODEL_NAME, PLOT_PATH, SUPABASE_URL, SUPABASE_KEY
from data_loader import load_projects
from embedder import get_model, encode_projects
from supabase import create_client, Client
from visualize import visualize_embeddings
import numpy as np

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_embeddings_to_supabase(projects, embeddings):
    for i, (title, description) in enumerate(projects.items()):
        embedding = embeddings[i].tolist()
        data = {
            'title': title,
            'description': description,
            'embedding': embedding,
        }

        # Check if project exists (now checking capstone_embed table)
        existing_project = supabase.table('capstone_embed').select('title').eq('title', title).execute()

        if existing_project.data:
            print(f"Project '{title}' already exists. Skipping insertion.")
        else:
            response = supabase.table('capstone_embed').insert(data).execute()
            if response.data:
                print(f"Project '{title}' inserted successfully!")
            else:
                print(f"Failed to insert project '{title}': {response.error}")

def vector_search_projects(query, model, top_k=5):
    """Perform pure vector similarity search using the renamed function"""
    query_embedding = model.encode([query])[0].tolist()
    
    response = supabase.rpc("vector_capstone_search", {  # Updated function name
        "embed": query_embedding
    }).execute()
    
    if response.data:
        return [{
            'title': item['title'],
            'description': item['description'],
            'score': item['similarity_score']
        } for item in response.data[:top_k]]
    return []

def main():
    projects = load_projects(CSV_FILE_PATH)
    descriptions = list(projects.values())
    titles = list(projects.keys())

    model = get_model(MODEL_NAME)
    embeddings = encode_projects(model, descriptions)

    #visualize_embeddings(embeddings, titles, PLOT_PATH)
    insert_embeddings_to_supabase(projects, embeddings)

    while True:
        query = input("\nType your search query (or 'exit' to quit): ")
        if query.lower() == "exit":
            break

        results = vector_search_projects(
            query=query,
            model=model,
            top_k=5
        )

        print("\n🔍 Search Results:")
        if not results:
            print("No matching projects found.")
        else:
            for idx, result in enumerate(results, 1):
                print(f"{idx}. {result['title']} (Score: {result['score']:.3f})")

if __name__ == "__main__":
    main()