import asciiGrid from './index.js';

export default asciiGrid;

if (!customElements.get('ascii-grid')) {
  const {COMMENT_NODE, ELEMENT_NODE} = Node;

  const {find} = Array.prototype;

  const isGridComment = target => {
    return target.nodeType === COMMENT_NODE && target.data.startsWith('#');
  };

  class ASCIIGrid extends HTMLElement {
    static observedAttributes = ['cols', 'rows'];
    attributeChangedCallback(name, _, value) {
      switch (name) {
        case 'cols':
          this.style['grid-template-columns'] = value;
          break;
        case 'rows':
          this.style['grid-template-rows'] = value;
          break;
      }
    }

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
  }

  customElements.define('ascii-grid', ASCIIGrid);

  const augment = node => {
    const target = find.call(node.childNodes, isGridComment);
    if (target) {
      asciiGrid(target.data.slice(1)).applyTo(node);
      for (const name of ASCIIGrid.observedAttributes) {
        const value = node.getAttribute(name);
        if (value)
          ASCIIGrid.prototype.attributeChangedCallback.call(node, name, null, value);
      }
    }
    else
      console.error('unable to apply ascii-grid to ', node);
  };

  const augmentAll = node => {
    for (const child of node.querySelectorAll('.ascii-grid'))
      augment(child);
  };

  const observe = node => {
    mo.observe(node, {
      childList: true,
      subtree: true
    });
    return node;
  };

  const mo = new MutationObserver(records => {
    for (const {addedNodes} of records) {
      for (const node of addedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          if (node.classList.contains('ascii-grid'))
            augment(node);
          augmentAll(node);
        }
      }
    }
  });

  augmentAll(observe(document));

  const {attachShadow} = Element.prototype;
  Element.prototype.attachShadow = function () {
    return observe(attachShadow.apply(this, arguments));
  };
}
