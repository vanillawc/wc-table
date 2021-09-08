/* eslint no-undef: 0 */
import { parse } from '../node_modules/@vanillaes/csv/index.js'

export class WCTable extends HTMLElement {
  static get observedAttributes () {
    return ['src', 'no-headers']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (!this.__initialized) { return }
    if (oldValue !== newValue) {
      if (name === 'no-headers') {
        this.noHeaders = newValue
      } else {
        this[name] = newValue
      }
    }
  }

  get src () { return this.getAttribute('src') }
  set src (value) {
    this.setAttribute('src', value)
    this.setSrc(value)
  }

  get value () { return this.__data }
  set value (value) {
    this.setValue(value)
  }

  get noHeaders () { return this.hasAttribute('no-headers') }
  set noHeaders (value) {
    const noHeaders = this.hasAttribute('no-headers')
    if (noHeaders) {
      this.setAttribute('no-headers', '')
    } else {
      this.removeAttribute('no-headers')
    }
    this.setNoHeaders(noHeaders)
  }

  constructor () {
    super()
    this.__initialized = false
    this.__headers = true
    this.__data = []
    this.__table = document.createElement('table')
    this.appendChild(this.__table)
  }

  async connectedCallback () {
    if (this.hasAttribute('no-headers')) {
      this.__headers = false
    }

    if (this.hasAttribute('src')) {
      this.setSrc()
    }

    this.__initialized = true
  }

  async setSrc () {
    if (this.hasAttribute('src')) {
      const rawCSV = await this.fetchSrc(this.src)
      this.__data = parse(rawCSV)
      this.render()
    }
  }

  async fetchSrc (src) {
    const response = await fetch(src)
    if (response.status !== 200) throw Error(`ERR ${response.status}: ${response.statusText}`)
    return response.text()
  }

  setValue (value) {
    this.__data = parse(value)
    this.render()
  }

  setNoHeaders (noHeaders) {
    this.__headers = !noHeaders
    this.render()
  }

  render () {
    const data = [...this.__data]
    const table = document.createElement('table')

    if (this.__headers) {
      const headers = data.shift()
      const thead = document.createElement('thead')
      const tr = document.createElement('tr')
      headers.forEach(header => {
        const th = document.createElement('th')
        th.innerText = header
        tr.appendChild(th)
      })
      thead.append(tr)
      table.appendChild(thead)
    }

    const tbody = document.createElement('tbody')
    data.forEach(row => {
      const tr = document.createElement('tr')
      row.forEach(cell => {
        const td = document.createElement('td')
        td.innerText = cell
        tr.appendChild(td)
      })
      tbody.appendChild(tr)
    })
    table.appendChild(tbody)

    this.removeChild(this.__table)
    this.__table = table
    this.appendChild(this.__table)
  }
}

customElements.define('wc-table', WCTable)
