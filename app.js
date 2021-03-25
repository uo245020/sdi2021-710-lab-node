// Módulos
let express = require('express');
let app = express();


app.use(express.static('public'));
// Variables
app.set('port', 8081);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app); // (app, param1, param2, etc.)
// Variables
app.set('port', 8081);
app.get('/usuarios', function(req, res) {
    res.send('ver usuarios');
})
app.get('/canciones', function(req, res) {
    res.send('ver canciones');
})
// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
})

app.listen(8081, function(){
    console.log("Servidor activo");
});




