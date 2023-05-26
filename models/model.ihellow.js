const mongoose = require('mongoose');

const { Schema } = mongoose;

//squema de la base de datos
const schemaIhellow = new Schema({
    nombre_boton: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    hora: {
        type: String,
        required: true
    }
});

const aperturaSchema = new Schema({
    views: {
        type: Number,
        required: true,
        default: 0
    }
});

const loginSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    contraseña: {
        type: String,
        required: true
    }
});

const IhellowDB = mongoose.model('dataBotones', schemaIhellow);
const Aperturas = mongoose.model('aperturas', aperturaSchema);
const Login = mongoose.model('usuarios', loginSchema);

module.exports = {
    IhellowDB,
    Aperturas,
    Login
}