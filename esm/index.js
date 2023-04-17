/*! (c) Andrea Giammarchi */

/**
 * Parse a generic string and returns an array of rows where each
 * cell is an entry in the row.
 * @param {string} layout
 * @returns {string[][]}
 */
const getArea = layout => {
  let i = 0, match;
  const ids = /\S+/g;
  const lines = [];
  const placeholders = new Map([['.', '.']]);
  for (const line of layout.split(/[\r\n]+/)) {
    const row = [];
    while (match = ids.exec(line)) {
      const [id] = match;
      if (!placeholders.has(id))
        placeholders.set(id, `g${i++}`);
      row.push(placeholders.get(id));
    }
    if (row.length)
      lines.push(row);
  }
  return lines;
};

/**
 * Given a generic string representing a grid or just a row,
 * returns an utility able to apply the grid to a generic element
 * or to a generic selector as string.
 * @param {string} layout
 */
export default layout => {
  const area = getArea(layout);
  const ids = area.flat().filter(id => id !== '.');
  layout = area.map(row => `"${row.join(' ')}"`).join(' ');
  return {
    /**
     * Enforces the grid layout to the element and its direct children.
     * @param {Element} element
     */
    applyTo(element) {
      let i = 0;
      const map = new Map;
      const {children, style} = element;
      style.display = 'grid';
      style['grid-template-areas'] = layout;
      for (const id of ids) {
        if (!map.has(id)) {
          const child = children[i++];
          child.style['grid-area'] = id;
          map.set(id, child);
        }
      }
      return element;
    },

    /**
     * Returns valid CSS usable to enforce the grid layout to the specified selector.
     * @param {string} selector
     */
    cssFor(selector) {
      let i = 0;
      const set = new Set;
      const output = [`${selector}{display:grid;grid-template-areas:${layout}}`];
      for (const id of ids) {
        if (!set.has(id)) {
          output.push(`${selector}>*:nth-child(${++i}){grid-area:${id}}`);
          set.add(id);
        }
      }
      return output.join('\n');
    }
  };
};
