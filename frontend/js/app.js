"use strict";

const form = document.querySelector("#inspector-form");
const fileInput = document.querySelector("#file-input");
const statusNode = document.querySelector("#status");
const resultsNode = document.querySelector("#results");
const inspectButton = document.querySelector("#inspect-button");
const exportButton = document.querySelector("#export-button");

let latestReport = null;

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

const MIME_BY_EXTENSION = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  odt: "application/vnd.oasis.opendocument.text",
  txt: "text/plain",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  tif: "image/tiff",
  tiff: "image/tiff",
  webp: "image/webp"
};

function getExtension(name) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 ** 3) return (bytes / 1024 ** 2).toFixed(2) + " MB";
  return (bytes / 1024 ** 3).toFixed(2) + " GB";
}

function addMetadata(target, source) {
  for (const [key, value] of Object.entries(source || {})) {
    if (value === undefined || value === null || value === "") continue;
    target[key] = value;
  }
}

function xmlValue(xml, names) {
  for (const name of names) {
    const element = Array.from(xml.getElementsByTagName("*"))
      .find(node => node.localName === name);
    if (element && element.textContent.trim()) return element.textContent.trim();
  }
  return null;
}

async function inspectPdf(file, metadata) {
  if (!window.pdfjsLib) throw new Error("A biblioteca PDF.js não carregou.");
  const document = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const result = await document.getMetadata();
  const info = result.info || {};

  addMetadata(metadata, {
    "Título": info.Title,
    "Autor": info.Author,
    "Assunto": info.Subject,
    "Palavras-chave": info.Keywords,
    "Criador": info.Creator,
    "Aplicativo produtor": info.Producer,
    "Data de criação": info.CreationDate,
    "Data de modificação": info.ModDate,
    "Versão do PDF": info.PDFFormatVersion,
    "Número de páginas": document.numPages,
    "PDF criptografado": document.isEncrypted ? "Sim" : "Não"
  });

  if (result.metadata) {
    const xmp = result.metadata.getAll();
    addMetadata(metadata, {
      "XMP - título": xmp.title,
      "XMP - criador": Array.isArray(xmp.creator) ? xmp.creator.join(", ") : xmp.creator,
      "XMP - descrição": xmp.description,
      "XMP - ferramenta": xmp.Producer
    });
  }
}

async function inspectImage(file, metadata) {
  if (window.createImageBitmap) {
    const bitmap = await createImageBitmap(file);
    metadata["Largura"] = bitmap.width + " px";
    metadata["Altura"] = bitmap.height + " px";
    bitmap.close();
  }

  if (window.ExifReader) {
    const tags = await ExifReader.load(await file.arrayBuffer());
    const fields = {
      "Fabricante da câmera": "Make",
      "Modelo da câmera": "Model",
      "Data original": "DateTimeOriginal",
      "Software": "Software",
      "Orientação": "Orientation",
      "Tempo de exposição": "ExposureTime",
      "Abertura": "FNumber",
      "ISO": "ISOSpeedRatings",
      "Distância focal": "FocalLength",
      "GPS latitude": "GPSLatitude",
      "GPS longitude": "GPSLongitude"
    };

    for (const [label, tagName] of Object.entries(fields)) {
      const tag = tags[tagName];
      if (tag) metadata[label] = tag.description ?? String(tag.value ?? "");
    }
    metadata["Grupos de metadados EXIF"] = Object.keys(tags)
      .filter(key => tags[key] && typeof tags[key] === "object").length;
  }
}

