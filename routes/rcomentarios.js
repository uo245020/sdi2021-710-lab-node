module.exports = function(app, swig, gestorBD) {

    app.post('/comentarios/:cancion_id', function (req, res) {
        let comentario= {
            autor : req.session.usuario,
            texto : req.body.comentario,
            cancion_id : req.params.cancion_id
        }
        // Conectarse
        gestorBD.insertarComentario(comentario, function(id){
            if (id == null) {
                res.send("Error al insertar el comentario");
            } else {
                res.send("Agregado comentario con id: "+ id);
                                    }
                                });
        });

};