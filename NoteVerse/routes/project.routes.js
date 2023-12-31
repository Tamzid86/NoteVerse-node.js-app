const express = require("express");
const {uploadProjectImage, uploadAudioFile} = require("../middlewares/image.middleware")
const router = express.Router();
const {
    postProjects, getProjectsbyID, updateProject, deleteProject, postProjectImage, postMultipleImages, getMultipleImages, postMultipleAudios
    } = require("../controllers/project.controller");

router.post("/post-project/:id", postProjects);
// router.get("/get-projects/:id", getProjectsbyID);
router.get("/get-projects", getProjectsbyID);
router.patch("/update-project/:id", updateProject);
router.delete("/delete-project/:id", deleteProject);


router.post('/upload/single_image/:id', uploadProjectImage.single('image'), postProjectImage);
router.post('/upload/multiple_image/:id', uploadProjectImage.array('images', 5), postMultipleImages);
router.get('/multiple_image/:id', getMultipleImages)
// router.post('/upload/audio/:id', uploadAudioFile.single('audio'), postAudioFile);
router.post('/upload/audios/:id', uploadAudioFile.array('audios'), postMultipleAudios);

module.exports = router;