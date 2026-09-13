# HEIC to JPG Web Converter

A modern, responsive web application built with **Python and Flask** for converting HEIC/HEIF images to JPG.

The application allows users to upload multiple HEIC images from a desktop, tablet, or mobile phone. The server converts the images using `Pillow` and `pillow-heif`, creates a ZIP archive, and provides it for download.

---

## Features

- Convert HEIC/HEIF images to JPG
- Upload multiple images at once
- Drag & drop support on desktop
- Mobile-friendly responsive interface
- Works on phones, tablets, and desktop browsers
- High-quality JPEG output
- Automatically creates a ZIP file
- Original HEIC files are never modified
- Temporary server-side storage
- Automatic cleanup of temporary files
- Maximum upload size: 500 MB
- No external/cloud image-conversion service required

---

# Technology Stack

### Backend

- Python
- Flask
- Pillow
- pillow-heif

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive design

### Output

```text
HEIC / HEIF
     ↓
Python + Pillow
     ↓
JPG
     ↓
ZIP
```

---

# Project Structure

The project has the following structure:

```text
heic-web/
│
├── app.py
├── requirements.txt
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── app.js
```

### File description

| File | Description |
|---|---|
| `app.py` | Flask web server and image conversion logic |
| `requirements.txt` | Python dependencies |
| `templates/index.html` | Web interface |
| `static/style.css` | Responsive UI styling |
| `static/app.js` | File selection, upload and download logic |

---

# Requirements

You need:

- Python 3.8 or newer
- pip
- A modern web browser

Check your Python version:

```bash
python3 --version
```

Example:

```text
Python 3.12.3
```

---

# Installation

## 1. Clone or create the project

Create the project directory:

```bash
mkdir heic-web
cd heic-web
```

Create the project structure:

```bash
mkdir templates
mkdir static
```

Your directory should now look like:

```text
heic-web/
├── templates/
└── static/
```

---

# 2. Create a Python virtual environment

It is recommended to use a virtual environment.

On Linux:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

On Windows:

```cmd
python -m venv venv
```

Activate it:

```cmd
venv\Scripts\activate
```

After activation, your terminal may show:

```text
(venv) user@computer:~/heic-web$
```

---

# 3. Install dependencies

Create:

```text
requirements.txt
```

with:

```text
Flask
Pillow
pillow-heif
```

Then install:

```bash
pip install -r requirements.txt
```

You can verify the installation:

```bash
pip list
```

You should see packages including:

```text
Flask
Pillow
pillow-heif
```

---

# Running the Application

Start the Flask server:

```bash
python app.py
```

The application will listen on:

```text
http://127.0.0.1:5000
```

Open this address in your browser:

```text
http://127.0.0.1:5000
```

---

# Using the Web Interface

The web interface provides an upload area:

```text
┌───────────────────────────────────────┐
│                                       │
│                 ↑                     │
│                                       │
│       Drop your photos here           │
│                                       │
│    or choose files from your device   │
│                                       │
│       [ Choose HEIC files ]           │
│                                       │
│       HEIC / HEIF • 500 MB            │
│                                       │
└───────────────────────────────────────┘
```

You can either:

1. Drag HEIC files into the upload area.
2. Click **Choose HEIC files**.
3. Select one or multiple files.
4. Click **Convert to JPG**.
5. Wait for conversion.
6. Click **Download ZIP**.

---

# Multiple File Conversion

The application supports multiple files.

For example:

```text
IMG001.HEIC
IMG002.HEIC
IMG003.HEIC
IMG004.HEIC
IMG005.HEIC
```

can be uploaded together.

The server converts them to:

```text
IMG001.jpg
IMG002.jpg
IMG003.jpg
IMG004.jpg
IMG005.jpg
```

and creates:

```text
converted_images.zip
```

---

# Mobile Phone Usage

The application is responsive and can be used from a phone.

If the Flask server is running on a computer connected to the same network as your phone, you can access the application from the phone.

For example, suppose your computer has this IP address:

