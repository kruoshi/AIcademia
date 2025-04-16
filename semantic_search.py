import csv
from sentence_transformers import SentenceTransformer 
import faiss
import numpy as np
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D 

projects_dict = {}
with open('projects.csv', mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        projects_dict[row['Title']] = row['Description']

model = SentenceTransformer('all-MiniLM-L6-v2')

project_embeddings = model.encode(list(projects_dict.values()), convert_to_tensor=False)
project_embeddings = np.array(project_embeddings)

embedding_dim = project_embeddings.shape[1]
index = faiss.IndexFlatL2(embedding_dim)
index.add(project_embeddings)

query = "project that uses Raspberry Pi and camera for sorting"
query_embedding = model.encode([query])
D, I = index.search(np.array(query_embedding), k=3)

# 3D Visualization of project embeddings using t-SNE
tsne_3d = TSNE(n_components=3, random_state=42, perplexity=5, n_iter=3000)
reduced_embeddings_3d = tsne_3d.fit_transform(project_embeddings)

fig = plt.figure(figsize=(14, 10))
ax = fig.add_subplot(111, projection='3d')

project_titles = list(projects_dict.keys())
xs, ys, zs = reduced_embeddings_3d[:, 0], reduced_embeddings_3d[:, 1], reduced_embeddings_3d[:, 2]

ax.scatter(xs, ys, zs, c='skyblue', s=60, edgecolors='k', alpha=0.7)

# Annotate each point
for i, title in enumerate(project_titles):
    ax.text(xs[i], ys[i], zs[i], title, size=8)

ax.set_title("Project Embeddings Visualized with t-SNE (3D)")
ax.set_xlabel("Dimension 1")
ax.set_ylabel("Dimension 2")
ax.set_zlabel("Dimension 3")

plt.tight_layout()
plt.savefig("project_embeddings_3d_plot.png")
plt.show()


# Show results
while True:
    query = input("\nType your search query (or 'exit' to quit): ")
    if query.lower() == "exit":
        break

    query_embedding = model.encode([query])
    D, I = index.search(np.array(query_embedding), k=3)

    print("🔍 Results:")
    for idx in I[0]:
        project_title = list(projects_dict.keys())[idx]
        print("-", project_title)
