const TarjetasService = require('../servicios/tarjetasService');
const imagenUtils = require('../utils/imagenUtils');
const tarjetasService = new TarjetasService();

class TarjetasControlador {
    constructor() {
        this.resultadoArasaac = [];
    }

    async obtenerTarjetasUsuarioId(req, res, next) {
        try {
            let id_usuario = req.session.usuario.id;
            let vocabulario = await tarjetasService.obtenerTarjetasUsuarioId(id_usuario);
            vocabulario.forEach((elem) => {
                elem.imagen = imagenUtils.renderImage(elem) || elem.imagen;
            });
            let data = {
                usuario: req.session.usuario,
                usuarios: req.session.usuarios,
                voc: vocabulario,
                config: req.session.config
            };
            res.status(200).render('cuidadores/gestionTarjetas', { data: data });
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

    async consultaArasaac(req, res) {
        let pictos = [];
        this.resultadoArasaac = [];
        try {
            let consulta = req.query.consulta;
            if (consulta !== null && consulta !== undefined) {
                this.resultadoArasaac = await tarjetasService.consultaArasaac(consulta);
                if (this.resultadoArasaac.length > 0) {
                    for (let i = 0; i < this.resultadoArasaac.length && i < 18; i++) {
                        let picto = await tarjetasService.pictosArasaac(this.resultadoArasaac[i]._id);
                        pictos.push({ id_arasaac: this.resultadoArasaac[i]._id, enlace: picto.image, keyword: this.resultadoArasaac[i].keywords[0]?.keyword.toUpperCase() || '' });
                    }
                }
                res.send({ pictos: pictos, paginacion: this.resultadoArasaac.length });
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                res.send({ pictos: pictos, paginacion: this.resultadoArasaac.length });
            }
            else {
                res.status(500).send('Ha ocurrido algo inexperado y la aplicación ha fallado.');
            }
        }
    }

    async pasarPagina(req, res) {
        try {
            let pagina = req.query.pagina;
            let pictos = [];
            let index = this.resultadoArasaac.length;
            let pag = (index - (18 * (pagina - 1)));
            if (this.resultadoArasaac.length > 0) {
                for (let i = (18 * (pagina - 1)); i < index && i < (18 * pagina); i++) {
                    let picto = await tarjetasService.pictosArasaac(this.resultadoArasaac[i]._id);
                    pictos.push({ id_arasaac: this.resultadoArasaac[i]._id, enlace: picto.image, keyword: this.resultadoArasaac[i].keywords[0]?.keyword.toUpperCase() || '' });
                }
            }
            res.status(200).send({ pictos: pictos, paginacion: pag });
        }
        catch (error) {
            res.status(500).send('Ha ocurrido algo inexperado y la aplicación ha fallado.');
        }
    }

    async addTarjetaVocabulario(req, res) {
        try {
            let id_usuario = req.session.usuario.id;
            let id_arasaac = req.body.id_arasaac;
            let enlace = req.body.enlace;
            let keyword = req.body.keyword;

            let success = await tarjetasService.addTarjetaVocabulario(id_arasaac, enlace, id_usuario, keyword);
            res.status(200).send(success);
        }
        catch (error) {
            res.status(500).send('Ha ocurrido algo inexperado y la aplicación ha fallado.');
        }
    }

    async eliminarTarjetaVocabulario(req, res) {
        try {
            let id = req.body.id;
            let eliminacion = await tarjetasService.eliminarTarjetaVocabulario(id);
            res.status(200).send(eliminacion);
        }
        catch (error) {
            res.status(500).send('Ha ocurrido algo inexperado y la aplicación ha fallado.');
        }
    }

    async addTarjetaImagen(req, res) {
        try {
            let tarjeta = {
                imagen: req.file.buffer,
                mimetype: req.file.mimetype,
                id_usuario: req.session.usuario.id,
                tam: req.file.size
            }

            let resultado = await tarjetasService.addTarjetaImagen(tarjeta);
            res.status(200).send(resultado);
        }
        catch (error) {
            res.status(500).send('Ha ocurrido algo inexperado y la aplicación ha fallado.');
        }
    }

    async textoLibre(req, res) {
        try {
            let resultado = await tarjetasService.textoLibre(req.body.texto, req.session.usuario.id);
            if (resultado) {
                req.session.config.texto = (req.body.texto === 'true');
            }
            res.status(200).send({ success: resultado });
        }
        catch (error) {
            res.status(500).send('Ha ocurrido algo inexperado y la aplicación ha fallado.');
        }
    }

    async textoPicto(req, res) {
        try {
            let resultado = await tarjetasService.textoPicto(req.body.picto, req.session.usuario.id);
            if (resultado) {
                req.session.config.picto_texto = (req.body.picto === 'true');
            }
            res.status(200).send({ success: resultado });
        }
        catch (error) {
            res.status(500).send('Ha ocurrido algo inexperado y la aplicación ha fallado.');
        }
    }
}

module.exports = TarjetasControlador;