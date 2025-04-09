var express = require('express');
var router = express.Router();

const verificarSesion = require('../middlewares/verificarSesion');
const verificarRolCuidador = require('../middlewares/verificarRol');
const verificarRolUsuario = require('../middlewares/verificarUsuario');
const upload = require('../config/configMulter');

const UsuariosController = require('../controladores/usuariosControlador')
const controllerUsuarios = new UsuariosController();


router.get('/', verificarSesion, verificarRolUsuario, controllerUsuarios.leerUsuarioId);

router.post('/login', controllerUsuarios.login);

router.post('/nuevo-usuario',  upload.single('image'), controllerUsuarios.registro);

router.get('/logout', controllerUsuarios.logout);

module.exports = router;
