var express = require('express');
const EntradasControlador = require('../controladores/entradasControlador');

const verificarSesion = require('../middlewares/verificarSesion');
const verificarRolCuidador = require('../middlewares/verificarRol');
const verificarRolUsuario = require('../middlewares/verificarUsuario');

const entradasControlador = new EntradasControlador();
var router = express.Router();

// Este es para la persona con TEA
router.get('/', verificarSesion, verificarRolUsuario, entradasControlador.redirectToDiary);

router.get("/add-entrada", verificarSesion, verificarRolUsuario, entradasControlador.addEntry);

router.post('/submit-entry', verificarSesion, verificarRolUsuario, entradasControlador.submitEntrada);

router.post('/submit-edit-entry', verificarSesion, verificarRolUsuario, entradasControlador.submitEditEntry);

router.get('/view-entry/:idEntrada', verificarSesion, verificarRolUsuario, entradasControlador.viewEntry);

router.get('/delete-entry/:idEntrada', verificarSesion, verificarRolUsuario, entradasControlador.eliminarEntrada);

router.get('/edit-entry/:idEntrada', verificarSesion, verificarRolUsuario, entradasControlador.editEntryView);

// Este para la persona cuidadora
router.get('/dia/:dia', verificarSesion, verificarRolCuidador, entradasControlador.cargarDia);

router.get('/actualizar-diario', verificarSesion, verificarRolCuidador, entradasControlador.actualizarDiario);

router.get('/:id', verificarSesion, verificarRolCuidador, entradasControlador.cargarDiario);





module.exports = router;