async function inspectOffice(file, extension, metadata) {
  if (!window.JSZip) throw new Error("A biblioteca JSZip não carregou.");
  const zip = await JSZip.loadAsync(file);
  let xmlText = null;

  if (extension === "odt") {
    const entry = zip.file("meta.xml");
    if (entry) xmlText = await entry.async("text");
    if (xmlText) {
      const xml = new DOMParser().parseFromString(xmlText, "application/xml");
      addMetadata(metadata, {
        "Título": xmlValue(xml, ["title"]),
        "Autor": xmlValue(xml, ["initial-creator", "creator"]),
        "Descrição": xmlValue(xml, ["description"]),
        "Assunto": xmlValue(xml, ["subject"]),
        "Palavras-chave": xmlValue(xml, ["keyword"]),
        "Data de criação": xmlValue(xml, ["creation-date"]),
        "Data de modificação": xmlValue(xml, ["date"]),
        "Aplicativo": xmlValue(xml, ["generator"])
      });
    }
    return;
  }

  const core = zip.file("docProps/core.xml");
  if (core) {
    xmlText = await core.async("text");
    const xml = new DOMParser().parseFromString(xmlText, "application/xml");
    addMetadata(metadata, {
      "Título": xmlValue(xml, ["title"]),
      "Autor": xmlValue(xml, ["creator"]),
      "Assunto": xmlValue(xml, ["subject"]),
      "Descrição": xmlValue(xml, ["description"]),
      "Palavras-chave": xmlValue(xml, ["keywords"]),
      "Última pessoa a modificar": xmlValue(xml, ["lastModifiedBy"]),
      "Data de criação": xmlValue(xml, ["created"]),
      "Data de modificação": xmlValue(xml, ["modified"]),
      "Categoria": xmlValue(xml, ["category"]),
      "Revisão": xmlValue(xml, ["revision"])
    });
  }

  const app = zip.file("docProps/app.xml");
  if (app) {
    const appXml = new DOMParser().parseFromString(await app.async("text"), "application/xml");
    addMetadata(metadata, {
      "Aplicativo": xmlValue(appXml, ["Application"]),
      "Empresa": xmlValue(appXml, ["Company"]),
      "Páginas": xmlValue(appXml, ["Pages"]),
      "Palavras": xmlValue(appXml, ["Words"]),
      "Caracteres": xmlValue(appXml, ["Characters"])
    });
  }
}

async function inspectFile(file) {
  const extension = getExtension(file.name);
  const metadata = {
    "Nome do arquivo": file.name,
    "Extensão": extension || "Sem extensão",
    "Tipo MIME informado pelo navegador": file.type || "Não identificado",
    "Tipo MIME esperado": MIME_BY_EXTENSION[extension] || "Não mapeado",
    "Tamanho": formatBytes(file.size),
    "Tamanho em bytes": file.size,
    "Última modificação": new Date(file.lastModified).toISOString()
  };

  if (extension === "pdf") {
    await inspectPdf(file, metadata);
  } else if (["png", "jpg", "jpeg", "tif", "tiff", "webp"].includes(extension)) {
    await inspectImage(file, metadata);
  } else if (["docx", "xlsx", "pptx", "odt"].includes(extension)) {
    await inspectOffice(file, extension, metadata);
  } else if (extension === "txt") {
    const text = await file.slice(0, 4096).text();
    metadata["Codificação presumida"] = "UTF-8 (leitura inicial)";
    metadata["Tamanho da amostra de texto"] = text.length + " caracteres";
    metadata["Conteúdo textual detectado"] = text.trim().length ? "Sim" : "Não";
  } else {
    throw new Error("Formato ainda não suportado nesta versão.");
  }

  return {
    application: "METAINTZ",
    schemaVersion: "1.0",
    inspectedAt: new Date().toISOString(),
    file: metadata
  };
}

function renderReport(report) {
  const heading = document.createElement("h3");
  heading.textContent = report.file["Nome do arquivo"];

  const list = document.createElement("dl");
  for (const [key, value] of Object.entries(report.file)) {
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = key;
    detail.textContent = String(value);
    list.append(term, detail);
  }

  const note = document.createElement("p");
  note.textContent = "Análise executada localmente no navegador. Nenhum arquivo foi enviado pelo METAINTZ.";

  resultsNode.replaceChildren(heading, list, note);
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const file = fileInput.files[0];
  if (!file) {
    statusNode.textContent = "Selecione um arquivo primeiro.";
    return;
  }

  inspectButton.disabled = true;
  exportButton.disabled = true;
  latestReport = null;
  statusNode.textContent = "Analisando arquivo...";
  resultsNode.replaceChildren();

  try {
    latestReport = await inspectFile(file);
    renderReport(latestReport);
    statusNode.textContent = "Inspeção concluída.";
    exportButton.disabled = false;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido.";
    statusNode.textContent = "Falha na inspeção: " + message;
    const detail = document.createElement("p");
    detail.textContent = "Verifique se o formato é suportado e se o arquivo não está danificado ou protegido.";
    resultsNode.replaceChildren(detail);
    console.error("METAINTZ inspection error:", error);
  } finally {
    inspectButton.disabled = false;
  }
});

exportButton.addEventListener("click", () => {
  if (!latestReport) return;
  const blob = new Blob([JSON.stringify(latestReport, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "metaintz-report.json";
  anchor.click();
  URL.revokeObjectURL(url);
});
