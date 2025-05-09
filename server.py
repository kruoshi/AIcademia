import re
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
        all_text = []

        stop = False
        for image in images:
            if stop:
                break
            image = image.convert("RGB")
            np_image = np.array(image)
            ocr_results = reader.readtext(np_image, detail=1, paragraph=False)

            for bbox, text, conf in ocr_results:
                if "keywords" in text.lower():
                    stop = True
                    break
                all_text.append((bbox, text.strip()))

        # Sort top to bottom using Y coordinate
        all_text.sort(key=lambda x: x[0][0][1])

        # Group lines into blocks and record vertical gaps
        grouped_lines = []
        block_positions = []
        last_y = None
        current_block = []

        for bbox, text in all_text:
            y = bbox[0][1]
            if last_y is not None and abs(y - last_y) > 20:
                grouped_lines.append(current_block)
                block_positions.append(last_y)
                current_block = []
            current_block.append(text)
            last_y = y
        if current_block:
            grouped_lines.append(current_block)
            block_positions.append(last_y)

        # Identify the biggest gap between blocks
        max_gap = 0
        split_index = 1
        for i in range(1, len(block_positions)):
            gap = block_positions[i] - block_positions[i - 1]
            if gap > max_gap:
                max_gap = gap
                split_index = i

        # Step 1: Title = blocks before biggest gap
        title_blocks = grouped_lines[:split_index]
        title = ' '.join([' '.join(block) for block in title_blocks]).strip()

        # Step 2: Remaining blocks = authors + abstract
        remaining_blocks = grouped_lines[split_index:]

        # Step 3: Find last block that contains 'ph' (end of authors)
        last_email_block_index = max(
            (i for i, block in enumerate(remaining_blocks)
             if any('ph' in line.lower() for line in block)),
            default=-1
        )

        if last_email_block_index == -1:
            return "<h3 style='color: red;'>Error: Could not find 'ph' to identify abstract.</h3>"

        # Step 4: Authors = from beginning of remaining_blocks to last 'ph'
        authors_blocks = remaining_blocks[:last_email_block_index + 1]
        authors = ' '.join([' '.join(block) for block in authors_blocks]).strip()

        # Step 5: Abstract = after last 'ph' block
        abstract_blocks = remaining_blocks[last_email_block_index + 1:]
        abstract = ' '.join([' '.join(block) for block in abstract_blocks]).strip()

        return f"""
        <h3>Title</h3><p>{title}</p>
        <h3>Authors</h3><p>{authors}</p>
        <h3>Abstract</h3><p>{abstract}</p>
        """

    except Exception as e:
        return f"<h3 style='color: red;'>Error: {str(e)}</h3>"

if __name__ == '__main__':
    app.run(debug=True)
