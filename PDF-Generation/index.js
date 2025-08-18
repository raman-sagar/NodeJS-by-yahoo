const express = require('express');
const puppeteer = require('puppeteer')
const ejs = require('ejs');
const path = require('path')
const app = express();

app.set('view engine', 'ejs');

app.get('/',async (req, res) => {
    try{
       const browser = await puppeteer.launch();
       const page = await browser.newPage();

       const htmlContent = `
         <!DOCTYPE html>
         <html>
           <head>
             <title>PDF Example</title>
             <style>
               body{ font-family:arial; }
               h1{ color:#0066cc; }
             </style>
           </head>
           <body>
              <h1>PDF File Generation</h1>
              <p>This is a PDF generated form HTML in Express.JS</p>
           </body>
         </html>
       `;

       await page.setContent(htmlContent)
       const pdfBuffer = await page.pdf({
         format: 'A4',
         margin: { top:'20px', right:'20px', bottom: '20px', left: '20px'}
       })

       await browser.close();

       res.contentType("application/pdf");
       res.send(pdfBuffer);
    }catch(error){
      console.log(error)
      res.status(500).send('Error generating PDF');
    }
});

app.get('/invoice',async (req, res) => {
    try{
       const browser = await puppeteer.launch();
       const page = await browser.newPage();

       const invoiceData = {
        invoiceNumber : '1234',
        customer: 'Yahu Baba',
        product: 'ExpressJS course',
        price: '99'
       }

       const htmlContent = await ejs.renderFile(path.join(__dirname, 'views','invoice.ejs'), invoiceData);

       await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' })
       const pdfBuffer = await page.pdf({
         format: 'A4',
         margin: { top:'60px', right:'20px', bottom: '40px', left: '20px'},
         printBackground: true,
         displayHeaderFooter: true,
         headerTemplate: `<div style="text-align: center; 
                            font-size: 30px;width:100%;
                            border-bottom: 1px solid #000;paddin-bottom:10px;">
                            My Company
                            </div>`,
         footerTemplate: `<div style="text-align: center; font-size: 10px;width:100%;">
                            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                          </div>`
       })

       await browser.close();

       res.contentType("application/pdf");
       res.send(pdfBuffer);
    }catch(error){
      console.log(error)
      res.status(500).send('Error generating PDF');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
