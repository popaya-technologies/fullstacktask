const mongoose=require('mongoose');

const noteSchema=new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    pinned: { type: Boolean, default: false }, 
    tags: { type: String },
    createdAt:{type:Date,default:Date.now()},
    updatedAt:{type:Date,default:Date.now()}
})
const Note=mongoose.model("Note",noteSchema);
module.exports=Note