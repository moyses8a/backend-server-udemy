var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAuth = require('../middlewares/auth');

var app = express();
var Medico = require("../models/medico.model");
var Usuario = require("../models/usuario.model");

// ============================================
// Obtener Todos Los Medicos
// ============================================

app.get("/", (req, res, next) => {

    var offset = req.query.offset || 0;
    offset = Number(offset);

    Medico.find({})
        .skip(offset)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }
            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos,
                    offset,
                    count: conteo
                });
            });


        });
});

// ============================================
// Actualizar un medico
// ============================================

app.put('/:id', mdAuth.verifyToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id' + id + 'no existe',
                errors: { message: 'No existe un medico con este ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = body.usuario;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });
    });
});

// ============================================
// Crear un nuevo medico
// ============================================

app.post('/', mdAuth.verifyToken, (req, res, next) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((errors, medicoGuardado) => {
        if (errors) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

// ============================================
// Borrar un medico por el ID
// ============================================

app.delete('/:id', mdAuth.verifyToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id' + id + ' no existe',
                errors: { message: 'No existe un medico con este ID' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;