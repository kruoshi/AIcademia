import os
import re
import json
import numpy as np
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from pdf2image import convert_from_bytes
import fitz  # PyMuPDF
import easyocr
from io import BytesIO
from deepseek import extract_keywords

app = Flask(__name__)
load_dotenv()
reader = easyocr.Reader(['en'])


def extract_title_authors_abstract_with_fitz(pdf_bytes):
    try:
        doc = fitz.open(stream=BytesIO(pdf_bytes))
        if not doc.page_count:
            return "Error: Empty PDF", "", "", ""

        page = doc[0]
        blocks = page.get_text("dict")["blocks"]

        # Find largest font-size block near the top of the page
        candidates = []
        for block in blocks:
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    text = span["text"].strip()
                    if not text or "college of information" in text.lower():
                        continue
                    candidates.append((span["size"], span["bbox"][1], text))  # (size, y, text)

        # Sort by font size (descending), then by y position (ascending)
        candidates.sort(key=lambda x: (-x[0], x[1]))

        title_text = candidates[0][2] if candidates else ""

        # Extract authors
        lines = [line.strip() for line in page.get_text("text").split('\n') if line.strip()]
        author_lines = []
        email_indices = []
        for i, line in enumerate(lines):
            if re.search(r'@[\w.]+', line):
                email_indices.append(i)
                if i > 0 and not re.search(r'@[\w.]+', lines[i - 1]):
                    author_lines.append(lines[i - 1])
                author_lines.append(line)
        author_block = "\n".join(author_lines)

        # Abstract: start after email, stop at Keywords or 1./Introduction
        abstract_lines = []
        i = email_indices[-1] + 1 if email_indices else 1
        while i < len(lines):
            line = lines[i]
            if re.search(r'\bkeywords?\b', line, re.IGNORECASE) or re.match(r'^(1\.|Introduction)', line, re.IGNORECASE):
                break
            abstract_lines.append(line)
            i += 1
        abstract = " ".join(abstract_lines).strip()

        return "", title_text.strip(), author_block.strip(), abstract

    except Exception as e:
        return f"Error processing PDF with fitz: {e}", "", "", ""


def extract_title_authors_abstract_basic_ocr(pdf_bytes):
    try:
        images = convert_from_bytes(pdf_bytes, first_page=1, last_page=1)
        if not images:
            return "Error: Could not convert PDF to image", "", "", ""

        image = images[0].convert("RGB")
        np_image = np.array(image)
        ocr_results = reader.readtext(np_image, detail=0, paragraph=False)
        all_text = "\n".join(ocr_results)
        return "OCR Text:\n" + all_text, "", "", ""

    except Exception as e:
        return f"Error during basic OCR: {e}", "", "", ""


def parse_author_block_to_json(author_block):
    lines = [line.strip() for line in author_block.split("\n") if line.strip()]
    authors = []
    i = 0
    while i < len(lines):
        name_line = lines[i]
        email_line = lines[i + 1] if i + 1 < len(lines) else ""
        email_match = re.search(r'[\w\.-]+@[\w\.-]+', email_line)
        email = email_match.group() if email_match else ""

        authors.append({
            "name": name_line,
            "email": email,
            "organization": "College of Information and Computing Sciences",
            "university": "University of Santo Tomas"
        })
        i += 2

    return authors

def extract_title_with_fitz(pdf_path):
    import fitz
    doc = fitz.open(pdf_path)
    page = doc[0]
    blocks = page.get_text("dict")["blocks"]

    biggest_font_size = 0
    title_text = ""

    for block in blocks:
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                if span["size"] > biggest_font_size:
                    biggest_font_size = span["size"]
                    title_text = span["text"]
    return title_text.strip()

@app.route('/')
def index():
    return '''
    <h2>Upload PDF</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="pdf" accept=".pdf" required />
        <button type="submit">Extract</button>
    </form>
    '''


@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['pdf']
    try:
        pdf_bytes = file.read()

        error, title, authors_block, abstract = extract_title_authors_abstract_with_fitz(pdf_bytes)
        if not error and (title or authors_block or abstract):
            authors_json = parse_author_block_to_json(authors_block)

            try:
                keywords = extract_keywords(title, abstract)
            except Exception as e:
                print("DeepSeek failed:", e)
                keywords = []

            return jsonify({
                "success": True,
                "source": "fitz",
                "title": title,
                "authors": authors_json,
                "abstract": abstract,
                "keywords": keywords
            })

        # fallback
        ocr_output, _, _, _ = extract_title_authors_abstract_basic_ocr(pdf_bytes)
        if "Error" not in ocr_output and ocr_output.strip():
            return jsonify({
                "success": True,
                "source": "easyocr",
                "ocr_text": ocr_output
            })

        return jsonify({
            "success": False,
            "error": "Could not extract any text from the PDF."
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })


if __name__ == '__main__':
    print("Flask OCR server running at http://localhost:5000")
    app.run(debug=True)
