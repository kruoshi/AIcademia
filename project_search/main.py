import os
from supabase import create_client, Client
import numpy as np
from embedder import get_model, encode_projects
from visualize import visualize_embeddings
from config import MODEL_NAME, PLOT_PATH, SUPABASE_URL, SUPABASE_KEY

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def load_projects_from_supabase():
    """Load projects from Supabase capstones table"""
    response = supabase.table('capstones').select('id,title,keywords').execute()  # Removed abstract
    if not response.data:
        raise ValueError("No projects found in the capstones table")
    
    projects = {}
    for row in response.data:
        # Create composite text using only title and keywords
        composite_text = f"{row['title']}\n\nKeywords: {row['keywords']}"
        projects[row['id']] = {
            'title': row['title'],
            'composite_text': composite_text,
            'keywords': row['keywords']  # Removed abstract
        }
    return projects

def insert_embeddings_to_supabase(projects, embeddings):
    """Insert embeddings into the capstone_embed table"""
    for project_id, data in projects.items():
        embedding = embeddings[list(projects.keys()).index(project_id)].tolist()
        
        data = {
            'id': project_id,
            'title': data['title'],
            'keywords': data['keywords'],
            'embedding': embedding,
        }

        # Check if project exists in capstone_embed table
        existing_project = supabase.table('capstone_embed').select('id').eq('id', project_id).execute()

        if existing_project.data:
            print(f"Project '{data['title']}' already exists. Updating embedding.")
            response = supabase.table('capstone_embed').update({'embedding': embedding}).eq('id', project_id).execute()
        else:
            response = supabase.table('capstone_embed').insert(data).execute()
        
        if response.data:
            print(f"Project '{data['title']}' processed successfully!")
        else:
            print(f"Failed to process project '{data['title']}': {response.error}")

def vector_search_projects(query, model, top_k=5):
    """Perform vector similarity search using title+keywords embeddings"""
    query_embedding = model.encode([query])[0].tolist()
    
    response = supabase.rpc("vector_capstone_search", {
        "embed": query_embedding
    }).execute()
    
    if response.data:
        return [{
            'id': item['id'],
            'title': item['title'],
            'keywords': item['keywords'],
            'score': item['similarity_score']
        } for item in response.data[:top_k]]
    return []

def main():
    # Load projects from Supabase instead of CSV
    projects = load_projects_from_supabase()
    composite_texts = [data['composite_text'] for data in projects.values()]

    model = get_model(MODEL_NAME)
    embeddings = encode_projects(model, composite_texts)

    # visualize_embeddings(embeddings, [data['title'] for data in projects.values()], PLOT_PATH)
    
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
                #print(f"   Keywords: {result['keywords']}")
                #print(f"   Abstract: {result['abstract'][:200]}...\n")

if __name__ == "__main__":
    main()