```text
192.168.1.40
```

Start Flask:

```bash
python app.py
```

The server is configured with:

```python
app.run(
    host="0.0.0.0",
    port=5000,
    debug=True
)
```

This allows other devices on the LAN to connect.

On your phone, open:

```text
http://192.168.1.40:5000
```

Your phone and computer must be connected to the same LAN/Wi-Fi network.

---

# Network Diagram

```text
                 Wi-Fi / LAN
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   📱 Smartphone              💻 Computer
                                │
                                │
                           Flask :5000
                                │
                                ▼
                         HEIC Converter
                                │
                         pillow-heif
                                │
                                ▼
                              JPG
                                │
                                ▼
                         converted_images.zip
```

---

# HEIC Conversion Process

The application uses:

```python
import pillow_heif

pillow_heif.register_heif_opener()
```

This enables Pillow to read HEIC/HEIF images.

An image is opened using:

```python
image = Image.open(input_file)
```

Then it is converted to RGB:

```python
image = image.convert("RGB")
```

Finally, it is saved as JPEG:

```python
image.save(
    output_file,
    "JPEG",
    quality=95,
    optimize=True
)
```

---

# JPEG Quality

The current JPEG quality is:

```python
quality=95
```

This produces high-quality JPG images.

You can change it depending on your requirements.

### High quality

```python
quality=95
```

### Smaller files

```python
quality=85
```

### More compression

```python
quality=75
```

A typical recommendation is:

```text
95 → Maximum quality / larger files
90 → Very good quality
85 → Good balance
75 → Smaller files
```

---

# Upload Limit

The application currently allows a maximum total upload size of:

```text
500 MB
```

This is configured in `app.py`:

```python
app.config["MAX_CONTENT_LENGTH"] = 500 * 1024 * 1024
```

For example, to allow 1 GB:

```python
app.config["MAX_CONTENT_LENGTH"] = 1024 * 1024 * 1024
```

---

# Supported File Types

The application accepts:

```text
.heic
.heif
```

The extension check is case-insensitive.

Therefore these are supported:

```text
photo.heic
photo.HEIC
photo.Heic
photo.heif
photo.HEIF
```

---

# Security

The application uses:

```python
secure_filename()
```

from Werkzeug to prevent unsafe filenames.

The application also only accepts HEIC/HEIF extensions.

Uploaded files are stored in a temporary directory:

```text
/tmp/heic_converter_<random-id>/
```

The temporary directory contains:

```text
input/
jpg/
converted_images.zip
```

After the response is closed, the application attempts to remove the temporary directory.

---

# Privacy

This application is designed to perform the conversion locally on your own server.

The images do not need to be uploaded to an external image-conversion service.

The processing flow is:

```text
Browser
   │
   │ HEIC
   ▼
Your Flask Server
   │
   │ conversion
   ▼
JPG
   │
   ▼
ZIP
   │
   ▼
Browser
```

However, because the files are uploaded to the Flask server, anyone who can access the web application may potentially upload files to that server.

For an Internet-facing deployment, authentication, HTTPS, rate limiting, and additional upload validation should be added.

---

# Important Security Note

The development configuration uses:

```python
debug=True
```

Do **not** use Flask's development server with `debug=True` for a public production website.

For production, use a WSGI server such as:

```text
Gunicorn
```

or another production WSGI server.

For example:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

# Production Architecture

For a production deployment, a recommended architecture is:

```text
                    Internet / LAN
                          │
                          ▼
                     Nginx / HTTPS
                          │
                          ▼
                       Gunicorn
                          │
                          ▼
                       Flask
                          │
                 ┌────────┴────────┐
                 │                 │
                 ▼                 ▼
              Pillow          pillow-heif
                 │                 │
                 └────────┬────────┘
                          ▼
                         JPG
                          │
                          ▼
                         ZIP
```

---

# Troubleshooting

## `ModuleNotFoundError: No module named 'flask'`

Install Flask:

```bash
pip install Flask
```

Or:

