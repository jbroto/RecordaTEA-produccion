var express = require('express');
var router = express.Router();

const verificarSesion = require('../middlewares/verificarSesion');
const verificarRolCuidador = require('../middlewares/verificarRol');

const CuidadoresController = require('../controladores/cuidadoresControlador');
const cuidadoresControlador = new CuidadoresController();

router.post('/nuevo-usuario', cuidadoresControlador.registro);

router.get('/inicio', verificarSesion, verificarRolCuidador, cuidadoresControlador.inicio);

router.get('/logout', cuidadoresControlador.logout);

router.post('/compartir-usuario', verificarSesion, verificarRolCuidador, cuidadoresControlador.compartirPerfil);

module.exports = router;
