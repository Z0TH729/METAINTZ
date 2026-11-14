# METAINTZ

**Public File Metadata Intelligence Tool**

METAINTZ is a static web application for inspecting metadata in files that the operator owns or is explicitly authorized to assess.

## Technology

- HTML
- JavaScript
- SVG
- GitHub Pages for static hosting

No Python backend, Node.js runtime, or server-side application is required.

## Planned capabilities

- Inspect files selected by the user in the browser.
- Extract supported document and image metadata using JavaScript libraries where necessary.
- Present structured inspection results.
- Support authorized-domain workflows only where browser security and the target server's CORS policy permit access.

## Browser limitations

A static website cannot freely read arbitrary files from other websites. Cross-origin requests are controlled by the browser's CORS policy. The initial inspector will therefore prioritize local files selected by the user. Any future remote URL feature must explain these limitations and validate inputs.

## Safety boundaries

Use METAINTZ only with files you own or have permission to assess. Do not use it to collect private documents or personal information about third parties.

## Run locally

Open `frontend/index.html` in a browser, or serve the repository with any static HTTP server.

## GitHub Pages

The site can be published from the repository's `main` branch, using the `/frontend` folder as the publishing source if configured as the Pages source.

## License

MIT
