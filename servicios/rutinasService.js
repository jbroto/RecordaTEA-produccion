const RutinasDao = require('../dao/rutinasDao')
const rutinasDao = new RutinasDao();

const imagenUtils = require('../utils/imagenUtils');

class RutinasService{
    constructor(){}

    async leerRutina(id){
        const rutina = await rutinasDao.leerRutina(id);
        return rutina[0];
    }

    async getRutinasById(idUsuario){
        let response = await rutinasDao.getRutinasById(idUsuario);
        response.forEach(elem =>{
            if(!elem.enlace){
                elem.enlace = imagenUtils.renderImage(elem);
            }
        });
        return response;
    }

    async getTarjetasByIdRutina(idRutina){
        let response = await rutinasDao.getTarjetasByIdRutina(idRutina);
        response[0].forEach(elem =>{
            if(!elem.enlace){
                elem.enlace = imagenUtils.renderImage(elem);
            }
        });
        return response[0];
    }

    async crearRutina(data){
        data.fecha_creacion = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const response = await rutinasDao.crearRutina(data);
        return response;
    }
}

module.exports = RutinasService;