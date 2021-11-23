const mongoose=require('mongoose');
const Schema=mongoose.Schema,
ObjectId = Schema.ObjectId;
const CommentSchema = new mongoose.Schema({
    noticia_id:{type: ObjectId,
        required:true},
    email: { type: String,
        required:true},
    usuario:{ type: String,
        required:true},
    comment:{type: String,
        required:true},
    timesamp:{ type: Date, default: Date.now}
});

module.exports=mongoose.model('Comment', CommentSchema);