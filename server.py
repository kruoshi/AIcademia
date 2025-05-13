import re
from flask import Flask, render_template, request
import fitz  # PyMuPDF
import easyocr
import numpy as np
from io import BytesIO
from pdf2image import convert_from_bytes

app = Flask(__name__)
reader = easyocr.Reader(['en'])

def extract_title_authors_abstract_with_fitz(pdf_bytes):
    try:
        doc = fitz.open(stream=BytesIO(pdf_bytes))
        if not doc.page_count:
            return "Error: Empty PDF", "", "", ""

        page = doc[0]
        text = page.get_text("text")
        lines = [line.strip() for line in text.split('\n') if line.strip()]

        # Title
        title = lines[0] if lines else ""

        # Authors and email lines
        authors = []
        last_email_index = -1
        for i, line in enumerate(lines):
            if re.search(r'@[\w.]+', line):
                if i > 0 and not re.search(r'@[\w.]+', lines[i - 1]):
                    authors.append(lines[i - 1])
                authors.append(line)
                last_email_index = i

        author_block = "\n".join(authors)

        # Extract Abstract
        abstract_lines = []
        i = last_email_index + 1
        while i < len(lines):
            line = lines[i]
            if re.match(r'^(Keywords?|1\.|Introduction)', line, re.IGNORECASE):
                break
            abstract_lines.append(line)
            i += 1

        abstract = " ".join(abstract_lines).strip()

        return "", title.strip(), author_block.strip(), abstract

    except Exception as e:
        return f"Error processing PDF with fitz: {e}", "", "", ""

def extract_title_authors_abstract_basic_ocr(pdf_bytes):
    try:
        images = convert_from_bytes(pdf_bytes, first_page=1, last_page=1)
        if not images:
            return "Error: Could not convert PDF to image (basic OCR)", "", "", ""
        image = images[0].convert("RGB")
        np_image = np.array(image)
        ocr_results = reader.readtext(np_image, detail=0, paragraph=False)
        all_text = "\n".join(ocr_results)
        return "OCR Text:\n" + all_text, "", "", ""
    except Exception as e:
        return f"Error during basic OCR: {e}", "", "", ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['pdf']

    try:
        pdf_bytes = file.read()

        # Try fitz first
        error, title, authors, abstract = extract_title_authors_abstract_with_fitz(pdf_bytes)
        if not error and (title or authors or abstract):
            return f"""
            <h2>Extracted Information</h2>
            <strong>Title:</strong><br>{title}<br><br>
            <strong>Authors:</strong><br><pre>{authors}</pre><br>
            <strong>Abstract:</strong><br><pre>{abstract}</pre>
            """

        # Fallback to basic OCR if fitz fails or is empty
        ocr_output, _, _, _ = extract_title_authors_abstract_basic_ocr(pdf_bytes)
        if "Error" not in ocr_output and ocr_output.strip():
            return f"<pre>{ocr_output}</pre>"

        return "<h3 style='color: red;'>Could not extract any text from the PDF.</h3>"

    except Exception as e:
        return f"<h3 style='color: red;'>Error during upload: {str(e)}</h3>"

if __name__ == '__main__':
    app.run(debug=True)
