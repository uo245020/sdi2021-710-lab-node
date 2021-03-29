// Módulos
let express = require('express');
let app = express();

let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.static('public'));
// Variables
app.set('port', 8081);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig);
require("./routes/rcanciones.js")(app, swig);
require("./routes/rautores.js")(app, swig);
app.get('/usuarios', function(req, res) {
    res.send('ver usuarios');
})
app.get('/canciones', function(req, res) {
    res.send('ver canciones');
})

app.get('/promo*', function (req, res) {
    res.send('Respuesta patrón promo* ');
})

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
})




