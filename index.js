const express = require('express');
require('dotenv').config();
require('./database/conexion');
const cors = require("cors");
const session = require('express-session');
const app = express();

//configuracion de la cabezera y los cors
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(session({
    secret: process.env.mySecret,
    resave: true,
    saveUninitialized: true
}));

//midlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(require('./routers/home.router'));

//puerto
app.listen(process.env.PORT || 4000, console.log('Servidor corriendo en el puerto ', process.env.PORT || 4000));