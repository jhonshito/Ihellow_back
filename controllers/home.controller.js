const { IhellowDB, Aperturas, Login }= require("../models/model.ihellow");

//funcion del servicio
const metricas = (req, res) => {

  const { nombre_boton, resumen_service } = req.body;

  //manejo de error
  if(!nombre_boton){
      res.status(400).json({status: 400, mensaje: 'El nombre del boton es requerida'})
  }

  // Obtener la fecha y hora actual
  const fecha = new Date();

  // Obtener el día, mes y año
  const dia = fecha.getDate();
  const mes = fecha.getMonth();
  const year = fecha.getFullYear();

  // Obtener la hora, minutos y segundos
  const horas = fecha.getHours();
  const minutos = fecha.getMinutes();
  const segundos = fecha.getSeconds();

  // Formatear la fecha y hora como texto (opcional)
  const fechaFormateada = dia + '/' + mes + '/' + year;

  const horaFormateada = horas + ':' + minutos + ':' + segundos;

  console.log(nombre_boton);
  console.log(fechaFormateada);

  const datos = new IhellowDB({ nombre_boton: nombre_boton, fecha: fechaFormateada, hora: horaFormateada });
  
  //guardando los datos en la base de datos
  datos.save().then((data) => {
      if(!data){
          res.status(404).json({
              status: 404,
              mensaje: 'ERROR no se pudo guadar los datos'
          })
          return
      }

      res.status(200).json({
          status: 200,
          mensaje: 'Datos guardados exitosamente'
          //data
      })

  })
  .catch((error) => {
      res.status(500).json({
          status: 500,
          mensaje: 'ocurrio un error',
          error
      })
  })
    
};

const datosBotones = (req, res) => {

  IhellowDB.countDocuments({ nombre_boton: {$ne: 'apertura'} }).then((datos) => {
    if(!datos){
      return res.status(404).json({
        status: 404,
        mensaje: 'Nadie ha presionado ningun boton'
      });
    }else {
      return res.status(200).json({
        status: 200,
        mensaje: 'botones presionados',
        botones: datos
      });
    }
  })
  .catch((error) => {
    res.status(500).json({
      status: 500,
      mensaje: 'Ocurrio un error',
      error
    });
  })

}

//aqui hago el filtro por fechas
const filtroFecha = (req, res) => {

  const { fechaInicial, fechaFinal } = req.body

  IhellowDB.countDocuments({nombre_boton: {$ne: 'apertura'},  fecha: {$gte: fechaInicial, $lte: fechaFinal}})
    .then((datos) => {
      if(!datos){
        return res.status(404).json({
          status: 404,
          mensaje: 'No hay datos'
        });
      }else {
        return res.status(200).json({
          status: 200,
          mensaje: 'Filtrado',
          datos
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        mensaje: 'Ocurrio un error',
        error
      })
    })

}

//resumen service
const resumen_service = async(req, res) => {
  const { fechaInicial, fechaFinal } = req.body

  try {
    const clicks = await IhellowDB.countDocuments({
      nombre_boton: { $ne: 'apertura' },
      fecha: { $gte: fechaInicial, $lte: fechaFinal }
    });

    const aperturas = await IhellowDB.countDocuments({
      nombre_boton: 'apertura',
      fecha: { $gte: fechaInicial, $lte: fechaFinal }
    });

    res.status(200).json({
      status: 200,
      mensaje: 'Filtrado',
      clicks,
      aperturas
    });
    
  } catch (error) {
    res.status(500).json({
      status: 500,
      mensaje: 'ocurrio un error',
      error
    });
  }

}

//estadisticas service
const estadisticas_service = (req, res) => {
  const { fechaInicial, fechaFinal } = req.body

  IhellowDB.aggregate([
    {
      $match: {
        fecha: {
          $gte: fechaInicial,
          $lte: fechaFinal
        }
      }
    },
    {
      $group: {
        _id: "$nombre_boton",
        cantidad: { $sum: 1 }
      }
    }
  ])
    .then((datos) => {
      if (!datos || datos.length === 0) {
        return res.status(404).json({
          status: 404,
          mensaje: 'No hay datos',
        });
      } else {
        const estadisticas = {};
        datos.forEach((item) => {
          estadisticas[item._id] = item.cantidad;
        });
        let suma = 0;
        for(let item in estadisticas){
          if(estadisticas.hasOwnProperty(item)){
            suma += estadisticas[item];
          }
        }
        res.status(200).json({
          status: 200,
          mensaje: 'Datos disponibles',
          estadisticas,
          total: suma
        });

      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        mensaje: 'Ocurrió un error',
        error,
      });
    });

}

const lista_service = (req, res) => {
  const { fechaInicial, fechaFinal } = req.body

  IhellowDB.find({fecha: {$gte: fechaInicial, $lte: fechaFinal}})
    .then((datos) => {
      if(!datos){
        return res.status(404).json({
          status: 404,
          mensaje: 'No hay datos'
        });
      }else {
        return res.status(200).json({
          status: 200,
          mensaje: 'datos',
          datos
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        mensaje: 'Ocurrio un error',
        error
      })
    })
}

//funcion de aperturas
const visita = async(req, res) => {

  try {
    const respuesta = await Aperturas.findOne({});

    if (!respuesta) {
      const apertura = new Aperturas({ views: 1 });
      const vista = await apertura.save();

      if (vista.views == 1) {
        return res.status(200).json({
          status: 200,
          mensaje: 'apertura agregada primera vez'
        });
      } else {
        return res.status(404).json({
          status: 404,
          mensaje: 'error al guardar la apertura'
        });
      }
    } else {
       await Aperturas.findByIdAndUpdate(respuesta._id, { views: respuesta.views + 1 });

      const visit = await Aperturas.findById(respuesta._id);

      visit.views + 1;
      visit.save()
        .then((aperturas) => {

          if (!aperturas) {
            res.status(404).json({
              status: 404,
              mensaje: 'error al actualizar la apertura'
            });
          } else {
            res.status(200).json({
              status: 200,
              mensaje: 'nueva apertura',
              aperturas: aperturas
            });
          }
        })

    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      mensaje: 'Ocurrió un error',
      error
    });
  }


}

const login = (req, res) => {

  const { userName, contraseña } = req.body

  if(!userName || !contraseña){
    return res.status(400).json({status: 400, mensaje: 'No puedes enviar campos vacios'})
  }

  const usuario = new Login({ userName: userName, contraseña: contraseña });

  usuario.save()
    .then((user) => {
      if(!user){
        return res.status(404).json({
          status: 404,
          mensaje: 'datos guardados'
        });
      }else {
        return res.status(200).json({
          status: 200,
          mensaje: 'Logueado exitosamente'
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        mensaje: 'Ocurrio un error',
        error
      });
    })

}

module.exports = {
    metricas,
    visita,
    login,
    datosBotones,
    filtroFecha,
    resumen_service,
    estadisticas_service,
    lista_service
}