from config import CSV_FILE_PATH, MODEL_NAME, PLOT_PATH, SUPABASE_URL, SUPABASE_KEY
from data_loader import load_projects
from embedder import get_model, encode_projects
from supabase import create_client, Client
from visualize import visualize_embeddings
import numpy as np
import ast  # To safely evaluate the string representation of the list
from sklearn.metrics.pairwise import cosine_similarity

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_embeddings_to_supabase(projects, embeddings):
    for i, (title, description) in enumerate(projects.items()):
        embedding = embeddings[i].tolist()  # Convert numpy array to list for compatibility
        data = {
            'title': title,  # Use 'title' directly
            'description': description,  # Use 'description' directly
            'embedding': embedding,
        }

        # Check if the project already exists in Supabase based on title
        existing_project = supabase.table('projects').select('title').eq('title', title).execute()

        if existing_project.data:
            print(f"Project '{title}' already exists in the database. Skipping insertion.")
        else:
            # Insert the project into the Supabase table
            response = supabase.table('projects').insert(data).execute()

            # Check if the insertion was successful
            if response.data:
                print(f"Project '{title}' inserted successfully!")
            else:
                print(f"Failed to insert project '{title}': {response.error}")

def hybrid_search_projects(query, model, top_k=3, vector_weight=0.7, keyword_weight=0.3):
    # --- Vector Search ---
    query_embedding = model.encode([query])[0].tolist()
    
    # Fetch all projects (for brute-force comparison; replace with pgvector if possible)
    response = supabase.table('projects').select('id, title, description, embedding').execute()
    
    if not response.data:
        print("No projects found.")
        return []
    
    projects = response.data
    
    # Compute vector similarities
    vector_scores = []
    for project in projects:
        emb = ast.literal_eval(project['embedding'])
        similarity = cosine_similarity([query_embedding], [emb])[0][0]
        vector_scores.append(similarity)
    
    # --- Keyword Search ---
    # Use Supabase's full-text search (assumes you have a `tsvector` column)
    keyword_response = supabase.table('projects') \
        .select('id, title, description') \
        .text_search('description', f"'{query.replace(' ', ' & ')}'") \
        .execute()
    
    keyword_matches = {item['id']: 1.0 for item in keyword_response.data}  # Binary score (1 if match)
    
    # --- Hybrid Scoring ---
    hybrid_results = []
    for idx, project in enumerate(projects):
        project_id = project['id']
        
        # Normalize vector score to [0, 1] (if not already)
        vector_score = vector_scores[idx]
        
        # Get keyword score (default to 0 if no match)
        keyword_score = keyword_matches.get(project_id, 0.0)
        
        # Combined weighted score
        hybrid_score = (vector_weight * vector_score) + (keyword_weight * keyword_score)
        
        hybrid_results.append({
            'id': project_id,
            'title': project['title'],
            'description': project['description'],
            'vector_score': vector_score,
            'keyword_score': keyword_score,
            'hybrid_score': hybrid_score
        })
    
    # Sort by hybrid score
    hybrid_results.sort(key=lambda x: x['hybrid_score'], reverse=True)
    
    # Return top K results
    return [{'title': res['title'], 'description': res['description']} for res in hybrid_results[:top_k]]

def search_projects_supabase(query, model, top_k=3):
    # Encode the query to get its embedding
    query_embedding = model.encode([query])[0].tolist()  # Convert query embedding to list

    # Query Supabase to get the project titles and embeddings
    response = supabase.table('projects').select('title', 'embedding').execute()

    if response.data:
        project_titles = [item['title'] for item in response.data]
        project_embeddings = [ast.literal_eval(item['embedding']) for item in response.data]  # Convert string to list

        # Compute cosine similarity between the query embedding and each project embedding
        similarities = []
        for emb in project_embeddings:
            similarity = cosine_similarity([query_embedding], [emb])[0][0]  # Cosine similarity
            similarities.append(similarity)

        # Combine the project titles with their similarities
        project_similarities = list(zip(project_titles, similarities))

        # Sort by similarity (in descending order) and get the top_k results
        project_similarities.sort(key=lambda x: x[1], reverse=True)
        top_results = project_similarities[:top_k]

        # Return the top K project titles based on the similarity
        return [result[0] for result in top_results]
    else:
        print("No projects found.")
        return []



def main():
    projects = load_projects(CSV_FILE_PATH)
    descriptions = list(projects.values())
    titles = list(projects.keys())

    model = get_model(MODEL_NAME)  # Get the model here
    embeddings = encode_projects(model, descriptions)

    visualize_embeddings(embeddings, titles, PLOT_PATH)

    while True:
        query = input("\nType your search query (or 'exit' to quit): ")
        if query.lower() == "exit":
            break

        # Pass the model to the search function
        #results = search_projects_supabase(query, model)
        results = hybrid_search_projects(
            query=query,
            model=model,
            top_k=5,               # Number of results to return
            vector_weight=0.7,     # Weight for semantic search (70%)
            keyword_weight=0.3     # Weight for keyword search (30%)
        )
        print("\n🔍 Search Results:")
        if not results:
            print("No matching projects found.")
        else:
            for idx, result in enumerate(results, 1):
                print(f"{idx}. {result['title']}")


if __name__ == "__main__":
    main()