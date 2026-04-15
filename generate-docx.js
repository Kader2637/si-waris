const fs = require('fs');
const htmlToDocx = require('html-to-docx');

const htmlString = fs.readFileSync('Proposal_E-MAWARITS.html', 'utf-8');

(async () => {
  const fileBuffer = await htmlToDocx(htmlString, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
    font: 'Inter'
  });

  fs.writeFileSync('Proposal_E-MAWARITS.docx', fileBuffer);
  console.log('✅ Word document created successfully: Proposal_E-MAWARITS.docx');
})();
