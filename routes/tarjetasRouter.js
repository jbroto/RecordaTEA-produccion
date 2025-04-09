var express = require('express');
var router = express.Router();

const verificarSesion = require('../middlewares/verificarSesion');
const verificarRolCuidador = require('../middlewares/verificarRol');
const upload = require('../config/configMulter');

const TarjetasControlador = require('../controladores/tarjetasControlador');
const tarjetasControlador = new TarjetasControlador();

router.get('/', verificarSesion, verificarRolCuidador, tarjetasControlador.obtenerTarjetasUsuarioId);

router.get('/arasaac', verificarSesion, verificarRolCuidador, (req, res) => {
  tarjetasControlador.consultaArasaac(req, res);
});

router.get('/pagina', verificarSesion, verificarRolCuidador, (req, res) => {
  tarjetasControlador.pasarPagina(req, res);
});

router.post('/picto-vocabulario', verificarSesion, verificarRolCuidador, tarjetasControlador.addTarjetaVocabulario);

router.delete('/eliminar-picto', verificarSesion, verificarRolCuidador, tarjetasControlador.eliminarTarjetaVocabulario);

router.post('/eliminar-picto', upload.none(), verificarSesion, verificarRolCuidador, tarjetasControlador.eliminarTarjetaVocabulario);

router.post('/nueva-imagen', upload.single('image'), verificarSesion, verificarRolCuidador, tarjetasControlador.addTarjetaImagen);

router.put('/cambiar-texto-libre', verificarSesion, verificarRolCuidador, tarjetasControlador.textoLibre);

router.put('/cambiar-texto-picto', verificarSesion, verificarRolCuidador, tarjetasControlador.textoPicto);

module.exports = router;