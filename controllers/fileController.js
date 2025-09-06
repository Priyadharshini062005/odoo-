const fs = require('fs');
const path = require('path');

// Create the uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

exports.fileUpload =  (req, res) => {
  if (!req.file) {
    return res.status(400).send({error: 'No file uploaded'});
  }
  res.status(200).send({ message: 'File uploaded successfully', file: req.file });
}

exports.getFile = (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
}

exports.deleteFile = (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
  console.log(filePath);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).send('Error deleting file');
      }
      res.status(200).send({ message: 'File deleted successfully' });
    });
  } else {
    res.status(404).send('File not found');
  }
}
