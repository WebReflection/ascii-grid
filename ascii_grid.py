from re import match, split, findall

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

def _get_area(layout):
  i = 0
  lines = []
  placeholders = {".": "."}
  for line in split("[\r\n]+", layout):
    row = []
    for identifier in findall("\S+", line):
      if (identifier in placeholders) == False:
        placeholders[identifier] = "g" + str(i)
        i += 1
      row.append(placeholders[identifier])
    if len(row):
      lines.append(row)
  return lines

def grid(layout):
  area = _get_area(layout)
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
