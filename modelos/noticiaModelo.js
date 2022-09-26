const mongoose=require('mongoose');
const helmet = require("helmet");
const noticiaSchema=new mongoose.Schema({
    titulo:{
    type:String,
    required:true
    },
    fecha:{
        type:String,
        required:true
    },
    cuerpo:{
        type:String,
        requiered:true
    },
    editor:{
        type:String,
        required:true
    },
    estado:{
        type: Boolean,
        default: true
    },

});
module.exports=mongoose.model('noticia', noticiaSchema); 