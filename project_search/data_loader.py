import csv
import os

def load_projects(csv_path):
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"The file at {csv_path} does not exist.")
    
    projects = {}
    with open(csv_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            projects[row['Title']] = row['Description']
    return projects