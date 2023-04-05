# @webreflection/ascii-grid

Probably the easiest way to define grids layouts.

```js
// /component export also registers ascii-grid as Custom Element
// plus it allows any node to have a grid layout in it too.
import grid from '@webreflection/ascii-grid/component';
// CDN example: https://unpkg.com/@webreflection/ascii-grid/component

const template = document.createElement('template');
template.innerHTML = `
<!-- as custom element -->
<ascii-grid cols="10px 1fr 10px">
  <!--#
    a b c
  -->
  <div>a</div>
  <div>b</div>
  <div>c</div>
</ascii-grid>
<!-- as generic element -->
<div class="ascii-grid" cols="10px 1fr 10px">
  <!--#
    a b c
  -->
  <div>a</div>
  <div>b</div>
  <div>c</div>
</body>
`.trim();

document.body.appendChild(template.content);
```
