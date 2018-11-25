var express = require('express');

var app = express();

const fileUpload = require('express-fileupload');
const fs = require('fs');


// Models
var Hospital = require("../models/hospital.model");
var Medico = require("../models/medico.model");
var Usuario = require("../models/usuario.model");

// default options
// app.use(fileUpload());

// Rutas
app.put("/:tipo/:id", (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colecciòn
    var tiposCollecion = ['hospitales', 'medicos', 'usuarios'];

    if (tiposCollecion.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colleccion no es valida',
            errors: { message: "Tipo de colleccion no es valida" }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono una imagen',
            errors: { message: "Debe seleccionar una imagen" }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var splitArchivo = archivo.name.split('.');
    var extArchivo = splitArchivo[splitArchivo.length - 1]

    // Extenciones validas
    extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extArchivo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: "Las extensiones validas son: " + extensionesValidas.join(', ') }
        });
    }

    //Nombre del archivo
    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extArchivo}`;

    // Mover el archivo
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: { message: err }
            });
        }
        uploadByType(tipo, id, nombreArchivo, res);
    })

});

function uploadByType(tipo, id, nombreArchivo, res) {
    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {

                if (!usuario) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Usuario no existe'
                    });
                }

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'error al buscar usuario',
                        errors: err
                    });
                }
                var oldPath = `./uploads/${tipo}/${usuario.img}`;
                console.log("OldPath:  \x1b[32m%s\x1b[0m", oldPath);

                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath, (err) => {
                        console.log("Error al borrar archivo \x1b[32m%s\x1b[0m", err);
                    });
                }

                usuario.img = nombreArchivo;
                usuario.save((err, usuarioActualizado) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Archivo movido',
                        usuario: usuarioActualizado
                    });
                });
            })
            break;
        case 'medicos':
            Medico.findById(id, (err, medico) => {
                if (!medico) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Medico no existe'
                    });
                }

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al buscar medico',
                        errors: err
                    });
                }
                var oldPath = `./uploads/${tipo}/${medico.img}`;
                console.log("OldPath:  \x1b[32m%s\x1b[0m", oldPath);

                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath, (err) => {
                        console.log("Error al borrar archivo \x1b[32m%s\x1b[0m", err);
                    });
                }

                medico.img = nombreArchivo;
                medico.save((err, medicoActualizado) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Archivo movido',
                        medico: medicoActualizado
                    });
                });
            })
            break;
        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {
                if (!hospital) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Hospital no existe'
                    });
                }

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'error al buscar hospital',
                        errors: err
                    });
                }
                var oldPath = `./uploads/${tipo}/${hospital.img}`;
                console.log("OldPath:  \x1b[32m%s\x1b[0m", oldPath);

                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath, (err) => {
                        console.log("Error al borrar archivo \x1b[32m%s\x1b[0m", err);
                    });
                }

                hospital.img = nombreArchivo;
                hospital.save((err, hospitalActualizado) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Archivo movido',
                        hospital: hospitalActualizado
                    });
                });
            })
            break;
        default:
            break;
    }
}

module.exports = app;