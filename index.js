// node_modules/@vanillaes/csv/index.js
function parse(csv, options, reviver = (v) => v) {
  const ctx = Object.create(null);
  ctx.options = options || {};
  ctx.reviver = reviver;
  ctx.value = "";
  ctx.entry = [];
  ctx.output = [];
  ctx.col = 1;
  ctx.row = 1;
  const lexer = /"|,|\r\n|\n|\r|[^",\r\n]+/y;
  const isNewline = /^(\r\n|\n|\r)$/;
  let matches = [];
  let match = "";
  let state = 0;
  while ((matches = lexer.exec(csv)) !== null) {
    match = matches[0];
    switch (state) {
      case 0:
        switch (true) {
          case match === '"':
            state = 3;
            break;
          case match === ",":
            state = 0;
            valueEnd(ctx);
            break;
          case isNewline.test(match):
            state = 0;
            valueEnd(ctx);
            entryEnd(ctx);
            break;
          default:
            ctx.value += match;
            state = 2;
            break;
        }
        break;
      case 2:
        switch (true) {
          case match === ",":
            state = 0;
            valueEnd(ctx);
            break;
          case isNewline.test(match):
            state = 0;
            valueEnd(ctx);
            entryEnd(ctx);
            break;
          default:
            state = 4;
            throw Error(`CSVError: Illegal state [row:${ctx.row}, col:${ctx.col}]`);
        }
        break;
      case 3:
        switch (true) {
          case match === '"':
            state = 4;
            break;
          default:
            state = 3;
            ctx.value += match;
            break;
        }
        break;
      case 4:
        switch (true) {
          case match === '"':
            state = 3;
            ctx.value += match;
            break;
          case match === ",":
            state = 0;
            valueEnd(ctx);
            break;
          case isNewline.test(match):
            state = 0;
            valueEnd(ctx);
            entryEnd(ctx);
            break;
          default:
            throw Error(`CSVError: Illegal state [row:${ctx.row}, col:${ctx.col}]`);
        }
        break;
    }
  }
  if (ctx.entry.length !== 0) {
    valueEnd(ctx);
    entryEnd(ctx);
  }
  return ctx.output;
}
function valueEnd(ctx) {
  const value = ctx.options.typed ? inferType(ctx.value) : ctx.value;
  ctx.entry.push(ctx.reviver(value, ctx.row, ctx.col));
  ctx.value = "";
  ctx.col++;
}
function entryEnd(ctx) {
  ctx.output.push(ctx.entry);
  ctx.entry = [];
  ctx.row++;
  ctx.col = 1;
}
function inferType(value) {
  const isNumber = /.\./;
  switch (true) {
    case value === "true":
    case value === "false":
      return value === "true";
    case isNumber.test(value):
      return parseFloat(value);
    case isFinite(value):
      return parseInt(value);
    default:
      return value;
  }
}

// src/wc-table.js
var WCTable = class extends HTMLElement {
  static get observedAttributes() {
    return ["src", "no-headers"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.__initialized) {
      return;
    }
    if (oldValue !== newValue) {
      if (name === "no-headers") {
        this.noHeaders = newValue;
      } else {
        this[name] = newValue;
      }
    }
  }
  get src() {
    return this.getAttribute("src");
  }
  set src(value) {
    this.setAttribute("src", value);
    this.setSrc(value);
  }
  get value() {
    return this.__data;
  }
  set value(value) {
    this.setValue(value);
  }
  get noHeaders() {
    return this.hasAttribute("no-headers");
  }
  set noHeaders(value) {
    const noHeaders = this.hasAttribute("no-headers");
    if (noHeaders) {
      this.setAttribute("no-headers", "");
    } else {
      this.removeAttribute("no-headers");
    }
    this.setNoHeaders(noHeaders);
  }
  constructor() {
    super();
    this.__initialized = false;
    this.__headers = true;
    this.__data = [];
    this.__table = document.createElement("table");
    this.appendChild(this.__table);
  }
  async connectedCallback() {
    if (this.hasAttribute("no-headers")) {
      this.__headers = false;
    }
    if (this.hasAttribute("src")) {
      this.setSrc();
    }
    this.__initialized = true;
  }
  async setSrc() {
    if (this.hasAttribute("src")) {
      const rawCSV = await this.fetchSrc(this.src);
      this.__data = parse(rawCSV);
      this.render();
    }
  }
  async fetchSrc(src) {
    const response = await fetch(src);
    if (response.status !== 200)
      throw Error(`ERR ${response.status}: ${response.statusText}`);
    return response.text();
  }
  setValue(value) {
    this.__data = parse(value);
    this.render();
  }
  setNoHeaders(noHeaders) {
    this.__headers = !noHeaders;
    this.render();
  }
  render() {
    const data = [...this.__data];
    const table = document.createElement("table");
    if (this.__headers) {
      const headers = data.shift();
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.innerText = header;
        tr.appendChild(th);
      });
      thead.append(tr);
      table.appendChild(thead);
    }
    const tbody = document.createElement("tbody");
    data.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        td.innerText = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    this.removeChild(this.__table);
    this.__table = table;
    this.appendChild(this.__table);
  }
};
customElements.define("wc-table", WCTable);
export {
  WCTable
};
