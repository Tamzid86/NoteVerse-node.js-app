const Note  = require("../dataModels/Note.model");


//  const postNote = async (req, res) => {
//     const { title} = req.body;
//     //const user_id = req.user._id
//     const user_id = req.user._id
//     const errors = [];
//     if (!title) {
//         errors.push("Title is required!");
//     }

//     if (errors.length > 0) {
//         res.status(400).json({ error: errors });
//     } else {
//         const newNote = new Note({
//             user_id,
//             title,   
//         });
//         console.log(newNote);
//         newNote
//             .save()
//             .then(() => {
//                 res.status(201).json({ message: "Note created!" });
//             })
//             .catch(() => {
//                 errors.push("Please try again");
//                 res.status(400).json({ error: errors });
//             });
//     }
// };
 


const deleteNote = async (req, res) => {
    try {
      const noteinfo = await Note.findByIdAndRemove(req.params.id);
  
      console.log(noteinfo);
  
      if (!noteinfo) {
        return res.status(404).json({ error: "Note information not found" });
      }
  
      res.json({ message: "Note information deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

const postImages = async (req, res) => {
    try {
      if (!req.files) {
        return res.status(400).json({ message: 'No file provided' });
      }
  
      const newPhotos = req.files.map((file) => file.filename);
  
      const noteId = req.params.id
      const note = await Note.findById(noteId);
      console.log(note)
     
      if (newPhotos) {
        const existingImages = note.images || [];
        const updatedImages = existingImages.concat(newPhotos);
        note.images = updatedImages;
      }
      await note.save();
  
      res.json({ message: 'Images updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const postText = async (req, res) => {
    try {
      const { text } = req.body;
      const noteId = req.params.id;
      const note = await Note.findById(noteId);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found!" });
      }
  
      if (text) {
        note.text = note.text ? note.text + ' ' + text : text;
      }
  
      await note.save();
      res.json({ message: "Text updated!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

const postAudios = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.json({ message: "No audio files provided!" });
      }
  
      const allAudios = req.files.map((file) => file.filename);
      const noteId = req.params.id;
      const note = await Note.findById(noteId);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found!" });
      }
  
      if (note.audio && note.audio.length > 0) {
        note.audio = note.audio.concat(allAudios);
      } else {
        note.audio = allAudios;
      }
  
      await note.save();
      return res.json({ message: "All audio files are saved." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const updateAudios = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.json({ message: "No audio files provided!" });
      }
  
      const allAudios = req.files.map((file) => file.filename);
      const noteId = req.params.id;
      const note = await Note.findById(noteId);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found!" });
      }
  
      note.audio = allAudios;
  
      await note.save();
      return res.json({ message: "All audio files are saved." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
// now i want to implement a similar type of functions for images which name will be updateImages where my previous images will be removed and new ones will be added just like the updateAudios function.

  const updateImages = async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.json({ message: "No images provided!" });
      }
  
      const allImages = req.files.map((file) => file.filename);
      const noteId = req.params.id;
      const note = await Note.findById(noteId);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found!" });
      }
  
      note.images = allImages;
  
      await note.save();
      return res.json({ message: "All images are saved." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

//now i want to update the text of the note which will be done by the updateText function where the previous text will be removed and new text will be added.

const updateText = async (req, res) => {
    try {
      const { text } = req.body;
      const noteId = req.params.id;
      const note = await Note.findById(noteId);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found!" });
      }
  
      note.text = text;
  
      await note.save();
      res.json({ message: "Text updated!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports={
    //postNote,
    //getNotes,
    postImages,
    deleteNote,
    postAudios,
    postText,
    updateAudios,
    updateImages,
    updateText
};