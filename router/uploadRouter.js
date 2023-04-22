// Require the necessary modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
const multer = require('multer');
const ImageModel=require('../model/uploadFile');
// const {GridFsStorage} = require('multer-gridfs-storage');

// Set up the GridFS stream
// Grid.mongo = mongoose.mongo;
// const conn = mongoose.createConnection('mongodb://localhost:27017/MyDb');
// let gfs;
// conn.once('open', () => {
//   gfs = Grid(conn.db);
// });

// Create a storage engine using Multer
const Storage = multer.diskStorage({
  destination:"uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: Storage }).single('testImage');

// Create an upload object using Multer and our GridFS storage engine
// const upload = multer({ storage });

// to check whether working or not
 router.get('/',(req,res)=>{
    res.send([{Title:'Welcome'}]);
    console.log("Welcome");
 });

 router.post('/upload',(req,res)=>{
  const url = req.protocol + '://' + req.get("host");
  
  upload(req,res,(err)=>{
    {
   
    if(err){
      console.log(err);
    }
    else{
      const newImage=new ImageModel({
           name:req.body.name,
           image:{
            data:req.file.filename,
            contentType:'image/png'
           },
           image: url + '/uploads' + req.file.filename
      })
      newImage.save()
      .then(()=>res.send("successfully upload")).catch(err=>console.log(err));
    }

  }
  })
 });

// // Require the File model
// const File = require('../model/uploadFile');

// // Create a route for handling file uploads
// router.post('/upload', upload.single('file'), (req, res, next) => {
//   if (!req.file) {
//     res.status(400).json({ message: 'No file uploaded' });
//     return;
//   }

//   // Create a new File document and save it to the database
//   const newFile = new File({
//     filename: req.file.filename,
//     contentType: req.file.contentType,
//     length: req.file.size,
//     uploadDate: new Date()
//   });
//   newFile.save((err, file) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Error saving file' });
//       return;
//     }
//     res.status(200).json(file);
//   });
// });

// Export the router
module.exports = router;
