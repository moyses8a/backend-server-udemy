var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAuth = require('../middlewares/auth');

var app = express();
var Hospital = require("../models/hospital.model");
var Usuario = require("../models/usuario.model");

// ============================================
// Obtener Todos Los Hospitales
// ============================================

app.get("/", (req, res, next) => {

    var offset = req.query.offset || 0;
    offset = Number(offset);

    Hospital.find({})
        .skip(offset)
        .limit(5)
        .populate("usuario", "nombre email")
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales,
                    offset,
                    count: conteo
                });
            });

        });
});

// ============================================
// Actualizar un hospital
// ============================================

app.put('/:id', mdAuth.verifyToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id' + id + 'no existe',
                errors: { message: 'No existe un hospital con este ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = body.usuario;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });
    });
});

// ============================================
// Crear un nuevo hospital
// ============================================

app.post('/', mdAuth.verifyToken, (req, res, next) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });

    hospital.save((errors, hospitalGuardado) => {
        if (errors) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

// ============================================
// Borrar un hospital por el ID
// ============================================

app.delete('/:id', mdAuth.verifyToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id' + id + ' no existe',
                errors: { message: 'No existe un hospital con este ID' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;