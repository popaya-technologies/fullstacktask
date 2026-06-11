const Note=require('../models/Note')

const createNote=async(req,res)=>{
    try{
        const{title,content}=req.body
        if (!title) return res.status(400).json({ message: "Title is required" });
        const note=await Note.create({title,content});
       res.status(201).json(note);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

const updateNote=async(req,res)=>{
    try{
        const{title,content}=req.body;
        if(!title|| title.trim() === ""){
            return res.status(400).json({ message: "Title is required" });
        }
        const updatedNote=await Note.findByIdAndUpdate(req.params.id,{title,content,updatedAt:Date.now()},{new:true})
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(updatedNote);
    }
    catch(err){
         res.status(500).json({ error: err.message });
    }
}
const deleteNote=async(req,res)=>{
    try{
        const deletedNote=await Note.findByIdAndDelete(req.params.id)
        if(!deletedNote){
           return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    }
    catch(err){
         res.status(500).json({ error: err.message });
    }
}
const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);      
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getNotes = async (req, res) => {
    try {
        const { q } = req.query;
        let query = {};
        if (q) {
            query = {
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { content: { $regex: q, $options: 'i' } }
                ]
            };
        }
   const notes = await Note.find(query).sort({ updatedAt: -1 });      
        const formattedNotes = notes.map(note => ({
            id: note._id,
            title: note.title,
            preview: note.content.length > 100 
                     ? note.content.substring(0, 100) + '...' 
                     : note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        }));      
        res.status(200).json(formattedNotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {createNote,getNotes,getNoteById,updateNote,deleteNote};