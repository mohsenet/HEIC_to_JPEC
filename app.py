from flask import Flask, render_template, request, send_file, jsonify
from PIL import Image
import pillow_heif

from pathlib import Path
from werkzeug.utils import secure_filename
import tempfile
import zipfile
import shutil
import uuid
import os


# --------------------------------------------------
# Flask configuration
# --------------------------------------------------

app = Flask(__name__)

# Maximum total upload size: 500 MB
app.config["MAX_CONTENT_LENGTH"] = 500 * 1024 * 1024


# Enable HEIC / HEIF support in Pillow
pillow_heif.register_heif_opener()


ALLOWED_EXTENSIONS = {".heic", ".heif"}


# --------------------------------------------------
# Helper functions
# --------------------------------------------------

def is_heic(filename):
    """Return True if the file is HEIC/HEIF."""
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


def convert_image(input_file, output_file):
    """Convert one HEIC image to JPG."""

    image = Image.open(input_file)

    # JPEG doesn't support transparency
    if image.mode not in ("RGB", "L"):
        image = image.convert("RGB")

    image.save(
        output_file,
        "JPEG",
        quality=95,
        optimize=True
    )


# --------------------------------------------------
# Routes
# --------------------------------------------------

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/convert", methods=["POST"])
def convert():

    files = request.files.getlist("files")

    if not files:
        return jsonify({
            "error": "No files were uploaded."
        }), 400

    # Temporary directory for this conversion
    job_id = uuid.uuid4().hex

    temp_root = Path(
        tempfile.gettempdir()
    ) / f"heic_converter_{job_id}"

    input_dir = temp_root / "input"
    output_dir = temp_root / "jpg"

    input_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    converted = 0
    skipped = 0

    try:

        # ------------------------------------------
        # Save uploaded files
        # ------------------------------------------

        for file in files:

            if not file.filename:
                continue

            if not is_heic(file.filename):
                skipped += 1
                continue

            # Prevent dangerous paths
            filename = secure_filename(
                Path(file.filename).name
            )

            if not filename:
                skipped += 1
                continue

            input_file = input_dir / filename

            file.save(input_file)

        # ------------------------------------------
        # Convert HEIC files
        # ------------------------------------------

        for input_file in input_dir.iterdir():

            if not input_file.is_file():
                continue

            if not is_heic(input_file.name):
                continue

            output_file = (
                output_dir /
                f"{input_file.stem}.jpg"
            )

            try:

                convert_image(
                    input_file,
                    output_file
                )

                converted += 1

            except Exception as error:

                print(
                    f"Conversion error: "
                    f"{input_file}: {error}"
                )

                skipped += 1

        # ------------------------------------------
        # Check result
        # ------------------------------------------

        if converted == 0:

            return jsonify({
                "error": "No HEIC images could be converted."
            }), 400

        # ------------------------------------------
        # Create ZIP
        # ------------------------------------------

        zip_path = temp_root / "converted_images.zip"

        with zipfile.ZipFile(
            zip_path,
            "w",
            compression=zipfile.ZIP_DEFLATED
        ) as zip_file:

            for jpg_file in output_dir.glob("*.jpg"):

                zip_file.write(
                    jpg_file,
                    arcname=jpg_file.name
                )

        # ------------------------------------------
        # Send ZIP to browser
        # ------------------------------------------

        response = send_file(
            zip_path,
            as_attachment=True,
            download_name="converted_images.zip",
            mimetype="application/zip"
        )

        # Delete temporary files after response
        @response.call_on_close
        def cleanup():

            try:
                shutil.rmtree(
                    temp_root,
                    ignore_errors=True
                )

            except Exception:
                pass

        return response

    except Exception as error:

        shutil.rmtree(
            temp_root,
            ignore_errors=True
        )

        print(error)

        return jsonify({
            "error": "An unexpected error occurred."
        }), 500


# --------------------------------------------------
# Error handling
# --------------------------------------------------

@app.errorhandler(413)
def too_large(error):

    return jsonify({
        "error": "The uploaded files are too large. Maximum size is 500 MB."
    }), 413


# --------------------------------------------------
# Run application
# --------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )

