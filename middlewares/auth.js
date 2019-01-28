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
                mensaje: 'Token inválido aaa',
                errors: err
            });
        }

        req.usuario = decode.usuario;

        next();
        // res.status(200).json({
        //     ok: false,
        //     decode
        // });
    });
}

// ============================================
// verificar ADMIN USER
// ============================================

exports.verifyAdminRole = (req, res, next) => {
    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token inválido - no es ADMIN',
            errors: err
        });
    }
}

exports.verifyAdminRoleOrMySelf = (req, res, next) => {
    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || id === usuario._id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token inválido noes tu usuario, ni eres ADMIN',
            errors: err
        });
    }
}