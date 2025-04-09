const TarjetasDao = require('../dao/tarjetasDao');
const axios = require('axios');
const imagenUtils = require('../utils/imagenUtils');

const tarjetasDao = new TarjetasDao();



class TarjetasService {
    constructor() { }

    async obtenerTarjetasUsuarioId(id_usuario) {
        let vocabulario;
        try {
            if (id_usuario !== null) {
                vocabulario = await tarjetasDao.obtenerTarjetasUsuarioId(id_usuario);
                vocabulario.forEach(elem => {
                    if(elem.enlace === null){
                        elem.enlace = imagenUtils.renderImage(elem)
                    }
                });
            }
            else {
                vocabulario = -1;
            }
            return vocabulario;
        }
        catch (error) {
            throw error;
        }
    }

    async consultaArasaac(consulta) {
        try {
            let response = await axios.get(`https://api.arasaac.org/api/pictograms/es/search/${consulta}`);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }

    async pictosArasaac(id_picto) {
        try {
            let response = await axios.get(`https://api.arasaac.org/api/pictograms/${id_picto}?url=true&download=false`);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }

    async addTarjetaVocabulario(id_arasaac, enlace, id_usuario, keyword) {
        try {
            let existe = await tarjetasDao.comprobarExistenciaPicto(id_arasaac, enlace, id_usuario);
            if (existe.length > 0) {
                if (existe[0].activa) {
                    return { success: false, id: 0, id_arasaac: id_arasaac };
                }
                else {
                    let activado = await tarjetasDao.activarPicto(existe[0].id_tarjeta);
                    return { success: true, id: existe.id_Tarjeta, id_arasaac: id_arasaac }
                }
            }
            else {

                let insertado = await tarjetasDao.addTarjetaVocabulario(id_arasaac, enlace, id_usuario, keyword);
                return { success: true, id: insertado, id_arasaac: id_arasaac };

            }
        }
        catch (error) {
            throw error;
        }
    }

    async eliminarTarjetaVocabulario(idTarjeta) {
        try {
            let eliminar = await tarjetasDao.eliminarTarjetaVocabulario(idTarjeta);
            let elim = true;
            if (eliminar > 0) {
                elim = true;
            }
            else {
                elim = false;
            }
            return { success: elim };
        }
        catch (error) {
            throw error;
        }
    }

    async tarjetasEntrada(id_entrada) {
        try {
            let pictos = await tarjetasDao.tarjetasEntrada(id_entrada);
            pictos.forEach(elem => {
                if(elem.enlace === null){
                    elem.enlace = imagenUtils.renderImage(elem)
                }
            });
            return pictos;
        }
        catch (error) {
            throw error;
        }
    }

    async addTarjetaImagen(tarjeta) {
        if (!imagenUtils.comprobarDimensiones(tarjeta)) {
            //Código de error: El archivo no es una imagen
            return { mensaje: -5 };
        }
        else if (!imagenUtils.comprobarTipo(tarjeta)) {
            //Código de error: El archivo no es un tipo de imagen permitido
            return { mensaje: -6 };
        }
        else if (!imagenUtils.comprobarTamaño(tarjeta)) {
            //Código de error: El archivo excede el tamaño máximo permitido
            return { mensaje: -7 };
        }
        else {
            let resultado = await tarjetasDao.addImagen(tarjeta);
            return { mensaje: resultado };
        }
    }

    async imagenesUsuarioId(usuarioId) {
        let resultado = await tarjetasDao.imagenesUsuarioId(usuarioId);
        return resultado;
    }

    async textoLibre(textoLibre, idUsuario){
        let b = (textoLibre === 'true');
        let resultado = await tarjetasDao.textoLibre(b, idUsuario);
        return resultado;
    }

    async textoPicto(picto, idUsuario){
        let b = (picto === 'true');
        let resultado = await tarjetasDao.textoPicto(b, idUsuario);
        return resultado;
    }

    async leerConfiguracionVocabulario(idUsuario){
        let config = tarjetasDao.leerConfiguracionVocabulario(idUsuario);
        return config;
    }
}

module.exports = TarjetasService;