const express= require('express');
const helmet = require("helmet");
const mongoose=require('mongoose');
const session=require('express-session');
const path=require('path');
const usuarios=require('./rutas/rutasUsuarios');
mongoose.connect('mongodb+srv://danielrom:abcdanielrom@cluster0.cge9s.mongodb.net/proyectoUTSJR?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
.then(()=>{
    console.log("Conectado a MongoDB");

})
.catch((err)=>{
console.log("Error al conectarse a MongoDB "+err);
});
mongoose.set('useFindAndModify', false);


const app=express();
app.use(helmet());
app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));
app.set('view engine','ejs');
app.use(session({
    secret:"lo que sea",
    resave:true,
    saveUninitialized:true
})); 
//console.log(__dirname+"webPages");
app.use('/Inicio',express.static(path.join(__dirname,'/webPages')));
app.use(express.urlencoded({extended:true}));
app.use('/', usuarios);

 const port=process.env.PORT || 3000;
 app.listen(3000,()=>{
  console.log(`Servidor en el puerto ${port}`) 
})


