const express = require("express");
const {uploadProjectImage, uploadAudioFile} = require("../middlewares/image.middleware")
const router = express.Router();
const {  postImages, deleteNote,deleteImages, deleteAudios, postAudios, postText,updateTitle, updateAudios,updateImages, updateText, deleteText } = require("../controllers/note.controller");
const{getNotes,postNote,deleteUserNotes} = require("../controllers/auth.controllers");
//const {uploadFile} = require("../middlewares/files.middleware")
const passport = require("passport");

router.post("/post-note", postNote);
router.delete("/delete-note/:id", deleteNote);
router.delete("/delete-text/:id", deleteText);
router.delete("/delete-images/:id", deleteImages);
router.delete("/delete-audios/:id", deleteAudios);
router.delete("/delete-all", deleteUserNotes);
router.get("/get-note", getNotes);
router.put("/update-audios/:id",uploadAudioFile.array('audios'), updateAudios);
router.put("/update-images/:id", uploadProjectImage.array('images', 5), updateImages);
router.put("/update-text/:id", updateText);
router.put("/update-title/:id", updateTitle);
router.post("/post-text/:id", postText);
router.post('/uploads/images/:id', uploadProjectImage.array('images', 5), postImages);
router.post('/uploads/audios/:id',uploadAudioFile.array('audios'), postAudios);


module.exports = router;
