const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const { Document, Packer, Paragraph, TextRun } = require('docx');

async function convertPdfToDoc(pdfPath, docPath) {
  // Read PDF
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  
  // Create a new Word document
  const doc = new Document();

  // Loop through PDF pages and extract text
  for (const page of pages) {
    const text = page.getText();
    const paragraph = new Paragraph();
    const textRun = new TextRun(text);
    paragraph.addRun(textRun);
    doc.addParagraph(paragraph);
  }

  // Save the Word document
  const packer = new Packer();
  const buffer = await packer.toBuffer(doc);
  fs.writeFileSync(docPath, buffer);
}

const inputPdfFile = 'input.pdf'; // Replace with the path to your input PDF file
const outputDocFile = 'output.docx'; // Replace with the desired output DOCX file path

convertPdfToDoc(inputPdfFile, outputDocFile).then(() => {
  console.log('Conversion complete!');
}).catch((error) => {
  console.error('Error occurred:', error);
});