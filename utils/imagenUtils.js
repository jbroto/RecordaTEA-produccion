const { imageSize } = require('image-size');

const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 500 * 1024;

function renderImage(i) {
    if (i.imagen) {
        let imagenBase64 = i.imagen.toString('base64');
        return 'data:' + i.mimetype + ';base64,' + imagenBase64;
    }
    return null;
}

function comprobarDimensiones(i) {
    let dimensiones = imageSize(i.imagen);
    if (!dimensiones) {
        return { mensaje: false };
    }
    return { mensaje: true };
}

function comprobarTipo(i) {
    if (!tiposPermitidos.includes(i.mimetype)) {
        //Código de error: El archivo no es un tipo de imagen permitido
        return { mensaje: false };
    }
    return { mensaje: true };
}

function comprobarTamaño(i) {
    if (i.tam > maxSize) {
        //Código de error: El archivo excede el tamaño máximo permitido
        return { mensaje: false };
    }
    return { mensaje: true };
}

module.exports = {
    renderImage,
    comprobarDimensiones,
    comprobarTipo,
    comprobarTamaño
};