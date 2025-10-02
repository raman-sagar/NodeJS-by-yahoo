const express = require('express');
const cron = require('node-cron');
const fs = require("fs")
const path = require("path")
const app = express();

const sourceDir = path.join(__dirname, "data")
const backupDir = path.join(__dirname, "backups")

app.get('/', (req, res) => {
    res.send('Hello World!');
});

cron.schedule('* * * * *',async () => {
  try{
    const timestamp = new Date().toISOString().replace(/[:.]/g,"-")
    const destination = path.join(backupDir, `backup-${timestamp}`)

    await fs.cp(sourceDir,destination, { recursive: true }, (err)=>{
      if(err){
        console.log("Backup Failed :", err)
      }else{
        console.log(`Backup created at ${destination}`)
      }
    })
  }catch(err){
    console.error("Backup failed :", err)
  }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
