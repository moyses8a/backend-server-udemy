var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var { Schema } = mongoose;

var roleasValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es necesario"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false,
        default: "USER_ROLE",
        enum: roleasValidos
    }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('usuario', usuarioSchema);