"use strict";

window.METAINTZ_SEARCH = {
  build(form) {
    const value = id => form.querySelector("#" + id).value.trim();
    const parts = [];
    const terms = value("terms");
    if (terms) parts.push(document.querySelector("#exact").checked ? '"' + terms.replace(/"/g, "") + '"' : terms);

    const ops = window.METAINTZ_OPERATORS;
    [["site", "site"], ["intitle", "title"], ["inurl", "url"], ["intext", "inside"]].forEach(([key, id]) => {
      const part = ops[key](value(id));
      if (part) parts.push(part);
    });

    if (document.querySelector("#inurl-any").checked && terms && !value("url")) {
      parts.push(ops.inurl(terms));
    }

    const excluded = ops.exclude(value("exclude"));
    if (excluded) parts.push(excluded);

    const selected = Array.from(form.querySelectorAll('input[name="extension"]:checked')).map(input => input.value);
    if (selected.length === 1) parts.push("filetype:" + selected[0]);
    if (selected.length > 1) parts.push("(" + selected.map(ext => "filetype:" + ext).join(" OR ") + ")");

    return parts.join(" ").replace(/\s+/g, " ").trim();
  }
};
