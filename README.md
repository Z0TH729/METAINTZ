# METAINTZ

**Public File Metadata Intelligence Tool**

METAINTZ is a static browser-based tool for inspecting metadata in files the operator owns or is explicitly authorized to assess.

## Current MVP

- Local file selection. Files are processed in the browser and are not uploaded by METAINTZ.
- PDF metadata through PDF.js.
- Image dimensions and available EXIF fields through ExifReader.
- Core properties from DOCX, XLSX, PPTX, and ODT archives through JSZip.
- Basic file information for TXT.
- JSON report export.

## Technology

- HTML
- JavaScript
- SVG (for future interface assets)
- GitHub Pages
- PDF.js, JSZip, and ExifReader loaded from public CDNs

No Python backend, Node.js runtime, or server-side application is required.

## Limitations

- Metadata availability depends on the file format and what the document actually contains.
- Some files may have missing, stripped, or altered metadata.
- Password-protected, corrupted, or unsupported files may fail to parse.
- This MVP inspects files selected by the user. It does not crawl domains or bypass browser cross-origin restrictions.
- Third-party CDN scripts require an internet connection.

## Run locally

Open `frontend/index.html` in a browser, or serve the repository with any static HTTP server.

## GitHub Pages

Publish from the `main` branch using `/(root)` as the publishing source. The root `index.html` loads the application script from `frontend/js/app.js`.

## Safety

Use METAINTZ only with files you own or have permission to assess. Do not use it to collect private documents or personal information about third parties.

## License

MIT
