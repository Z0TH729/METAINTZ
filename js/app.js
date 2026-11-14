"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#search-form");
  const groups = document.querySelector("#extension-groups");
  const output = document.querySelector("#query-output");
  const copyButton = document.querySelector("#copy-button");
  const status = document.querySelector("#status");

  for (const group of window.METAINTZ_EXTENSIONS) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = group.group;
    fieldset.append(legend);

    const labelAll = document.createElement("label");
    const all = document.createElement("input");
    all.type = "checkbox";
    all.dataset.selectGroup = "true";
    labelAll.append(all, document.createTextNode(" Selecionar todos"));
    fieldset.append(labelAll);

    const list = document.createElement("p");
    for (const extension of group.items) {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "extension";
      checkbox.value = extension;
      label.append(checkbox, document.createTextNode(" ." + extension + " "));
      list.append(label);
    }
    fieldset.append(list);
    all.addEventListener("change", () => {
      fieldset.querySelectorAll('input[name="extension"]').forEach(input => input.checked = all.checked);
    });
    fieldset.addEventListener("change", event => {
      if (event.target.name === "extension") {
        const choices = Array.from(fieldset.querySelectorAll('input[name="extension"]'));
        all.checked = choices.every(input => input.checked);
        all.indeterminate = choices.some(input => input.checked) && !all.checked;
      }
    });
    groups.append(fieldset);
  }

  function generate() {
    const query = window.METAINTZ_SEARCH.build(form);
    output.textContent = query || "Informe ao menos um termo ou selecione uma extensão.";
    copyButton.disabled = !query;
    status.textContent = query ? "Consulta pronta." : "Preencha os campos da pesquisa.";
    return query;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const query = generate();
    if (query) window.open("https://www.google.com/search?q=" + encodeURIComponent(query), "_blank", "noopener,noreferrer");
  });

  document.querySelector("#preview-button").addEventListener("click", generate);

  copyButton.addEventListener("click", async () => {
    const query = output.textContent;
    try {
      await navigator.clipboard.writeText(query);
      status.textContent = "Consulta copiada.";
    } catch {
      status.textContent = "Não foi possível copiar automaticamente. Selecione e copie a consulta.";
    }
  });

  form.addEventListener("input", () => {
    copyButton.disabled = true;
    status.textContent = "Campos alterados. Gere a consulta novamente.";
  });
});
