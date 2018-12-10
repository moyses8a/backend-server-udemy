var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var admin = require('firebase-admin');
var app = express();
var Usuario = require("../models/usuario.model");
// Google
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const CLIENT_SECRET = require('../config/config').CLIENT_SECRET;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID, CLIENT_SECRET);

// ==================================================
// Autenticación de google
// ==================================================

async function verify(token, CLIENT_ID) {

    const ticket = await client.verifyIdToken({
        'idToken': token,
        'audience': CLIENT_ID
    });


    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

app.post("/google", async(req, res) =>  {
    if (!req.body.token) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Bad request, falta token',
        });
    }

    let token = req.body.token;

    verify(token, GOOGLE_CLIENT_ID).catch(console.error);
    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar la autenticación normal'
                });
            } else {
                var token = jwt.sign({ usuarioDB }, SEED, { expiresIn: 14000 })

                res.status(200).json({
                    ok: true,
                    usuarioDB,
                    token,
                    id: usuarioDB.id
                });
            }
        } else {
            // El usuario no existe, hay que crearlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar usuario',
                        errors: err
                    });
                }

                var token = jwt.sign({ usuarioDB }, SEED, { expiresIn: 14000 })

                res.status(200).json({
                    ok: true,
                    usuarioDB,
                    token,
                    id: usuarioDB.id
                });

            });
        }
    });
});

// ==================================================
// Autenticación nomal
// ==================================================

app.post("/", (req, res) => {
    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }


        if (usuario.google) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El usuario debe ser autenticado por Google'
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }
        usuario.password = ':)';
        var token = jwt.sign({ usuario }, SEED, { expiresIn: 14000 })

        res.status(200).json({
            ok: true,
            usuario,
            token,
            id: usuario.id
        });
    });
});

module.exports = app;