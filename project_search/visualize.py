import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from mpl_toolkits.mplot3d import Axes3D

def visualize_embeddings(embeddings, titles, output_path):
    tsne = TSNE(n_components=3, random_state=42, perplexity=5, n_iter=3000)
    reduced = tsne.fit_transform(embeddings)

    fig = plt.figure(figsize=(14, 10))
    ax = fig.add_subplot(111, projection='3d')

    xs, ys, zs = reduced[:, 0], reduced[:, 1], reduced[:, 2]
    ax.scatter(xs, ys, zs, c='skyblue', s=60, edgecolors='k', alpha=0.7)

    for i, title in enumerate(titles):
        ax.text(xs[i], ys[i], zs[i], title, size=8)

    ax.set_title("Project Embeddings Visualized with t-SNE (3D)")
    ax.set_xlabel("Dimension 1")
    ax.set_ylabel("Dimension 2")
    ax.set_zlabel("Dimension 3")

    plt.tight_layout()
    plt.savefig(output_path)
    plt.show()
