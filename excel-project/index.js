const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

const upload = multer({ dest: 'uploads/' });


app.get('/', (req, res) => {
  res.render('excel');
});

app.post('/upload-excel', upload.single('excelFile'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);

  res.json({
    message: 'Excel file uploaded successfully',
    data
  })
})

// Export Excel File
app.get('/export-excel', (req, res) => {
  const data = [
    { Name: "John", Age: 30, City: "New York" },
    { Name: "Jane", Age: 25, City: "London" },
    { Name: "Bob", Age: 40, City: "Paris" }
  ]

  const worksheet= XLSX.utils.json_to_sheet(data);
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
  res.send(excelBuffer)
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
