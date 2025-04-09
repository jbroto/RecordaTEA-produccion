const EntradasService = require('../servicios/entradasService');
const TarjetasService = require('../servicios/tarjetasService');
const UsuariosService = require('../servicios/usuariosService');
const fechaUtils = require('../utils/fechaUtils');

const entradasService = new EntradasService();
const tarjetasService = new TarjetasService();
const usuariosService = new UsuariosService();

class EntradasController {
    constructor() { }

    async cargarDiario(req, res, next) {
        try {
            let usuario;
            let usus = req.session.usuarios;
            let con;
            if (!req.session.usuario || req.session.usuario.id !== req.params.id) {
                const resultado = await usuariosService.leerUsuarioId(req.params.id);
                const c = await tarjetasService.leerConfiguracionVocabulario(resultado[0].id);
                usuario = resultado[0];
                con = c;
                req.session.usuario = resultado[0];
                req.session.config = c;
            }
            else {
                usuario = req.session.usuario;
                con = req.session.config;
            }
            let fecha = new Date();
            let año = fecha.getFullYear();
            let mes = fecha.getMonth() + 1;

            let entradas = await entradasService.entradasMes(usuario.id, mes, año);
            for (let entrada of entradas) {
                entrada.mes = fechaUtils.mesAbreviatura(entrada.fecha).toUpperCase();
                entrada.dia = fechaUtils.dia(entrada.fecha);
                entrada.hoy = fechaUtils.esHoy(entrada.fecha);
                entrada.f = fechaUtils.fechaCompleta(entrada.fecha);
                entrada.fecha = fechaUtils.fechaSinHora(entrada.fecha);
                if (entrada.cuerpo === null) {
                    let pictos = await tarjetasService.tarjetasEntrada(entrada.id);
                    entrada.pictos = pictos;
                }
                else {
                    entrada.pictos = [];
                }
            }

            let anyos = await entradasService.obtenerAnyos(usuario.id);
            res.status(200).render('cuidadores/diario', { data: { entradas: entradas, usuario: usuario, usuarios: usus, anyos: anyos } });
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

    async cargarDia(req, res, next) {
        try {
            let dia = req.params.dia;
            let usuario = req.session.usuario;
            let usus = req.session.usuarios;
            let entradas = await entradasService.entradasDia(dia, usuario.id);
            for (let entrada of entradas) {
                let autor = await usuariosService.leerUsuarioId(entrada.autor);
                entrada.autor = autor[0];
                entrada.hora = fechaUtils.horaMinutos(entrada.fecha_registro);
                if (entrada.cuerpo === null) {
                    let pictos = await tarjetasService.tarjetasEntrada(entrada.id);
                    entrada.pictos = pictos;
                }
                else {
                    entrada.pictos = [];
                }
            }
            let diaCompleto = fechaUtils.fechaCompleta(dia);
            res.render('cuidadores/verDia', { data: { entradas: entradas, usuario: usuario, dia: diaCompleto, usuarios: usus, config: req.session.config } });

        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

    async actualizarDiario(req, res) {
        try {
            let entradas = await entradasService.entradasMes(req.session.usuario.id, req.query.mes, req.query.anyo);
            for (let entrada of entradas) {
                entrada.mes = fechaUtils.mesAbreviatura(entrada.fecha).toUpperCase();
                entrada.dia = fechaUtils.dia(entrada.fecha);
                entrada.hoy = fechaUtils.esHoy(entrada.fecha);
                entrada.f = fechaUtils.fechaCompleta(entrada.fecha);
                entrada.fecha = fechaUtils.fechaSinHora(entrada.fecha);
                if (entrada.cuerpo === null) {
                    let pictos = await tarjetasService.tarjetasEntrada(entrada.id);
                    entrada.pictos = pictos;
                }
                else {
                    entrada.pictos = [];
                }
            }
            res.status(200).send({ data: entradas });
        }
        catch (error) {
            res.status(500).send('Ha ocurrido algo en el servidor');
        }
    }

    async redirectToDiary(req, res, next) {
        try {
            const response = await entradasService.leerEntradasPorUsuario(req.session.usuario.id);
            res.status(200).render('TEA/diaryTEA', { entradas: response, diary: true, usuario: req.session.usuario.nombre, config: req.session.config });
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

    async addEntry(req, res, next) {
        try {
            // Significa que no tiene tarjetas
            var vocabulario = [];
            if (!req.session.config.texto) {
                vocabulario = await tarjetasService.obtenerTarjetasUsuarioId(req.session.usuario.id);
            }
            res.status(200).render('TEA/addEntryTEA', { vocabulario: vocabulario, diary: true, usuario: req.session.usuario.nombre, config: req.session.config })
            //OBTENER PICTOGRAMAS DEL USUARIO PARA ADD ENTRY Y RENDERIZAR
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

    async submitEditEntry(req, res, next) {
        try {
            const registrosString = req.body.registros;
            const registros = JSON.parse(registrosString);

            const response = await entradasService.submitEditEntry(registros);

            if (response.success) {
                return res.redirect('/diario'); // Redirigir a la página del diario, por ejemplo
            }
            else {
                return res.status(500).send('Error interno del servidor');
            }
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

    async viewEntry(req, res) {
        try {
            const idEntrada = req.params.idEntrada;
            const idUsuario = req.session.usuario.id; // Asumiendo que tienes la información del usuario autenticado
            // si no se encuentra en la sesión, realiza la búsqueda en la base de datos
            const entrada = await entradasService.viewEntryById(idEntrada, idUsuario);
            if (entrada) {
                return res.status(200).render('TEA/viewEntryTEA', { entrada: entrada[0], diary: true, usuario: req.session.usuario.nombre, config: req.session.config });
            } else {
                const error = {
                    status: 403,
                    info: "No tienes permisos para ver esta página"
                };
                // si no existe, es porque no ha cumplido con que sea el idUsuario
                return res.status(403).render('error', { error: error });
            }

        } catch (error) {
            return res.status(500).send('Error interno del servidor');
        }
    }

    async submitEntrada(req, res, next) {
        try {
            const registrosString = req.body.registros;
            const registros = JSON.parse(registrosString);
            registros.id_usuario = req.session.usuario.id;

            const response = await entradasService.submitEntrada(registros);
            if (response.success) {
                res.redirect('/diario'); // Redirigir a la página del diario, por ejemplo
            }
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

    async eliminarEntrada(req, res) {

        const idEntrada = req.params.idEntrada;
        const idUsuario = req.session.usuario.id; // Asumiendo que tienes la información del usuario autenticado
        try {

            const response = await entradasService.eliminarEntrada(idEntrada, idUsuario);
            // si no se encuentra en la sesión, realiza la búsqueda en la base de datos
            if (response.success) {
                res.redirect('/diario'); // Redirigir a la página del diario, por ejemplo
            } else {
                const error = {
                    status: 403,
                    info: "No tienes permisos para ver esta página"
                };
                // si no existe, es porque no ha cumplido con que sea el idUsuario
                return res.status(403).render('error', { error: error });
            }
        } catch (error) {
            return res.status(500).send('Error interno del servidor');
        }

    }


    async editEntryView(req, res) {

        const idEntrada = req.params.idEntrada;
        const idUsuario = req.session.usuario.id;

        try {

            // Significa que no tiene tarjetas
            var vocabulario = [];
            if (!req.session.config.texto) {
                vocabulario = await tarjetasService.obtenerTarjetasUsuarioId(idUsuario);
            }

            // si no se encuentra en la sesión, realiza la búsqueda en la base de datos
            const entrada = await entradasService.viewEntryById(idEntrada, idUsuario);


            if (entrada) {
                return res.status(200).render('TEA/editEntryTEA', { entrada: entrada[0], diary: true, vocabulario: vocabulario, usuario: req.session.usuario.nombre, config: req.session.config });
            } else {
                const error = {
                    status: 403,
                    info: "No tienes permisos para ver esta página"
                };
                // si no existe, es porque no ha cumplido con que sea el idUsuario
                return res.status(403).render('error', { error: error });
            }
        } catch (error) {
            return res.status(500).send('Error interno del servidor');
        }


    }


}

module.exports = EntradasController;