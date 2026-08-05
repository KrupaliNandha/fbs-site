import fs from "fs";

function convert(file) {
  let s = fs.readFileSync(file, "utf8");
  const before = s;

  s = s.replace(/<\/button>/g, "</Button>");
  s = s.replace(/<button(\s|>)/g, "<Button$1");
  s = s.replace(/<\/textarea>/g, "</Textarea>");
  s = s.replace(/<textarea(\s|>)/g, "<Textarea$1");
  s = s.replace(/<\/select>/g, "</Select>");
  s = s.replace(/<select(\s|>)/g, "<Select$1");
  s = s.replace(/<input(\s|\/?>)/g, (m, g1) => {
    if (m.startsWith("<Input")) return m;
    return "<Input" + g1;
  });

  // Undo double conversions
  s = s.replace(/<\/ButtonButton>/g, "</Button>");
  s = s.replace(/<ButtonButton/g, "<Button");
  s = s.replace(/<\/TextareaTextarea>/g, "</Textarea>");
  s = s.replace(/<TextareaTextarea/g, "<Textarea");
  s = s.replace(/<\/SelectSelect>/g, "</Select>");
  s = s.replace(/<SelectSelect/g, "<Select");
  s = s.replace(/<InputInput/g, "<Input");

  const found = new Set();
  const importRe = /import\s*\{([^}]+)\}\s*from\s*["']@\/app\/Components\/ui["'];/;
  const m = s.match(importRe);
  if (m) {
    m[1]
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => found.add(x));
  }

  if (/<Button[\s>]/.test(s)) found.add("Button");
  if (/<Input[\s/>]/.test(s)) found.add("Input");
  if (/<Textarea[\s>]/.test(s)) found.add("Textarea");
  if (/<Select[\s>]/.test(s)) found.add("Select");
  if (/<Badge[\s>]/.test(s)) found.add("Badge");
  if (/<Card[\s>]/.test(s) || /CardHeader/.test(s)) {
    found.add("Card");
    if (/CardHeader/.test(s)) found.add("CardHeader");
  }
  if (/StatusBadge/.test(s)) found.add("StatusBadge");
  if (/<Label[\s>]/.test(s)) found.add("Label");

  const order = [
    "Button",
    "Badge",
    "Card",
    "CardHeader",
    "Input",
    "Textarea",
    "Select",
    "Label",
    "StatusBadge",
  ];
  const ordered = order.filter((x) => found.has(x));

  if (ordered.length) {
    const importLine =
      "import {\n  " + ordered.join(",\n  ") + ",\n} from \"@/app/Components/ui\";";
    if (m) {
      s = s.replace(importRe, importLine);
    } else {
      s = s.replace(/(from ["']react["'];\n)/, `$1${importLine}\n`);
    }
  }

  if (s !== before) {
    fs.writeFileSync(file, s);
    console.log("converted", file);
  } else {
    console.log("no change", file);
  }
}

const files = [
  "app/designer/dashboard/page.tsx",
  "app/superadmin/dashboard/page.tsx",
  "app/review/[token]/page.tsx",
];

for (const f of files) convert(f);
