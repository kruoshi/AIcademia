from flask import Flask, render_template, request
from pdf2image import convert_from_bytes
import easyocr
import numpy as np

app = Flask(__name__)
reader = easyocr.Reader(['en'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['pdf']

    try:
        images = convert_from_bytes(file.read())
        all_lines = []

        for image in images:
            image = image.convert("RGB")
            np_image = np.array(image)
            lines = reader.readtext(np_image, detail=0, paragraph=False)
            all_lines.extend([line.strip() for line in lines if line.strip()])

        # Step 1: TITLE (first 3 lines)
        title_lines = all_lines[:3]
        title = ' '.join(title_lines)

        # Step 2: Find last line containing 'ph' (case-insensitive)
        last_email_index = -1
        for i, line in enumerate(all_lines):
            if 'ph' in line.lower():
                last_email_index = i

        # Step 3: AUTHORS = lines 4 to last_email_index (inclusive)
        if last_email_index != -1:
            authors = ' '.join(all_lines[3:last_email_index + 1])
            abstract = ' '.join(all_lines[last_email_index + 1:])
        else:
            # fallback if no 'ph' found
            authors = ' '.join(all_lines[3:6])
            abstract = ' '.join(all_lines[6:])

        return f"""
        <h3>Title</h3><p>{title}</p>
        <h3>Authors</h3><p>{authors}</p>
        <h3>Abstract</h3><p>{abstract}</p>
        """

    except Exception as e:
        return f"<h3 style='color: red;'>Error: {str(e)}</h3>"

if __name__ == '__main__':
    app.run(debug=True)
