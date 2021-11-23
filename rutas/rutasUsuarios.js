const { render } = require('ejs');
const {Router}=require('express');

const Usuario=require('../modelos/usuarioModelo');
const Noticia=require('../modelos/noticiaModelo');
const Comment=require('../modelos/commentsModelo');
const ruta=Router();

ruta.get('/',(req,res)=>{
    res.redirect('/noticias');
});

//Login
ruta.get('/Login',(req,res)=>{
    res.render('login');
});
//Registrar 
ruta.get('/Registrar',(req,res)=>{
    res.render('registroUsuario');
});
//Registrar 
ruta.get('/RegistrarAd',(req,res)=>{
    res.render('registroUsuarioAdmin');
});

//Guardar Noticia
ruta.get('/insertarNoticia', (req, res)=>{
    res.render('insertarNoticia')
});
 //Guardar Noticia
 ruta.post('/insertarNoticia',(req, res)=>{
     var noticia= new Noticia({
         titulo: req.body.titulo,
         fecha: req.body.fecha,
         cuerpo: req.body.cuerpo,
         editor: req.body.editor
     });
     noticia.save()
     .then(()=>{
         res.redirect('/noticiasAdmin');
     })
     .catch((err)=>{
        res.json("Error al insertar");   
     });
 });
 //ver noticias Usuario Normal
ruta.get('/noticias',(req, res)=>{
    Noticia.find({"estado": true})
    .then((noti)=>{
        res.render('mostrarNoticias', {noticias:noti});
    })
    .catch((err)=>{
        res.status(400).send("Error al recuperar la informacion");
    });
});

//ver noticias Administrador
ruta.get('/noticiasAdmin',(req, res)=>{
    Noticia.find({"estado": true})
    .then((noti)=>{
        res.render('mostrarNoticias_ad', {noticias:noti});
    })
    .catch((err)=>{
        res.status(400).send("Error al recuperar la informacion");
    });
});

 
// Modificar Noticia

ruta.get('/modificarNoticias/:id',(req,res)=>{
    var id=req.params.id;
    Noticia.findById(id)
    .then((noti)=>{
        res.render('modificarNoticias',{noticia:noti});
    })
    .catch((err)=>{
res.status(400).send("Error al buscar la noticia"+err);
    });
});

ruta.post('/modificarNoticias',(req,res)=>{
    var id=req.body.idModificar;
    
    Noticia.findByIdAndUpdate(id,{
        $set:{
            titulo:req.body.tituloModificar,
            fecha:req.body.fechaModificar,
            cuerpo:req.body.cuerpoModificar,
            editor:req.body.editorModificar
        }
    }, {new:true}
    ).then(()=>{
        res.redirect('/noticiasAdmin');
    }).catch((err)=>{
        res.status(400).send("Error al actualizar el registro"+err);
    });
});
// Eliminar Noticia
ruta.get('/eliminarNoticia/:id',(req,res)=>{
    var id=req.params.id;
    Noticia.findByIdAndDelete(id)
    .then(()=>{
        res.redirect('/noticiasAdmin');
    })
    .catch((err)=>{
        res.status(400).send("Error al eliminar noticia");
    });

});
//vermas
ruta.get('/verMasNoticia/:id',(req,res)=>{
    var id=req.params.id;

    Noticia.findById(id)
    .then((noti)=>{
            Comment.find({noticia_id:id})
        .then((com)=>{
            
            res.render('verMasNoticia',{noticia:noti, comment:com}); 
        })
            .catch((err)=>{
                res.status(400).send("Error al buscar la noticia"+err);
                    });
    })
    .catch((err)=>{
res.status(400).send("Error al buscar la noticia"+err);
    });
});
//ver comntarios admin 
ruta.get('/verMasNoticiaAd/:id',(req,res)=>{
    var id=req.params.id;

    Noticia.findById(id)
    .then((noti)=>{
            Comment.find({noticia_id:id})
        .then((com)=>{
            
            res.render('verMasNoticiaAd',{noticia:noti, comment:com}); 
        })
            .catch((err)=>{
                res.status(400).send("Error al buscar la noticia"+err);
                    });
    })
    .catch((err)=>{
res.status(400).send("Error al buscar la noticia"+err);
    });
});



