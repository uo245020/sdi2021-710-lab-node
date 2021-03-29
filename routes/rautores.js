module.exports = function(app,swig) {
    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {});
        res.send(respuesta);
    })
    app.post('/autores/agregar', function(req,res){
        let nombre="";
        let grupo;
        let rol;
        if (req.body.nombre==undefined)
            nombre="Parametro nombre no enviado en la peticion";
        else
            nombre=req.body.nombre;
        if (req.body.grupo==undefined)
            grupo="Parametro grupo no enviado en la peticion";
        else
            grupo=req.body.grupo;

        if (req.body.rol==undefined)
            rol="Parametro rol no enviado en la peticion";
        else
            rol=req.body.rol;

        res.send("Autor agregado: "+

            nombre
            +"<br>" + "Grupo: "
            + grupo  +"<br>" + "Rol: "
            + rol
        );
    })

    app.get("/autores", function(req, res) {
        var autores = [ {
            "nombre" : "Javier Gonzalez",
            "grupo" :  "Troncada Master",
            "rol" : "Guitarrista"
        }, {
            "nombre" : "Ivan Zamorano",
            "grupo" :  "Real Facts",
            "rol" : "Bateria"
        }, {
            "nombre" : "Martin ",
            "grupo" :  "Aguera Real",
            "rol" : "Guitarrista"
        } ];
        var respuesta = swig.renderFile('views/autores.html', {
            autores : autores
        });
        res.send(respuesta);
    })
};