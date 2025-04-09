var express = require('express');
var router = express.Router();

const verificarSesion = require('../middlewares/verificarSesion');
const verificarRolCuidador = require('../middlewares/verificarRol');
const verificarRolUsuario = require('../middlewares/verificarUsuario');

const RutinasController = require('../controladores/rutinasControlador');
const rutinasControlador = new RutinasController();

router.get('/', verificarSesion, verificarRolCuidador, rutinasControlador.getCuidadoresRutinas);

router.get('/addRutina', verificarSesion, verificarRolCuidador, rutinasControlador.addRutina);

router.post('/submit', verificarSesion, verificarRolCuidador, rutinasControlador.submitRutina);

router.get('/mis-rutinas', verificarSesion, verificarRolUsuario, rutinasControlador.getUserRutinas);

router.get("/mis-rutinas/:idRutina", verificarSesion, verificarRolUsuario, rutinasControlador.getTarjetasByIdRutina);

router.get("/:idRutina", verificarSesion, verificarRolCuidador, rutinasControlador.getTarjetasByIdRutinaCuidador);

module.exports = router;
