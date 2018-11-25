var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

// Rutas
app.get("/:tipo/:img", (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;
    var tiposValidos = ['usuarios', 'hospitales', 'medicos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: true,
            mensaje: 'Tipo de usuario invalido'
        });
    }

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }
});

module.exports = app;