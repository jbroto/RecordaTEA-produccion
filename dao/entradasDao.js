const pool = require('../config/conexionbbdd');

class EntradasDao {
    constructor() { }

    async entradasMes(usuario, mes, año) {
        try {
            let [entradas] = await pool.query(`
SELECT 
    e.tipo, 
    DATE(e.fecha_registro) AS fecha, 
    COUNT(*) AS entradas,
    e2.id AS id,
    e2.cuerpo AS cuerpo
FROM Entradas e
JOIN Entradas e2 
    ON DATE(e2.fecha_registro) = DATE(e.fecha_registro)
    AND e2.id_usuario = e.id_usuario
    AND e2.fecha_registro = (
        SELECT MAX(fecha_registro)
        FROM Entradas 
        WHERE DATE(fecha_registro) = DATE(e.fecha_registro)
        AND id_usuario = e.id_usuario
    )
WHERE e.id_usuario = ? 
  AND MONTH(e.fecha_registro) = ?  
  AND YEAR(e.fecha_registro) = ?   
GROUP BY DATE(e.fecha_registro), e.tipo, e2.id, e2.cuerpo
ORDER BY DATE(e.fecha_registro) DESC
LIMIT 1;
            `, [usuario, mes, año]);


            return entradas;
        }
        catch (error) {
            console.error('[ERROR] EntradasDao: al buscar las entradas de un mes: ', error);
            throw error;
        }
    }

    async entradaDia(dia, usuario) {
        try {
            let [entradas] = await pool.query('SELECT * FROM Entradas WHERE DATE(fecha_registro) = ? AND id_usuario = ? ORDER BY fecha_registro DESC', [dia, usuario]);
            return entradas;
        }
        catch (error) {
            console.error('[ERROR] EntradasDao: al buscar las entradas de un día: ', error);
            throw error;
        }
    }

    async leerEntradasPorUsuario(idUsuario) {
        try {
            const entradas = await pool.query(`
                SELECT Entradas.id AS idEntrada, Entradas.autor, Entradas.tipo, Entradas_tarjeta.id_entrada, Entradas_tarjeta.id_tarjeta, Entradas.fecha_registro, Entradas_tarjeta.orden, Pictos.enlace, Entradas.cuerpo, Tarjetas.texto, Entradas.emocion, Imagenes.imagen, Imagenes.mimetype
                FROM Entradas
                LEFT JOIN Entradas_tarjeta ON Entradas.id = Entradas_tarjeta.id_entrada
                LEFT JOIN Tarjetas ON Entradas_tarjeta.id_tarjeta = Tarjetas.id
                LEFT JOIN Pictos ON Tarjetas.id = Pictos.id_tarjeta
                LEFT JOIN Imagenes ON Tarjetas.id = Imagenes.id_tarjeta
                WHERE Entradas.id_usuario = ?
                AND Entradas.autor = ?
                ORDER BY Entradas.fecha_registro DESC, Entradas_tarjeta.orden ASC;
            `, [idUsuario, idUsuario]);

            return entradas;
        }
        catch (error) {
            console.error('[ERROR] EntradasDao: al buscar las entradas de un usuario: ', error);
            throw error;
        }
    }

    async submitEntrada(data) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // 1. Insertar en la tabla 'entradas'
            const [entradaResult] = await conn.execute(
                `INSERT INTO Entradas (id_usuario, autor, fecha_registro, emocion, cuerpo, tipo) VALUES (?, ?, ?, ?, ?, ?);`,
                [data.id_usuario, data.id_usuario, data.fecha_registro, data.emocion, data.cuerpo, data.tipo]
            );

            // Verificar que la inserción fue exitosa
            if (entradaResult.affectedRows !== 1) {
                throw new Error('No se pudo insertar la entrada');
            }

            const idEntrada = entradaResult.insertId;

            // 2. Preparar las tarjetas para inserción masiva
            const tarjetasValues = data.tarjetas.map(t => [idEntrada, t.id, t.orden]);

            // 3. Insertar en 'entradas_tarjeta'
            if (tarjetasValues.length > 0) {
                await conn.query(
                    `INSERT INTO Entradas_tarjeta (id_entrada, id_tarjeta, orden) VALUES ?;`,
                    [tarjetasValues]
                );
            }

