def search_projects(index, model, query, projects_dict, top_k=3):
    query_embedding = model.encode([query])
    D, I = index.search(query_embedding, k=top_k)
    
    project_titles = list(projects_dict.keys())
    return [project_titles[idx] for idx in I[0]]
