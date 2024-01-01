const Note  = require("../dataModels/Note.model");


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

  const deleteText = async (req, res) => {
    try {
      const note = await Note.findByIdAndUpdate(
        req.params.id,
        { text: "" }, 
        { new: true } 
      );
  
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      res.json({ message: "Text deleted successfully", note });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteImages = async (req, res) => {
    try {
      const note = await Note.findByIdAndUpdate(
        req.params.id,
        { images: [] }, // Set the images field to an empty array
        { new: true } // This option returns the updated document
      );
  
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      res.json({ message: "Images deleted successfully", note });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteAudios = async (req, res) => {
    try {
      const note = await Note.findByIdAndUpdate(
        req.params.id,
        { audio: [] }, 
        { new: true }
      );

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      res.json({ message: "Audios deleted successfully", note });
    }
    catch (error) {
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

const updateTitle = async (req, res) => {
    try {
      const { title } = req.body;
      const noteId = req.params.id;
      const note = await Note.findById(noteId);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found!" });
      }
  
      note.title = title;
  
      await note.save();
      res.json({ message: "Title updated!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

module.exports={
    postImages,
    deleteNote,
    deleteText,
    deleteAudios,
    deleteImages,
    postAudios,
    postText,
    updateAudios,
    updateImages,
    updateText,
    updateTitle
};