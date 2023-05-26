const { Router } = require('express');
const { metricas, visita, login, datosBotones, filtroFecha, resumen_service, estadisticas_service, lista_service } = require('../controllers/home.controller');

const router = Router();

//servicioss
router.post('/', metricas);
router.get('/resumen', datosBotones);
router.get('/', visita);
router.post('/login', login);
router.get('/filtroFecha', filtroFecha);
router.get('/resumen_service', resumen_service);
router.get('/estadisticas_service', estadisticas_service);
router.get('/lista_service', lista_service);

module.exports = router