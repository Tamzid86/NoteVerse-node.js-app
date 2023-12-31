const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const allowedType = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else cb(null, false);
};

const projectImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

let uploadProjectImage = multer({ storage: projectImage, fileFilter });

const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/audios");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString(16) + "-" + file.originalname + ".mp3");
  },
});

const uploadAudioFile = multer({
  preservePath: true,
  storage: audioStorage,
});
module.exports = { uploadProjectImage, uploadAudioFile };
