const swig = require("swig");
module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function (req, res) {
        gestorBD.obtenerCanciones({}, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });
    app.get("/api/cancion/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.send(respuesta);
            } else {
                let configuracion = {
                    url: "https://www.freeforexapi.com/api/live?pairs=EURUSD",
                    method: "get",
                    headers: {
                        "token": "ejemplo",
                    }
                }
                let rest = app.get("rest");
                rest(configuracion, function (error, response, body) {
                    console.log("cod: " + response.statusCode + " Cuerpo :" + body);
                    let objetoRespuesta = JSON.parse(body);
                    let cambioUSD = objetoRespuesta.rates.EURUSD.rate;
                    // nuevo campo "usd"
                    canciones[0].usd = cambioUSD * canciones[0].precio;
                    let respuesta = swig.renderFile('views/bcancion.html',
                        {
                            cancion: canciones[0]
                        });
                    res.send(respuesta);
                })

            }
        });
    });
    app.delete("/api/cancion/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        var error = false;
        var autor = "";
        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                {
                    autor: canciones[0].autor
                    console.log(autor);
                }
            }
            if (autor = !res.usuario) {
                error = true;
            }
        });


        if (error == false) {
            gestorBD.eliminarCancion(criterio, function (canciones) {
                if (canciones == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(200);
                    res.send(JSON.stringify(canciones));
                }
            });
        }
    });
    app.post("/api/cancion", function (req, res) {
        var cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
            autor: req.session.usuario
        }

        validaDatosCancion(cancion, function (errors) {
            if (errors !== null && errors.length > 0) {
                res.status(403);
                res.json({errores: errors})
            } else {

                gestorBD.insertarCancion(cancion, function (id) {
                    if (id == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.json({
                            mensaje: "canción insertarda",
                            _id: id
                        })
                    }
                });

            }

        });


        app.put("/api/cancion/:id", function (req, res) {


            let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
            var error = false;


            gestorBD.obtenerCanciones(criterio, function (canciones) {
                if (canciones == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    {
                        autor: canciones[0].autor

                    }
                }
                if (autor = !res.usuario) {
                    error = true;
                }
            });


            if (error == false) {

                let cancion = {}; // Solo los atributos a modificar
                if (req.body.nombre != null)
                    cancion.nombre = req.body.nombre;
                if (req.body.genero != null)
                    cancion.genero = req.body.genero;
                if (req.body.precio != null)
                    cancion.precio = req.body.precio;
                gestorBD.modificarCancion(criterio, cancion, function (result) {
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje: "canción modificada",
                            _id: req.params.id
                        })
                    }
                });
            }
        });
        app.post("/api/autenticar/", function (req, res) {
            let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');

            let criterio = {
                email: req.body.email,
                password: seguro
            }
            console.log("Aaaaa");

            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                if (usuarios == null || usuarios.length == 0) {
                    res.status(401);
                    res.json({
                        autenticado: false
                    })
                } else {
                    var token = app.get('jwt').sign(
                        {usuario: criterio.email, tiempo: Date.now() / 1000},
                        "secreto");
                    res.status(200);
                    res.json({
                        autenticado: true,
                        token: token
                    })
                }

            });
        });


        function validaDatosCancion(cancion, funcionCallback) {
            let errors = new Array();
            if (cancion.nombre === null || typeof cancion.nombre === 'undefined' || cancion.nombre === "")
                errors.push("El nombre de la canción no puede estar vacio")
            if (cancion.genero === null || typeof cancion.genero === 'undefined' || cancion.genero === "")
                errors.push("El género de la canción no puede estar vacio")
            if (cancion.precio === null || typeof cancion.precio === 'undefined' || cancion.precio < 0 || cancion.precio === "")
                errors.push("El precio de la canción no puede ser negativo")
            if (errors.length <= 0)
                funcionCallback(null)
            else
                funcionCallback(errors)

        }
    });


}