const Project = require("../dataModels/Project.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");

const postProjects = async (req, res, next) => {

  const {  name, desc } = req.body;
  const id = req.params.id;

const errors=[]
if (!name || !desc ) {
  errors.push("All fields are required!");
}

if (errors.length > 0) {
  res.status(400).json({ error: errors });
} else {
  const newProject = new Project({
                name,
                id,
                desc,
              });
              newProject
                .save()
                .then(() => {
                  res.redirect("/login");
                })
                .catch(() => {
                  errors.push("Please try again");
                  res.status(400).json({ error: errors });
                });
}
};

const getProjectsbyID = async (req, res, next) => {

  const userId = req.user.id
   try {
    const projects = await Project.find({id: userId});
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
};


const updateProject = async (req, res) => {

  const id = req.params.id;

   try {
    const { name, desc } = req.body;

    const project = await Project.findById(id);
    console.log(project)


    // Update the designation if provided
    if (name) {
      project.name = name;
    }


    if (desc) {
      project.desc = desc;
    }

    await project.save();

    res.json({ message: 'Project information updated successfully' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
  
};

const deleteProject = async (req, res) => {
  try {
    const projectinfo = await Project.findByIdAndRemove(req.params.id);

    console.log(projectinfo);

    if (!projectinfo) {
      return res.status(404).json({ error: "Project information not found" });
    }

    res.json({ message: "Project information deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const postProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
const photo = req.file.filename
    
    const projectId = req.params.id
    const project = await Project.findById(projectId);
    console.log(project)


    if (photo) {
      project.project_image = photo
    }
    await project.save();

    res.json({ message: 'Project image updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postMultipleImages = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const newPhotos = req.files.map((file) => file.filename);

    const projectId = req.params.id
    const project = await Project.findById(projectId);
    console.log(project)
   
    if (newPhotos) {
      const existingImages = project.images || [];

    // Combine existing images with new images
      const updatedImages = existingImages.concat(newPhotos);

    // Update the images property of the project
      project.images = updatedImages;
    }
    await project.save();

    res.json({ message: 'Multiple images updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMultipleImages = async (req, res) => {
  try {
    const projectId = req.params.id
    const project = await Project.findById(projectId);
    console.log(project)
    const images= project.images

    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// const postAudioFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file provided' });
//     }
// const audio = req.file.filename
    
//     const projectId = req.params.id
//     const project = await Project.findById(projectId);
//     console.log(project)


//     if (audio) {
//       project.audio = audio
//     }
//     await project.save();

//     res.json({ message: 'Audio updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const postMultipleAudios = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const newAudios = req.files.map((file) => file.filename);

    const projectId = req.params.id
    const project = await Project.findById(projectId);
    console.log(project)
   
    if (newAudios) {
      const existingAudios = project.audios || [];

    // Combine existing images with new images
      const updatedAudios = existingAudios.concat(newAudios);

    // Update the images property of the project
      project.audios = updatedAudios;
    }
    await project.save();

    res.json({ message: 'Multiple audios updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  postProjects,
  getProjectsbyID,
  updateProject,
  deleteProject,
  postProjectImage,
  postMultipleImages,
  getMultipleImages,
  // postAudioFile,
  postMultipleAudios
};