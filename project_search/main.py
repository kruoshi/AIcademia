from config import CSV_FILE_PATH, MODEL_NAME, PLOT_PATH
from data_loader import load_projects
from embedder import get_model, encode_projects, create_faiss_index
from search import search_projects
from visualize import visualize_embeddings

def main():
    projects = load_projects(CSV_FILE_PATH)
    descriptions = list(projects.values())
    titles = list(projects.keys())

    model = get_model(MODEL_NAME)
    embeddings = encode_projects(model, descriptions)
    index = create_faiss_index(embeddings)

    visualize_embeddings(embeddings, titles, PLOT_PATH)

    while True:
        query = input("\nType your search query (or 'exit' to quit): ")
        if query.lower() == "exit":
            break

        results = search_projects(index, model, query, projects)
        print("🔍 Results:")
        for result in results:
            print("-", result)

if __name__ == "__main__":
    main()
