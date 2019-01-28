// Requires
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var serveIndex = require('serve-index');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

//  Inicializar variables
var app = express();

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

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
app.use('/imgs', cors(corsOptions), express.static(__dirname + '/uploads'), serveIndex(__dirname + '/uploads', { 'icons': true }))

// Rutas
app.use("/login", cors(corsOptions), loginRoutes);
app.use("/medico", cors(corsOptions), medicoRoutes);
app.use("/upload", cors(corsOptions), uploadRoutes);
app.use("/usuario", cors(corsOptions), usuarioRoutes);
app.use("/imagenes", cors(corsOptions), imagenesRoutes);
app.use("/busqueda", cors(corsOptions), busquedasRoutes);
app.use("/hospital", cors(corsOptions), hospitalesRoutes);
app.use("/", cors(corsOptions), appRoutes);

// Escuchar peticiones
app.listen(3000, () => console.log("Express server puesto 3000: \x1b[32m%s\x1b[0m", "Online"));