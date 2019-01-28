var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var menuSchema = new Schema({
    userType: {
        type: String,
        required: true
    },
    menu: [{
        titulo: {
            type: String,
            required: false
        },
        icono: {
            type: String,
            required: false
        },
        submenu: [{
            titulo: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            }
        }]
    }]
});

module.exports = mongoose.model('menu', menuSchema);