// multiUpload.middleware.js

const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = './newUploads/';
const imagesDir = path.join(uploadDir, 'images');
const audiosDir = path.join(uploadDir, 'audios');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

if (!fs.existsSync(audiosDir)) {
  fs.mkdirSync(audiosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadDir;
    if (file.mimetype.startsWith('image/')) {
      uploadPath = imagesDir;
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath = audiosDir;
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // accept image and audio files only
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

exports.uploadMultipleFiles = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'audios', maxCount: 5 },
]);