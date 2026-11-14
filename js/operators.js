"use strict";

window.METAINTZ_OPERATORS = {
  site: value => value ? "site:" + value.replace(/^https?:\\/\\//i, "").replace(/\\/$/, "") : "",
  intitle: value => value ? "intitle:" + value.trim().split(/\\s+/).join(" intitle:") : "",
  inurl: value => value ? "inurl:" + value.trim().split(/\\s+/).join(" inurl:") : "",
  intext: value => value ? "intext:" + value.trim().split(/\\s+/).join(" intext:") : "",
  exclude: value => value ? value.trim().split(/\\s+/).map(term => "-" + term).join(" ") : ""
};
