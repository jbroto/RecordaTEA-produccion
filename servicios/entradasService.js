const TarjetasDao = require('../dao/tarjetasDao');
const EntradasDao = require('../dao/entradasDao');
const imagenUtils = require('../utils/imagenUtils');
const fechaUitls = require('../utils/fechaUtils');

const tarjetasDao = new TarjetasDao();
const entradasDao = new EntradasDao();


class EntradasService {
    constructor() { }


    async entradasMes(usuario, mes, año) {
        try {
            let entradasMes = await entradasDao.entradasMes(usuario, mes, año);


            // En casos donde se repita el tema de que hay mas de una entrada con la misma fecha y hora
            const fechasVistas = new Set();
            const unicosPorFecha = entradasMes.filter(item => {
                // Normalizar la fecha para solo comparar año-mes-día
                const fechaNormalizada = new Date(item.fecha).toISOString().split('T')[0];

                if (fechasVistas.has(fechaNormalizada)) {
                    return false;
                } else {
                    fechasVistas.add(fechaNormalizada);
                    return true;
                }
            });

            return unicosPorFecha;
        }
        catch (error) {
            console.error('ERROR[EntradasService]: obtener entradas de un mes: ', error);
            throw error;
        }
    }

    async entradasDia(fecha, usuario) {
        try {
            let entradasDia = await entradasDao.entradaDia(fecha, usuario);
            return entradasDia;
        }
        catch (error) {
            console.error('ERROR[EntradasService]: obtener entradas de un mes: ', error);
            throw error;
        }
    }

    async leerEntradasPorUsuario(idUsuario) {
        try {
            const entradas = await entradasDao.leerEntradasPorUsuario(idUsuario);

            // Agrupa los datos en un array para mantener el orden
            const groupedData = [];
            const entryMap = new Map(); // Usamos un Map para hacer referencia rápida por idEntrada

            entradas[0].forEach((item) => {
                const { formattedDate, formattedTime, numericDate } = fechaUitls.formatDateTime(item.fecha_registro);

                const id = item.idEntrada;

                // Si la entrada aún no existe en el Map, la creamos
                if (!entryMap.has(id)) {
                    const newEntry = {
                        idEntrada: id,
                        autor: item.autor,
                        fecha_registro: formattedDate,
                        fecha_editable: numericDate,
                        hora_registro: formattedTime,
                        cuerpo: item.cuerpo,
                        emocion: item.emocion,
                        tarjetas: [],
                        tipo: item.tipo
                    };
                    groupedData.push(newEntry); // Mantenemos el orden al agregar en el array
                    entryMap.set(id, newEntry);
                }

                // Añadimos la tarjeta si existe
                if (item.id_tarjeta !== null) {
                    entryMap.get(id).tarjetas.push({
                        id_tarjeta: item.id_tarjeta,
                        orden: item.orden,
                        enlace: item.enlace,
                        imagen: imagenUtils.renderImage(item) || item.imagen,
                        texto: item.texto
                    });
                }
            });

            return groupedData;
        } catch (error) {
            console.error(error);
        }
    }

    async submitEntrada(data) {
        const response = await entradasDao.submitEntrada(data);
        return response;
    }

    async eliminarEntrada(idEntrada, idUsuario) {
        const response = await entradasDao.eliminarEntrada(idEntrada, idUsuario);
        return response;
    }

    async submitEditEntry(data) {
        var response = null;
        if (data.tipo === "Picto") {
            response = await entradasDao.actualizarTarjetasEntrada(data);
        }
        else {
            response = await entradasDao.actualizarTextoLibreEntrada(data);
        }

        return response;
    }



    async viewEntryById(idEntrada, idUsuario) {
        const response = await entradasDao.viewEntryById(idEntrada, idUsuario);

        try {
            //para poder agrupar los datos por entrada
            const groupedData = response[0].reduce((acc, item) => {
                //basicamente itero con item sobre entradas, y voy metiendo en acc los datos para luego retornarlos en groupedData

                const { formattedDate, formattedTime, numericDate } = fechaUitls.formatDateTime(item.fecha_registro);


                const id = item.idEntrada;
                //si no está metido se crea
                if (!acc[id]) {
                    acc[id] = {

                        idEntrada: id,
                        autor: item.autor,
                        fecha_registro: formattedDate,
                        hora_registro: formattedTime,
                        fecha_editable: numericDate,
                        cuerpo: item.cuerpo,
                        emocion: item.emocion,
                        tarjetas: [],
                        tipo: item.tipo
                    };
                }
                //para saber si es una entrada con pictos o solo texto del cuerpo
                if (item.id_tarjeta !== null) {
                    acc[id].tarjetas.push({
                        id_tarjeta: item.id_tarjeta,
                        orden: item.orden,
                        enlace: item.enlace,
                        imagen: imagenUtils.renderImage(item) || item.imagen,
                        texto: item.texto
                    });
                }

                return acc;
            }, {});

            const result = Object.values(groupedData);

            return result;
        } catch (error) {

        }
    }

    async obtenerAnyos(idUsuario) {
        if (idUsuario > 0) {
            let anyos = await entradasDao.obtenerAnyos(idUsuario);
            return anyos;
        }
    }

}

module.exports = EntradasService;