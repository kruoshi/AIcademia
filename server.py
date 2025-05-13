import re
from flask import Flask, render_template, request
import fitz  # PyMuPDF
import easyocr
import numpy as np
from io import BytesIO
from pdf2image import convert_from_bytes
from supabase import create_client, Client

app = Flask(__name__)
reader = easyocr.Reader(['en'])

SUPABASE_URL = ""
SUPABASE_KEY = ""
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Extraction function using PyMuPDF
def extract_title_authors_abstract_with_fitz(pdf_bytes):
    try:
        doc = fitz.open(stream=BytesIO(pdf_bytes))
        if not doc.page_count:
            return "Error: Empty PDF", "", "", ""

        page = doc[0]
        text = page.get_text("text")
        lines = [line.strip() for line in text.split('\n') if line.strip()]

        # Find author emails and store author lines
        author_lines = []
        email_indices = []
        for i, line in enumerate(lines):
            if re.search(r'@[\w.]+', line):
                email_indices.append(i)
                if i > 0 and not re.search(r'@[\w.]+', lines[i - 1]):
                    author_lines.append(lines[i - 1])
                author_lines.append(line)

        # Get all lines before the first email line
        raw_title_lines = lines[:email_indices[0]] if email_indices else lines[:1]

        # Filter out lines that look like author names
        def is_probable_name(line):
            words = line.split()
            cap_count = sum(1 for word in words if word.istitle())
            return line.isupper() or (cap_count >= 2 and len(words) <= 5)

        title_lines = [line for line in raw_title_lines if not is_probable_name(line)]
        title = " ".join(title_lines).strip()

        # Authors block
        author_block = "\n".join(author_lines)

        # Extract abstract (ends at Keywords, 1., or Introduction)
        abstract_lines = []
        i = email_indices[-1] + 1 if email_indices else 1
        while i < len(lines):
            line = lines[i]
            if re.search(r'\bkeywords?\b', line, re.IGNORECASE) or re.match(r'^(1\.|Introduction)', line, re.IGNORECASE):
                break
            abstract_lines.append(line)
            i += 1

        abstract = "<br>".join(abstract_lines).strip()

        return "", title, author_block.strip(), abstract

    except Exception as e:
        return f"Error processing PDF with fitz: {e}", "", "", ""

# Fallback basic OCR method
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

        # Try extracting with fitz first
        error, title, authors, abstract = extract_title_authors_abstract_with_fitz(pdf_bytes)
        if not error and (title or authors or abstract):
            # Save to Supabase
            data = {
                "title": title,
                "authors": authors,
                "abstract": abstract
            }
            supabase.table("documents").insert(data).execute()

            return f"""
            <h2>Extracted Information</h2>
            <strong>Title:</strong><br>{title}<br><br>
            <strong>Authors:</strong><br><pre>{authors}</pre><br>
            <strong>Abstract:</strong><br>{abstract}<br><br>
            <em>✅ Successfully saved to Supabase.</em>
            """

        # Fallback to basic OCR
        ocr_output, _, _, _ = extract_title_authors_abstract_basic_ocr(pdf_bytes)
        if "Error" not in ocr_output and ocr_output.strip():
            return f"<pre>{ocr_output}</pre>"

        return "<h3 style='color: red;'>Could not extract any text from the PDF.</h3>"

    except Exception as e:
        return f"<h3 style='color: red;'>Error during upload: {str(e)}</h3>"

if __name__ == '__main__':
    app.run(debug=True)
