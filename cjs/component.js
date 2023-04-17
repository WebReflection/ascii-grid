'use strict';
const asciiGrid = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('./index.js'));

module.exports = asciiGrid;

if (!customElements.get('ascii-grid')) {
  const {COMMENT_NODE, ELEMENT_NODE} = Node;

  const {find} = Array.prototype;

  const isGridStructure = target => (
    target.nodeType === COMMENT_NODE && target.data.startsWith('#')
  );

  /** @type {WeakMap<Element, MutationObserver>} */
  const wm = new WeakMap;

  /**
   * Observe direct child list changes and invoke the callback
   * once a structure for the grid has been found.
   * @param {Element} node 
   * @param {function} callback 
   */
  const waitForStructure = (node, callback) => {
    const mo = new MutationObserver(() => {
      if (find.call(node.childNodes, isGridStructure)) {
        mo.disconnect();
        wm.delete(node);
        // works with both methods and utilities
        callback.call(node, node);
      }
    });
    mo.observe(node, {childList: true});
    wm.set(node, mo);
  };

  class ASCIIGrid extends HTMLElement {
    /** @type {MutataionObserver} */
    #mo;

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
      const target = find.call(this.childNodes, isGridStructure);
      return target ? target.data.slice(1) : '';
    }

    /** @param {string} data */
    set structure(data) {
      let target = find.call(this.childNodes, isGridStructure);
      if (!target)
        target = this.appendChild(document.createComment(''));
      target.data = '#' + data;
      asciiGrid(data).applyTo(this);
    }

    connectedCallback() {
      const {structure} = this;
      if (structure)
        this.structure = structure;
      else if (!wm.has(this))
        waitForStructure(this, this.connectedCallback);
    }
  }

  customElements.define('ascii-grid', ASCIIGrid);

  const augment = node => {
    const target = find.call(node.childNodes, isGridStructure);
    if (target) {
      asciiGrid(target.data.slice(1)).applyTo(node);
      for (const name of ASCIIGrid.observedAttributes) {
        const value = node.getAttribute(name);
        if (value)
          ASCIIGrid.prototype.attributeChangedCallback.call(node, name, null, value);
      }
    }
    else if (!wm.has(node))
      waitForStructure(node, augment);
  };

  const augmentAll = node => {
    for (const child of node.querySelectorAll('.ascii-grid'))
      augment(child);
  };

  const observe = node => {
    mo.observe(node, {childList: true, subtree: true});
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
