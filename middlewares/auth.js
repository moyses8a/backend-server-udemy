var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ============================================
// verificar token
// ============================================

exports.verifyToken = (req, res, next) => {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token inválido',
                errors: err
            });
        }

        req.usuario = decode.usuario;

        res.status(200).json({
            ok: false,
            decode
        });
    });
}