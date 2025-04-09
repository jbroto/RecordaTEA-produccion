const pool = require('../config/conexionbbdd');

class TarjetasDao {
  constructor() { }

  async obtenerPictosUsuarioId(id) {
    try {
      let [vocabulario] = await pool.query('SELECT p.id, p.enlace, t.id as idTarjeta FROM Tarjetas t JOIN Pictos p ON t.id = p.id_tarjeta WHERE t.id_usuario = ? AND t.activa = 1',
        [id]);
      return vocabulario;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al obtener pictos por usuario: ', error);
      throw error;
    }
  }

  async obtenerTarjetasUsuarioId(id) {
    try {
      let [vocabulario] = await pool.query(`SELECT p.id, p.enlace, t.id as idTarjeta, t.categoria, t.texto, i.imagen, i.mimetype
        FROM Tarjetas t 
        LEFT JOIN Pictos p ON t.id = p.id_tarjeta
        LEFT JOIN Imagenes i ON t.id = i.id_tarjeta
        WHERE t.id_usuario = ? AND t.activa = 1`,
        [id]);
      return vocabulario;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al obtener tarjetas por usuario: ', error);
      throw error;
    }
  }

  async addTarjetaVocabulario(id_arasaac, enlace, id_usuario, keyword) {
    try {
      let [response] = await pool.query('INSERT INTO Tarjetas (id_usuario, texto) VALUES (?, ?)', [id_usuario,keyword]);
      let [picto] = await pool.query('INSERT INTO Pictos (idArasaac, enlace, id_tarjeta) VALUES (?, ?, ?)', [id_arasaac, enlace, response.insertId]);
      return response.insertId;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al añadir tarjetas al vocabulario: ', error);
      throw error;
    }
  }

  async comprobarExistenciaPicto(id_arasaac, enlace, id_usuario) {
    try {
      let [response] = await pool.query('SELECT * FROM Tarjetas JOIN Pictos ON Tarjetas.id = Pictos.id_tarjeta' +
        ' WHERE Tarjetas.id_usuario = ? AND Pictos.idArasaac = ? AND Pictos.enlace = ?', [id_usuario, id_arasaac, enlace]);
      return response;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al comprobar existencia de tarjetas en vocabulario: ', error);
      throw error;
    }
  }

  async eliminarTarjetaVocabulario(idTarjeta) {
    try {
      let [response] = await pool.query('UPDATE Tarjetas SET activa = 0 WHERE id = ?', [idTarjeta]);
      return response.affectedRows;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al eliminar tarjetas al vocabulario: ', error);
      throw error;
    }
  }

  async buscarPictoIdTarjeta(idTarjeta) {
    try {
      let [picto] = await pool.query('SELECT Pictos.id FROM Pictos JOIN Tarjetas ON Pictos.id_tarjeta = Tarjetas.id WHERE Tarjetas.id = ?', [idTarjeta]);
      return picto;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al buscar tarjetas en el vocabulario: ', error);
      throw error;
    }
  }

  async tarjetasEntrada(id_entrada) {
    try {
      let [pictos] = await pool.query(`SELECT
                                        p.enlace,
                                        i.imagen,
                                        i.mimetype,
                                        t.texto
                                      FROM Entradas_tarjeta et
                                      LEFT JOIN Tarjetas t ON
                                        t.id = et.id_tarjeta
                                      LEFT JOIN Pictos p ON
                                        p.id_tarjeta = t.id
                                      LEFT JOIN Imagenes i ON
                                        i.id_tarjeta = t.id
                                      WHERE
                                        et.id_entrada = ?
                                      ORDER BY et.orden`, [id_entrada]);
      return pictos;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al buscar tarjetas al en una entrada: ', error);
      throw error;
    }
  }

  async addImagen(tarjeta) {
    try {
      let [resultado] = await pool.query('INSERT INTO Tarjetas (id_usuario) VALUES (?)', [tarjeta.id_usuario]);
      let [resultadoImagen] = await pool.query('INSERT INTO Imagenes (imagen, mimetype, id_tarjeta) VALUES (?, ?, ?)', [tarjeta.imagen, tarjeta.mimetype, resultado.insertId]);
      return resultadoImagen.insertId;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al añadir imagenes al vocabulario: ', error);
      throw error;
    }
  }

  async imagenesUsuarioId(usuarioId) {
    try {
      let [imagenes] = await pool.query('SELECT t.id AS idTarjeta, i.imagen, i.mimetype, i.id FROM Tarjetas t JOIN Imagenes i ON t.id = i.id_tarjeta WHERE t.id_usuario = ? AND t.activa = 1', [usuarioId]);
      return imagenes;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al leer imagenes del vocabulario: ', error);
      throw error;
    }
  }

  async activarPicto(idTarjeta) {
    try {
      let [resultado] = await pool.query('UPDATE Tarjetas SET activa = 1 WHERE id = ?', [idTarjeta]);
      return resultado.affectedRows;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al activar una tarjeta del vocabulario: ', error);
      throw error;
    }
  }

  async textoLibre(textoLibre, idUsuario) {
    try {
      let [resultado] = await pool.query('UPDATE Config SET texto = ? WHERE id_usuario = ?', [textoLibre, idUsuario]);
      return resultado.affectedRows;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al activar el texto libre: ', error);
      throw error;
    }
  }

  async textoPicto(picto, idUsuario) {
    try {
      let [resultado] = await pool.query('UPDATE Config SET picto_texto = ? WHERE id_usuario = ?', [picto, idUsuario]);
      return resultado.affectedRows;
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al activar el texto del picto: ', error);
      throw error;
    }
  }

  async leerConfiguracionVocabulario(idUsuario) {
    try {
      let [resultado] = await pool.query('SELECT * FROM Config WHERE id_usuario = ?', [idUsuario]);
      return resultado[0];
    }
    catch (error) {
      console.error('[ERROR] TarjetasDao: al leer la configuración del vocabulario: ', error);
      throw error;
    }
  }
}

module.exports = TarjetasDao;