```bash
pip install -r requirements.txt
```

---

## `ModuleNotFoundError: No module named 'pillow_heif'`

Install:

```bash
pip install pillow-heif
```

---

## The browser cannot connect

First check that Flask is running:

```bash
python app.py
```

You should see:

```text
Running on http://127.0.0.1:5000
```

Then test locally:

```text
http://127.0.0.1:5000
```

---

## Phone cannot connect

Check the server's IP address.

Linux:

```bash
ip addr
```

or:

```bash
hostname -I
```

For example:

```text
192.168.1.40
```

Then use:

```text
http://192.168.1.40:5000
```

on your phone.

Make sure:

- Phone and server are on the same network.
- Port `5000` is allowed by the firewall.
- Flask is listening on `0.0.0.0`, not only `127.0.0.1`.

---

# Linux Firewall

If you use UFW and your phone cannot connect:

```bash
sudo ufw status
```

You may allow port 5000:

```bash
sudo ufw allow 5000/tcp
```

Then try:

```text
http://SERVER-IP:5000
```

For example:

```text
http://192.168.1.40:5000
```

For a production deployment, it is generally better to expose Nginx on ports 80/443 instead of exposing Flask directly.

---

# Development Mode

For development:

```bash
python app.py
```

The application currently runs with:

```python
debug=True
```

This automatically reloads the application when Python files change.

Do not use this configuration for a public production server.

---

# Future Improvements

The current application provides the basic HEIC → JPG workflow. It can be extended with several useful features.

## Folder Upload

Allow users to select an entire folder:

```text
pictures/
├── Vacation/
│   ├── IMG001.HEIC
│   └── IMG002.HEIC
│
├── Family/
│   └── IMG003.HEIC
│
└── 2025/
    └── IMG004.HEIC
```

and preserve the folder structure inside the ZIP:

```text
converted_images.zip
│
├── Vacation/
│   ├── IMG001.jpg
│   └── IMG002.jpg
│
├── Family/
│   └── IMG003.jpg
│
└── 2025/
    └── IMG004.jpg
```

This would be particularly useful for large photo collections.

---

## Progress Bar

A future version could show:

```text
Converting...

████████████████░░░░ 80%

8 / 10 photos
```

This can be implemented using AJAX/fetch requests or a background job system.

---

## Image Preview

The application could display thumbnails before conversion:

```text
┌────────┐ ┌────────┐ ┌────────┐
│        │ │        │ │        │
│ IMG001 │ │ IMG002 │ │ IMG003 │
│        │ │        │ │        │
└────────┘ └────────┘ └────────┘
```

---

## EXIF Metadata

The converter can be extended to preserve metadata such as:

- Date/time
- Camera model
- GPS information
- Orientation
- Exposure information

This requires additional care because metadata may contain sensitive information such as GPS coordinates.

---

## Image Resizing

A resize option could be added:

```text
Original
4032 × 3024

        ↓

Resize

1920 × 1440
```

Possible options:

```text
Original
1920px
1600px
1280px
1024px
Custom
```

---

## Dark Mode

The UI can be extended with:

```text
☀ Light
🌙 Dark
```

while respecting the device's system theme.

---

# Example

Suppose you have:

```text
IMG_0001.HEIC
IMG_0002.HEIC
IMG_0003.HEIC
```

Upload them through the web interface.

The Flask server performs:

```text
IMG_0001.HEIC ──┐
IMG_0002.HEIC ──┼──► pillow-heif ──► JPG
IMG_0003.HEIC ──┘
```

Then creates:

```text
converted_images.zip
```

The browser downloads:

```text
converted_images.zip
```

containing:

```text
IMG_0001.jpg
IMG_0002.jpg
IMG_0003.jpg
```

---

# License

This project is provided as a simple utility and can be modified and extended for personal or internal use.
```

This README matches the Flask version we built above. One important next step for your original use case would be adding **folder upload + preservation of subfolders**, so you can select your entire `pictures` directory from your phone/PC and receive the same directory structure in the ZIP.