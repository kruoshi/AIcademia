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
        results = search_projects_supabase(query, model)
        print("🔍 Results:")
        for result in results:
            print("-", result)


if __name__ == "__main__":
    main()