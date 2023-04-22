// Require the necessary modules
const mongoose = require('mongoose');

// Create a schema for the uploaded files
const fileSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  image:{
    data:Buffer,
    contentType:String
  },
  profilePictureURL: {
        type: String
    }
});

// Create a model for the uploaded files
const File = mongoose.model('File', fileSchema);

// Export the File model
module.exports = File;
