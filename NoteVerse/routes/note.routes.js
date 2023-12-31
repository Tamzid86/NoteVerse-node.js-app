const express = require("express");
const {uploadProjectImage, uploadAudioFile} = require("../middlewares/image.middleware")
const router = express.Router();
const {  postImages, deleteNote, postAudios, postText, updateAudios,updateImages, updateText } = require("../controllers/note.controller");
const{getNotes,postNote,postNoteWithFiles} = require("../controllers/auth.controllers");
const {uploadMultipleFiles} = require("../middlewares/files.middleware");
const passport = require("passport");

router.post("/post-note", postNote);
router.delete("/delete-note/:id", deleteNote);
router.get("/get-note", getNotes);

router.post("/update-audios/:id",uploadAudioFile.array('audios'), updateAudios);
router.post("/update-images/:id", uploadProjectImage.array('images', 5), updateImages);
router.post("/post-text/:id", postText);
router.post("/update-text/:id", updateText);
router.post('/uploads/images/:id', uploadProjectImage.array('images', 5), postImages);
router.post('/uploads/audios/:id',uploadAudioFile.array('audios'), postAudios);
router.post("/post-all/", uploadMultipleFiles, postNoteWithFiles);
//router.post("/post-notedata/:id", uploadProjectImage.array('images', 5), uploadAudioFile.array('audios'), postNoteData);
//router.get
module.exports = router;
