const multer = require('multer');

//Configuramos el multer
const storage = multer.memoryStorage(); // Almacenar en memoria
const upload = multer({ storage: storage });

module.exports = upload;