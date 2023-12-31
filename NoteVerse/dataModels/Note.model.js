const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    user_id: {
        type: String,
      },
    title:{
        type: String,
        required: true,
      },
    text: {
        type:String,
        default:''
    },
    images: {
      type: [String],
      default: [],
    },
      audio: {
        type: [String],
        default:[],
      },
})

const Note  = mongoose.model("Note", NoteSchema);
module.exports = Note;