const pool = require('../config/conexionbbdd');
class RutinassDao {
    constructor() { }

    async leerRutina(id) {
        try {
            const resultado = await pool.query('SELECT * FROM Rutinas WHERE id = ?', [id]);
            return resultado[0];
        }
        catch (error) {
            console.error('Error al buscar la rutina por ID: ', error);
            throw error;
        }
    }

    async getRutinasById(idUsuario) {
        try {
            const [response] = await pool.query(`SELECT r.id, r.id_usuario, r.nombre, r.autor, r.fecha_creacion, p.enlace, i.mimetype, i.imagen 
                FROM Rutinas r LEFT JOIN Tarjetas t ON t.id = r.id_portada 
                LEFT JOIN Pictos p ON p.id_tarjeta = t.id 
                LEFT JOIN Imagenes i ON i.id_tarjeta = t.id
                WHERE r.id_usuario = ?
                `, [idUsuario]);

            return response;
        }
        catch (error) {
            console.error('[ERROR] RutinasDao: al buscar rutinas por id usuario: ', error);
          throw error;
        }
    }

    async getTarjetasByIdRutina(idRutina) {
        try {
            const tarjetas = await pool.query(`
                SELECT Rutinas.id, Rutinas.nombre, Pictos.id as id_picto, Pictos.enlace, Imagenes.mimetype, Imagenes.imagen, Tarjetas.texto
                FROM Rutinas LEFT JOIN Rutinas_tarjeta ON Rutinas.id = Rutinas_tarjeta.id_rutina
                LEFT JOIN Tarjetas ON Rutinas_tarjeta.id_tarjeta = Tarjetas.id
                LEFT JOIN Pictos ON Tarjetas.id = Pictos.id_tarjeta
                LEFT JOIN Imagenes ON Tarjetas.id = Imagenes.id_tarjeta
                WHERE Rutinas.id = ?
                ORDER BY Rutinas_tarjeta.orden ASC;
           `, [idRutina]);

            return tarjetas;
        }


        catch (error) {
            console.error('[ERROR] RutinasDao: al buscar trajetas de una rutina: ', error);
            throw error;
        }
    }

    async crearRutina(data) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [rutina] = await connection.query(
                `INSERT INTO Rutinas (id_usuario, nombre, autor, fecha_creacion, id_portada) VALUES (?, ?, ?, ?, ?);`,
                [data.id_usuario, data.nombre, data.autor, data.fecha_creacion, data.id_portada]
            );

            if (rutina.affectedRows === 1) {
                const queries = data.tarjetas.map(tarjeta => [
                    rutina.insertId,
                    tarjeta.id_tarjeta,
                    tarjeta.orden
                ]);

                await connection.query(
                    `INSERT INTO Rutinas_tarjeta (id_rutina, id_tarjeta, orden) VALUES ?;`,
                    [queries]
                );
                await connection.commit();
                return { success: true, id: rutina.insertId };
            }

        } catch (e) {
            await connection.rollback();
            console.error('[ERROR] RutinasDao: al crear una rutina: ', e);
            throw e;
        }
        finally {
            connection.release();
        }
    }
}

module.exports = RutinassDao;