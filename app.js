// Requires
var express = require('express');
var mongoose = require('mongoose');
var serveIndex = require('serve-index');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

//  Inicializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// default options
app.use(fileUpload());

var appRoutes = require("./routes/app.routes");
var loginRoutes = require("./routes/login.routes");
var uploadRoutes = require("./routes/upload.routes");
var medicoRoutes = require("./routes/medico.routes");
var usuarioRoutes = require("./routes/usuario.routes");
var imagenesRoutes = require("./routes/imagenes.routes");
var busquedasRoutes = require("./routes/busquedas.routes");
var hospitalesRoutes = require("./routes/hospital.routes");

// Conexión a la base de datos
mongoose.set('useCreateIndex', true)
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("Base de datos: \x1b[32m%s\x1b[0m", "Online")
});

// Serve URLs like /ftp/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
app.use('/imgs', express.static(__dirname + '/uploads'), serveIndex(__dirname + '/uploads', { 'icons': true }))

// Rutas
app.use("/login", loginRoutes);
app.use("/medico", medicoRoutes);
app.use("/upload", uploadRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/imagenes", imagenesRoutes);
app.use("/busqueda", busquedasRoutes);
app.use("/hospital", hospitalesRoutes);
app.use("/", appRoutes);

// Escuchar peticiones
app.listen(3000, () => console.log("Express server puesto 3000: \x1b[32m%s\x1b[0m", "Online"));