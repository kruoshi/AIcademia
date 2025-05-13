import re
from flask import Flask, render_template, request
import fitz  # PyMuPdf
import easyocr
import numpy as np
from io import BytesIO

app = Flask(__name__)
reader = easyocr.Reader(['en'])

def extract_title_authors_abstract_with_fitz(pdf_bytes):
    title = ""
    authors = ""
    abstract = ""

    try:
        doc = fitz.open(stream=BytesIO(pdf_bytes))
        if not doc.page_count:
            return "Error: Empty PDF", "", ""

        page = doc[0]  # Process the first page
        text = page.get_text("text")
        return "FITz Text:\n" + text, "", "" # Return raw text for debugging

    except Exception as e:
        return f"Error processing PDF with fitz: {e}", "", ""

def extract_title_authors_abstract_basic_ocr(pdf_bytes):
    try:
        images = convert_from_bytes(pdf_bytes, first_page=1, last_page=1)
        if not images:
            return "Error: Could not convert PDF to image (basic OCR)", "", ""
        image = images[0].convert("RGB")
        np_image = np.array(image)
        ocr_results = reader.readtext(np_image, detail=0, paragraph=False)
        all_text = "\n".join(ocr_results) # Join with newline for better readability
        return "OCR Text:\n" + all_text, "", "" # Return raw OCR text for debugging

    except Exception as e:
        return f"Error during basic OCR: {e}", "", ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['pdf']

    try:
        pdf_bytes = file.read()

        # Try fitz first
        fitz_output, _, _ = extract_title_authors_abstract_with_fitz(pdf_bytes)
        print("FITz Output:\n", fitz_output)
        if "Error" not in fitz_output and fitz_output.strip():
            return f"<pre>{fitz_output}</pre>"

        # Fallback to basic OCR if fitz fails or returns no text
        ocr_output, _, _ = extract_title_authors_abstract_basic_ocr(pdf_bytes)
        print("OCR Output:\n", ocr_output)
        if "Error" not in ocr_output and ocr_output.strip():
            return f"<pre>{ocr_output}</pre>"

        return "<h3 style='color: red;'>Could not extract any text from the PDF.</h3>"

    except Exception as e:
        return f"<h3 style='color: red;'>Error during upload: {str(e)}</h3>"

if __name__ == '__main__':
    app.run(debug=True)