//Insertar Comentario
ruta.post('/insertarComentario',(req,res)=>{
    var id=req.params.id;
    var comment= new  Comment({
        noticia_id:req.body.noticia_id,
        email:req.body.noticia_id,
        usuario:req.body.usuario,
        comment:req.body.comment
    });
    comment.save()
    .then((com)=>{
       res.redirect('/verMasNoticia/'+comment.noticia_id);
        })
        .catch((err)=>{
            res.status(400).send("Error al guardar usuario "+err);
        });

});


//Api Guardar Usuario
ruta.post('/Registrar', (req,res)=>{
    var usuario=new Usuario({
        nombre: req.body.nombre,
        correo: req.body.correo,
        usuario: req.body.usuario,
        password: req.body.password,
        tipo: req.body.tipo
    });
    usuario.save()
    .then(()=>{
    res.redirect('/noticias');
    })
    .catch((err)=>{
    res.json("Error al insertar");
    });
});
//Api Guardar Usuario
ruta.post('/RegistrarAd', (req,res)=>{
    var usuario=new Usuario({
        nombre: req.body.nombre,
        correo: req.body.correo,
        usuario: req.body.usuario,
        password: req.body.password,
        tipo: req.body.tipo
    });
    usuario.save()
    .then(()=>{
    res.redirect('/mostrarUsuarios');
    })
    .catch((err)=>{
    res.json("Error al insertar");
    });
});
//APi Login
ruta.post('/login', (req, res)=>{
    var {usuarioLogin,contraLogin}=req.body;
    Usuario.find({"usuario":usuarioLogin, "password":contraLogin})
    .then((usu)=>{
        if(usu==""){
            res.send("Datos Incorrectos");
            res.session.destroy();
        }
        else{
            console.log(usu[0].tipo);
            if(usu[0].tipo=='usuario'){
                console.log(usu[0].usuario);
                req.session.usuario=usu[0].tipo;
                res.redirect('/noticias');
            }
            if(usu[0].tipo=='admin'){
                console.log(usu[0].usuario);
                req.session.usuarioAdmin=usu[0].tipo;
                res.redirect('/noticiasAdmin');                
            }
            if(usu[0].tipo=='editor'){
                console.log(usu[0].usuario);
                req.session.usuarioEditor=usu[0].tipo;
                res.redirect('/insertarNoticia');                
            }
        }
    })
    .catch(()=>{
        res.status(400).send("Error al consultar tus credenciales");
    });
});
//Api Logout
ruta.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
});
//Mostrar
ruta.get('/mostrarUsuarios',(req,res)=>{
    Usuario.find({"estado" :true})
    .then((usu)=>{
        res.render('mostrarUsuarios', {usuarios:usu});
    })
    .catch((err)=>{
        res.status(400).send("Error al recuperar la información");
    });

});

//Modificar
ruta.get('/modificarUsuario/:id',(req, res)=>{
    var id=req.params.id;
    Usuario.findById(id)
    .then((usu)=>{
        res.render('modificarUsuario',{usuario:usu});
    })
    .catch((err)=>{
res.status(400).send("Error al buscar el usuario"+err);
    });
});
ruta.post('/modificarUsuario',(req, res)=>{
    var id=req.body.idModificar;
  
    Usuario.findByIdAndUpdate(id,{
        $set:{
        
            nombre: req.body.nombreModificar,
            correo: req.body.correoModificar,
            usuario: req.body.usuarioModificar,
            password: req.body.passwordModificar,
            tipo: req.body.tipoModificar
        }
    },
    {new:true}
    ).then(()=>{
        res.redirect('/mostrarUsuarios');
    }).catch((err)=>{
        res.status(400).send("Error al actualizar el registro"+err);
    });
});
//Eliminar
ruta.get('/eliminarUsuario/:id',(req,res)=>{
    var id=req.params.id;
    Usuario.findByIdAndDelete(id)
    .then(()=>{
        res.redirect('/mostrarUsuarios');
    })
    .catch((err)=>{
        res.status(400).send("Error al eliminar el usuario");
    });
});



module.exports=ruta;
