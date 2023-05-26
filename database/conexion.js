const mongoose = require('mongoose');

//conexion de la base de datos
mongoose.connect(process.env.URI)
    .then(() => console.log('DB conectada'))
    .catch(() => console.log('Fallo la conexión'))