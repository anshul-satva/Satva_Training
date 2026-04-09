import fs from "fs";
import path from "path";

const inputPath = path.resolve("docs/FRONTEND_EXPLANATION_GUIDE.md");
const outputPath = path.resolve("docs/FRONTEND_EXPLANATION_GUIDE.pdf");

function wrapLine(line, maxChars) {
  if (line.length <= maxChars) return [line];
  const words = line.split(" ");
  const out = [];
  let current = "";

  for (const word of words) {
    if (!word) continue;
    const probe = current ? `${current} ${word}` : word;
    if (probe.length <= maxChars) {
      current = probe;
      continue;
    }
    if (current) out.push(current);
    if (word.length > maxChars) {
      let start = 0;
      while (start < word.length) {
        out.push(word.slice(start, start + maxChars));
        start += maxChars;
      }
      current = "";
    } else {
      current = word;
    }
  }
  if (current) out.push(current);
  return out.length ? out : [""];
}

function toWrappedLines(text, maxChars = 96) {
  const rawLines = text.replace(/\r\n/g, "\n").split("\n");
  const result = [];
  for (const raw of rawLines) {
    if (raw.trim() === "") {
      result.push("");
      continue;
    }
    const wrapped = wrapLine(raw, maxChars);
    for (const line of wrapped) result.push(line);
  }
  return result;
}

function escapePdfText(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(pagesLines) {
  const objects = [];
  const add = (obj) => {
    objects.push(obj);
    return objects.length;
  };

  const fontId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pagesId = add("<< /Type /Pages /Kids [] /Count 0 >>");
  const pageIds = [];

  for (const lines of pagesLines) {
    const streamBody =
      "BT\n" +
      "/F1 10 Tf\n" +
      "14 TL\n" +
      "40 802 Td\n" +
      lines.map((line) => `(${escapePdfText(line)}) Tj\nT*`).join("") +
      "ET";
    const length = Buffer.byteLength(streamBody, "utf8");
    const contentId = add(
      `<< /Length ${length} >>\nstream\n${streamBody}\nendstream`,
    );
    const pageId = add(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    pageIds.push(pageId);
  }

  objects[pagesId - 1] =
    `<< /Type /Pages /Kids [` +
    pageIds.map((id) => `${id} 0 R`).join(" ") +
    `] /Count ${pageIds.length} >>`;

  const catalogId = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n";
  const offsets = [0];

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i += 1) {
    const off = String(offsets[i]).padStart(10, "0");
    pdf += `${off} 00000 n \n`;
  }

  pdf +=
    `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\n` +
    `startxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

function paginate(lines, linesPerPage = 54) {
  const pages = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }
  return pages;
}

const markdown = fs.readFileSync(inputPath, "utf8");
const lines = toWrappedLines(markdown, 96);
const pages = paginate(lines, 54);
const pdfBuffer = buildPdf(pages);
fs.writeFileSync(outputPath, pdfBuffer);

console.log(`PDF generated: ${outputPath}`);
