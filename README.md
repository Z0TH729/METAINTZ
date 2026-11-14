# METAINTZ

**Public File Metadata Intelligence Tool**

METAINTZ is an educational file-metadata inspection project. Its initial scope is to inspect files that the operator owns or is explicitly authorized to assess, and to support audits of documents intentionally made public.

## Project status

Early development. The current version contains the initial application skeleton and API health endpoint. Metadata extraction and domain discovery will be added in later stages.

## Planned capabilities

- Inspect metadata from user-supplied, authorized file sources.
- Support PDF, Office Open XML, text, and common image formats.
- Report extracted metadata in structured form.
- Provide an authorized-domain discovery workflow with explicit scope controls.

## Safety boundaries

- Only inspect files you own or have permission to assess.
- Do not use this project to collect private documents or personal information about third parties.
- Domain discovery must be limited to domains for which the operator has authorization.
- Future URL fetching must enforce HTTPS where appropriate, block private and loopback network destinations, validate redirects and file types, and apply strict download and timeout limits.

## Development

Requirements: Python 3.11+

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Open `http://127.0.0.1:8000/api/health` to verify the API.

The frontend is plain HTML and JavaScript for now. No CSS framework or visual styling is included.

## License

MIT
