'use strict';
const asciiGrid = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('./index.js'));

module.exports = asciiGrid;

if (!customElements.get('ascii-grid')) {
  const {COMMENT_NODE} = Node;
  const {find} = Array.prototype;
  const isGridComment = target => {
    return target.nodeType === COMMENT_NODE && target.data.startsWith('#');
  };
  customElements.define('ascii-grid', class extends HTMLElement {
    /** @type {string} */
    get structure() {
      const target = find.call(this.childNodes, isGridComment);
      return target ? target.data.slice(1) : '';
    }

    /**
     * @param {string} data
     */
    set structure(data) {
      let target = find.call(this.childNodes, isGridComment);
      if (!target)
        target = this.appendChild(document.createComment(''));
      target.data = '#' + data;
      asciiGrid(data).applyTo(this);
    }

    connectedCallback() {
      const {structure} = this;
      if (!structure)
        requestAnimationFrame(() => this.connectedCallback());
      else
        this.structure = structure;
    }
  });
}
