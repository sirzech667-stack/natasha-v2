import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { Novel } from '../types';

/**
 * Clean helper to trigger a file download in the mobile browser
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export Novel to formatted PDF document
 */
export function exportNovelToPDF(novel: Novel) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Title Page
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(17, 24, 39); // #111827
  
  const titleLines = doc.splitTextToSize(novel.title, contentWidth);
  doc.text(titleLines, pageWidth / 2, 60, { align: 'center' });

  let currentY = 60 + titleLines.length * 12;

  if (novel.subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(107, 114, 128);
    const subLines = doc.splitTextToSize(novel.subtitle, contentWidth);
    doc.text(subLines, pageWidth / 2, currentY, { align: 'center' });
    currentY += subLines.length * 8 + 10;
  } else {
    currentY += 10;
  }

  // Author Credit
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text(`By ${novel.author}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;

  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175);
  doc.text(`Published via Natasha by Lunarica • Mobile Web Novel Studio`, pageWidth / 2, currentY, { align: 'center' });

  // Synopsis on Title Page
  if (novel.synopsis.longSynopsis || novel.synopsis.shortSynopsis) {
    currentY += 25;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text('SYNOPSIS', margin, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    const synText = novel.synopsis.longSynopsis || novel.synopsis.shortSynopsis;
    const synLines = doc.splitTextToSize(synText, contentWidth);
    doc.text(synLines, margin, currentY);
  }

  // Chapters
  for (let i = 0; i < novel.chapters.length; i++) {
    const chapter = novel.chapters[i];
    doc.addPage();
    currentY = margin + 10;

    // Chapter Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(17, 24, 39);
    doc.text(chapter.title, margin, currentY);
    currentY += 12;

    // Divider Line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Chapter Content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);

    const paragraphs = chapter.content.split('\n\n');
    for (const para of paragraphs) {
      if (!para.trim()) continue;
      const lines = doc.splitTextToSize(para.trim(), contentWidth);
      
      // Check for page overflow
      if (currentY + lines.length * 6 > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }

      doc.text(lines, margin, currentY);
      currentY += lines.length * 6 + 4;
    }
  }

  // Save PDF
  const cleanFilename = novel.title.replace(/[^a-zA-Z0-9_\-]/g, '_') + '.pdf';
  doc.save(cleanFilename);
}

/**
 * Export Novel to valid EPUB E-Book format using JSZip
 */
export async function exportNovelToEPUB(novel: Novel) {
  const zip = new JSZip();

  // 1. mimetype (must be uncompressed according to EPUB spec)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  zip.file(
    'META-INF/container.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  // Chapters HTML list & manifest items
  let manifestItems = '';
  let spineItems = '';
  let tocNcxNav = '';

  novel.chapters.forEach((chapter, index) => {
    const chapFileName = `chapter_${index + 1}.xhtml`;
    manifestItems += `    <item id="chap_${index + 1}" href="${chapFileName}" media-type="application/xhtml+xml"/>\n`;
    spineItems += `    <itemref idref="chap_${index + 1}"/>\n`;

    tocNcxNav += `    <navPoint id="navPoint-${index + 1}" playOrder="${index + 1}">
      <navLabel><text>${escapeXml(chapter.title)}</text></navLabel>
      <content src="${chapFileName}"/>
    </navPoint>\n`;

    const paragraphsHtml = chapter.content
      .split('\n\n')
      .map((p) => `<p>${escapeXml(p.trim())}</p>`)
      .join('\n');

    const chapterXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>${escapeXml(chapter.title)}</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; padding: 1em; color: #111827; }
    h1 { font-size: 1.6em; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; margin-bottom: 1em; }
    p { margin-bottom: 1em; text-indent: 1.5em; }
  </style>
</head>
<body>
  <h1>${escapeXml(chapter.title)}</h1>
  ${paragraphsHtml}
</body>
</html>`;

    zip.file(`OEBPS/${chapFileName}`, chapterXhtml);
  });

  // 3. OEBPS/toc.ncx
  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${novel.id}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${escapeXml(novel.title)}</text></docTitle>
  <docAuthor><text>${escapeXml(novel.author)}</text></docAuthor>
  <navMap>
${tocNcxNav}  </navMap>
</ncx>`;
  zip.file('OEBPS/toc.ncx', tocNcx);

  // 4. OEBPS/content.opf
  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${escapeXml(novel.title)}</dc:title>
    <dc:creator opf:role="aut">${escapeXml(novel.author)}</dc:creator>
    <dc:publisher>Natasha by Lunarica</dc:publisher>
    <dc:language>en</dc:language>
    <dc:identifier id="BookID">urn:uuid:${novel.id}</dc:identifier>
    <dc:description>${escapeXml(novel.synopsis.shortSynopsis || novel.synopsis.longSynopsis || '')}</dc:description>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
${manifestItems}  </manifest>
  <spine toc="ncx">
${spineItems}  </spine>
</package>`;
  zip.file('OEBPS/content.opf', contentOpf);

  // Generate EPUB blob
  const epubBlob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  const cleanFilename = novel.title.replace(/[^a-zA-Z0-9_\-]/g, '_') + '.epub';
  downloadBlob(epubBlob, cleanFilename);
}

/**
 * Export Novel to Plain Text (.txt)
 */
export function exportNovelToTXT(novel: Novel) {
  let content = `${novel.title.toUpperCase()}\n`;
  if (novel.subtitle) content += `${novel.subtitle}\n`;
  content += `By ${novel.author}\n`;
  content += `Created with Natasha by Lunarica - Mobile Web Novel Studio\n`;
  content += `=========================================================\n\n`;

  if (novel.synopsis.longSynopsis || novel.synopsis.shortSynopsis) {
    content += `SYNOPSIS:\n${novel.synopsis.longSynopsis || novel.synopsis.shortSynopsis}\n\n`;
    content += `=========================================================\n\n`;
  }

  novel.chapters.forEach((chapter, index) => {
    content += `CHAPTER ${index + 1}: ${chapter.title.toUpperCase()}\n`;
    content += `---------------------------------------------------------\n`;
    content += `${chapter.content}\n\n\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const cleanFilename = novel.title.replace(/[^a-zA-Z0-9_\-]/g, '_') + '.txt';
  downloadBlob(blob, cleanFilename);
}

/**
 * Export Full Backup (JSON)
 */
export function exportJSONBackup(novels: Novel[], settings: unknown) {
  const backupData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    app: 'Natasha by Lunarica',
    settings,
    novels,
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const filename = `Natasha_Novel_Backup_${new Date().toISOString().split('T')[0]}.json`;
  downloadBlob(blob, filename);
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

