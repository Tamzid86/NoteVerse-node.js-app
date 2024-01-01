// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");
// const path = require("path");


// const fileStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/files/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
//   }
// });

// const allowedFiles = function(req, file, cb) {
//   if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|mp3|wav)$/)) {
//     req.fileValidationError = 'type not allowed!';
//     return cb(new Error('type not allowed!'), false);
//   }
//   cb(null, true);
// };

// const uploadFile = multer({
//   storage: fileStorage,
//   fileFilter: allowedFiles  
// });

// module.exports = uploadFile;