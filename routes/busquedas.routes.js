var express = require('express');

var app = express();
var Hospital = require("../models/hospital.model");
var Medico = require("../models/medico.model");
var Usuario = require("../models/usuario.model");

app.get("/coleccion/:tabla", (req, res, next) => {
    var busqueda = req.query.busqueda || "";
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, "i");
    var desde = req.query.desde || 0;
    desde = Number(desde);
    let promesa;
    console.log('Entro');

    switch (tabla) {
        case 'hospital':
            promesa = searchHospitals(regex, 5, desde);
            break;
        case 'medico':
            promesa = searchMedics(regex, 5, desde);
            break;
        case 'usuario':
            promesa = searchUsers(regex, 5, desde);
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
            [tabla]: resultado.data,
            count: resultado.count
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
            hospitales: resultado[0].data,
            medicos: resultado[1].data,
            usuarios: resultado[2].data
        });
    }).catch((err) => {
        res.status(400).json({
            ok: false,
            mensaje: 'Error al crear hospital',
            err
        });
    });

});



function searchHospitals(regex, limit = 0, desde = 0) {
    return new  Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .skip(desde)
            .limit(limit)
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject("Error al cargar hospitales", err);
                } else {
                    Hospital.countDocuments({}, (err, count) => {
                        resolve({ data: hospitales, count });
                    });
                }
            });
    });
}

function searchMedics(regex, limit = 0, desde = 0) {
    return new  Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .skip(desde)
            .limit(limit)
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject("Error al cargar hospitales", err);
                } else {
                    Medico.countDocuments({}, (err, count) => {
                        resolve({ data: medicos, count });
                    });
                }
            });
    });
}

function searchUsers(regex, limit = 0, desde = 0) {
    return new  Promise((resolve, reject) => {
        Usuario.find({}, "nombre email img role google")
            .skip(desde)
            .limit(limit)
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject("Error al cargar hospitales", err);
                } else {
                    Usuario.countDocuments({})
                        .or([{ nombre: regex }, { email: regex }])
                        .exec((err, count) => {
                            resolve({ data: usuarios, count });
                        });
                }
            });
    });
}

module.exports = app