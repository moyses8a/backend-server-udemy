var express = require('express');

var app = express();
var Hospital = require("../models/hospital.model");
var Medico = require("../models/medico.model");
var Usuario = require("../models/usuario.model");

app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, "i");
    let promesa;
    switch (tabla) {
        case 'hospital':
            promesa = searchHospitals(regex);
            break;
        case 'medico':
            promesa = searchMedics(regex);
            break;
        case 'usuario':
            promesa = searchUsers(regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Ruta invalida'
            });
            break;
    }

    promesa.then((resultado) => {
        res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente',
            [tabla]: resultado
        });
    });
});

// Rutas
app.get("/todo/:busqueda", (req, res, next) => {
    var busqueda = req.params.busqueda;
    console.log(busqueda);
    var regex = new RegExp(busqueda, "i");

    Promise.all([
        searchHospitals(regex),
        searchMedics(regex),
        searchUsers(regex)
    ]).then(resultado => {
        res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente',
            hospitales: resultado[0],
            medicos: resultado[1],
            usuarios: resultado[2]
        });
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            mensaje: 'Error al crear hospital',
            err
        });
    });

});



function searchHospitals(regex) {
    return new  Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject("Error al cargar hospitales", err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function searchMedics(regex) {
    return new  Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject("Error al cargar hospitales", err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function searchUsers(regex) {
    return new  Promise((resolve, reject) => {
        Usuario.find({}, "nombre email role")
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject("Error al cargar hospitales", err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app