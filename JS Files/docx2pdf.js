const fs = require('fs');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const { PDFDocument, rgb } = require('pdf-lib');

async function convertDocxToPdf(docxPath, pdfPath) {
  // Read DOCX
  const docxBuffer = fs.readFileSync(docxPath);
  const doc = new Document();
  await doc.load(docxBuffer);

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  // Loop through paragraphs in the DOCX and add them to the PDF
  doc.sections.forEach((section) => {
    section.children.forEach((child) => {
      if (child instanceof Paragraph) {
        const text = child.children.map((run) => run.text).join('');
        const pdfText = page.drawText(text, {
          x: 50,
          y: page.getHeight() - 50 - child.size,
          size: child.size,
          color: rgb(0, 0, 0), // Text color (black)
        });
      }
    });
  });

  // Save the PDF document
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);
}

const inputDocxFile = 'input.docx'; // Replace with the path to your input DOCX file
const outputPdfFile = 'output.pdf'; // Replace with the desired output PDF file path

convertDocxToPdf(inputDocxFile, outputPdfFile).then(() => {
  console.log('Conversion complete!');
}).catch((error) => {
  console.error('Error occurred:', error);
});