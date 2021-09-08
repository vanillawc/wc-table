<h1 align="center">&lt;wc-table&gt; CSV/JSON -> HTML Table</h1>

<div align="center">
  <a href="https://github.com/vanillawc/wc-table/releases"><img src="https://badgen.net/github/tag/vanillawc/wc-table" alt="GitHub Releases"></a>
  <a href="https://www.npmjs.com/package/@vanillawc/wc-table"><img src="https://badgen.net/npm/v/@vanillawc/wc-table" alt="NPM Releases"></a>
  <a href="https://bundlephobia.com/result?p=@vanillawc/wc-table"><img src="https://badgen.net/bundlephobia/minzip/@vanillawc/wc-table" alt="Bundlephobia"></a>
  <a href="https://github.com/vanillawc/wc-table/actions"><img src="https://github.com/vanillawc/wc-table/workflows/Latest/badge.svg" alt="Latest Status"></a>
  <a href="https://github.com/vanillawc/wc-table/actions"><img src="https://github.com/vanillawc/wc-table/workflows/Release/badge.svg" alt="Release Status"></a>

  <a href="https://discord.gg/aSWYgtybzV"><img alt="Discord" src="https://img.shields.io/discord/723296249121603604?color=%23738ADB"></a>
  <a href="https://www.webcomponents.org/element/vanillawc/wc-table"><img src="https://img.shields.io/badge/webcomponents.org-published-blue.svg" alt="Published on WebComponents.org"></a>
</div>

## Installation

*Installation*
```sh
npm i @vanillawc/wc-table
```

*Import from NPM*
```html
<script type="module" src="node_modules/@vanillawc/wc-table/index.js"></script>
```

*Import from CDN*
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/vanillawc/wc-table@1/index.js"></script>
```

## Demo

Try it on [WebComponents.dev](https://webcomponents.dev/edit/0I1OI38WhFGh8fgdMctK?sv=1&pm=1)

## Usage

**Attributes**

- `src` - load an external CSV/JSON file
- `no-headers` - there is no header row

**Properties**

- `value` - get/set the editor's contents
- `noHeaders` - `no-headers` as a property

### Basic Usage

```html
<wc-table src="sample.csv"></wc-table>
```

### 'no-headers' Attribute

Use `no-headers` if your data doesn't contain row headers

```html
<wc-table src="sample2.csv" no-headers></wc-table>
```

## Styling

By default, `<wc-table>` contains an un-styled `<table>` element in the lightDOM. That means, it will inherit any global CSS styles present on the site and can be styled directly using CSS.

## Contributing

See [CONTRIBUTING.md](https://github.com/vanillawc/vanillawc/blob/main/CONTRIBUTING.md)
