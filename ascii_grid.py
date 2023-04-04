from re import match, split, sub

class Grid:
  def __init__(self, ids, layout):
    self.ids = ids
    self.layout = layout

  def apply_to(self, element):
    i = 0
    known = {}
    children = element.children
    style = element.style
    style.display = "grid";
    style["grid-template-areas"] = self.layout
    for identifier in self.ids:
      if (identifier in known) == False:
        known[identifier] = children[i]
        known[identifier].style["grid-area"] = identifier
        i += 1
    return element

  def css_for(self, selector):
    i = 0
    known = []
    output = [selector + "{display:grid;grid-template-areas:" + self.layout + "}"]
    for identifier in self.ids:
      if (identifier in known) == False:
        i += 1
        output.append(selector + ">*:nth-child(" + str(i) + "){grid-area:" + identifier + "}")
        known.append(identifier)
    return "\n".join(output)

def _add_dot(row, c, p):
  if c == p:
    c = ""
    row.append(".")
  return c

def _drop_identifiers(layout):
  index = {"i": 0}
  placeholders = {}
  return sub("\S+", lambda m: _get_identifier(placeholders, index, m), layout)

def _get_identifier(placeholders, index, m):
  identifier = m.group(0)
  if (identifier in placeholders) == False:
    c = "\n"
    while match("[\r\n\t ]", c):
      c = chr(index["i"])
      index["i"] += 1
    placeholders[identifier] = c
  return placeholders[identifier]

def _normalize(layout):
  width = 0
  start = len(layout)
  lines = []
  for line in split("[\r\n]+", _drop_identifiers(layout)):
    endLength = len(line.rstrip())
    if endLength:
      width = max(width, endLength)
      start = min(start, len(line) - len(line.lstrip()))
      lines.append(line)
  return "\n".join(map(lambda line: line[start:].ljust(width - start), lines))

def grid(layout):
  p = "";
  row = [];
  area = [row];
  for c in _normalize(layout):
    match c:
      case " ":
        p = _add_dot(row, c, p)
      case "\t":
        p = _add_dot(row, c, p)
      case "\n":
        row = []
        area.append(row)
      case _:
        p = c
        row.append("g" + str(ord(c)))
  ids = filter(
    lambda id: id != ".",
    [identifier for row in area for identifier in row]
  )
  layout = " ".join(map(lambda row: f'"{" ".join(row)}"', area))
  return Grid(ids, layout)

# example
if __name__ == "__main__":
  print(
    grid("""
      🔢 🔢 🔢 ➗
      7️⃣ 8️⃣ 9️⃣ ✖
      4️⃣ 5️⃣ 6️⃣ ➖
      1️⃣ 2️⃣ 3️⃣ ➕
      0️⃣ ⚪ 🆗 ➕
    """).css_for("#id")
  )