            await conn.commit();
            return { success: true, id: idEntrada };

        } catch (error) {
            await conn.rollback();
            console.error('[ERROR] EntradasDao: al añadir una entrada: ', error);
            return { success: false, error };
        } finally {
            conn.release();
        }
    }

    async eliminarEntrada(id, idUsuario) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // 1. Eliminar 'entradas' de entradas_Tarjeta
            const [entradaResult] = await conn.execute(
                `DELETE FROM Entradas_tarjeta WHERE id_entrada = ?;`,
                [id]
            );

            // Verificar que la eliminación fue exitosa
            if (entradaResult.affectedRows < 0) {
                throw new Error('No se pudo eliminar la entrada_tarjeta');
            }

            // 3. Eliminar en 'entradas'

            const [entrada] = await conn.query(
                `DELETE FROM Entradas WHERE id = ? AND id_usuario = ?;`,
                [id, idUsuario]
            );

            // Verificar que la eliminación fue exitosa
            if (entrada.affectedRows !== 1) {
                throw new Error('No se pudo eliminar la entrada');
            }


            await conn.commit();
            return { success: true, id: id };

        } catch (error) {
            await conn.rollback();
            console.error('[ERROR] EntradasDao: al eliminar una entrada: ', error);
            return { success: false, error };
        } finally {
            conn.release();
        }
    }


    async actualizarTarjetasEntrada(data) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // 1. Actualizar la entrada
            await conn.execute(
                'UPDATE Entradas SET fecha_registro = ? WHERE id = ?',
                [data.fecha_registro, data.id]
            );


            // 2. Obtener tarjetas actuales de la base de datos
            const [rows] = await conn.execute(
                'SELECT id_tarjeta, orden FROM Entradas_tarjeta WHERE id_entrada = ?',
                [data.id]
            );

            const actuales = new Map(rows.map(t => [t.id_tarjeta, t.orden]));
            const nuevas = new Map(data.tarjetas.map(t => [t.id, t.orden]));


            // 3. Eliminar tarjetas que ya no están
            for (const [id_tarjeta_actual] of actuales) {
                if (!nuevas.has(id_tarjeta_actual)) {
                    await conn.execute(
                        'DELETE FROM Entradas_tarjeta WHERE id_entrada = ? AND id_tarjeta = ?',
                        [data.id, id_tarjeta_actual]
                    );
                }
            }

            // 4. Insertar nuevas tarjetas o actualizar orden
            for (const { id, orden } of data.tarjetas) {
                if (!actuales.has(id)) {
                    // No existía antes: insertar

                    const [existingEntry] = await conn.execute(
                        'SELECT 1 FROM Entradas_tarjeta WHERE id_entrada = ? AND id_tarjeta = ?',
                        [data.id, id]
                    );

                    if (existingEntry.length === 0) {
                        await conn.execute(
                            'INSERT INTO Entradas_tarjeta (id_entrada, id_tarjeta, orden) VALUES (?, ?, ?)',
                            [data.id, id, orden]
                        );
                    }


                } else {
                    const actual = actuales.get(id);

                    if (actual.orden !== orden) {
                        // Existía pero con distinto orden: actualizar
                        await conn.execute(
                            'UPDATE Entradas_tarjeta SET orden = ? WHERE id_entrada = ? AND id_tarjeta = ?',
                            [orden, data.id, id]
                        );
                    }

                }
            }

            // 5. Actualizar la emocion
            await conn.execute(
                'UPDATE Entradas SET emocion = ? WHERE id = ?',
                [data.emocion, data.id]
            );


            await conn.commit();
            return { success: true };

        } catch (err) {
            await conn.rollback();
            console.error('[ERROR] EntradasDao: al editar las tarjetas de una entrada: ', error);
            return { success: false, error: err };
        } finally {
            conn.release();
        }
    }

    async actualizarTextoLibreEntrada(data) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Obtener entrada actuale de la base de datos
            const [rows] = await conn.execute(
                'SELECT cuerpo FROM Entradas WHERE id = ?',
                [data.id]
            );

            // Actualizarlas si hay cambios
            if (rows[0].cuerpo != data.cuerpo) {
                await conn.execute(
                    'UPDATE Entradas SET cuerpo = ? WHERE id = ?',
                    [data.cuerpo, data.id]
                );
            }

            if (rows[0].fecha_registro != data.fecha_registro) {
                await conn.execute(
                    'UPDATE Entradas SET fecha_registro = ? WHERE id = ?',
                    [data.fecha_registro, data.id]
                );
            }

            await conn.commit();
            return { success: true };

        } catch (err) {
            await conn.rollback();
            console.error('[ERROR] EntradasDao: al editar el texto de una entrada: ', error);
            return { success: false, error: err };
        } finally {
            conn.release();
        }
    }

    async viewEntryById(idEntrada, idUsuario) {
        try {
            const entradas = await pool.query(`
                 SELECT Entradas.id AS idEntrada, Entradas.autor, Entradas_tarjeta.id_entrada, Entradas_tarjeta.id_tarjeta, Entradas.tipo, Entradas.fecha_registro, Entradas_tarjeta.orden, Pictos.enlace, Entradas.cuerpo, Entradas.emocion, Imagenes.imagen, Imagenes.mimetype, Tarjetas.texto
                FROM Entradas
                LEFT JOIN Entradas_tarjeta ON Entradas.id = Entradas_tarjeta.id_entrada
                LEFT JOIN Tarjetas ON Entradas_tarjeta.id_tarjeta = Tarjetas.id
                LEFT JOIN Pictos ON Tarjetas.id = Pictos.id_tarjeta
                LEFT JOIN Imagenes ON Tarjetas.id = Imagenes.id_tarjeta
                WHERE Entradas.id = ?
                AND Entradas.id_Usuario = ?
                ORDER BY Entradas.fecha_registro DESC, Entradas_tarjeta.orden ASC;
            `, [idEntrada, idUsuario]);


            return entradas;
        }
        catch (error) {
            console.error('[ERROR] EntradasDao: al obtener una entrada por id: ', error);
            throw error;
        }


    }

    async obtenerAnyos(idUsuario) {
        try {
            let [response] = await pool.query('SELECT DISTINCT YEAR(fecha_registro) AS anyo FROM Entradas WHERE id_usuario = ? ORDER BY anyo DESC;', [idUsuario])
            return response;
        }
        catch (error) {
            console.error('[ERROR] EntradasDao: al obetener los años en los que hay entradas: ', error);
            throw error;
        }
    }


}

module.exports = EntradasDao;