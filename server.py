from flask import Flask, render_template, request
from pdf2image import convert_from_bytes
import easyocr
import numpy as np

app = Flask(__name__)
reader = easyocr.Reader(['en'])  # Load English OCR model

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['pdf']

    try:
        # Convert PDF bytes to list of PIL Images
        images = convert_from_bytes(file.read())

        result_text = ''
        for i, image in enumerate(images):
            # Ensure the image is in RGB mode
            image = image.convert("RGB")

            # Convert PIL Image to NumPy array
            np_image = np.array(image)

            # Perform OCR using EasyOCR
            text = reader.readtext(np_image, detail=0, paragraph=True)

            # Format and collect result
            result_text += f"<h4>Page {i+1}</h4><pre>{' '.join(text)}</pre>"

        return result_text

    except Exception as e:
        return f"<h3 style='color: red;'>Error: {str(e)}</h3>"

if __name__ == '__main__':
    app.run(debug=True)