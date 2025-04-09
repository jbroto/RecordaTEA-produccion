const pool = require('../config/conexionbbdd');

class CuidadoresDao{
    constructor() {}

    async leerCuidadorId(id){
        try{
            const resultado = await pool.query('SELECT * FROM Cuidadores WHERE id = ?', [id]);
            return resultado[0];
        }
        catch(error){
            console.error('Error al buscar usuario por ID: ', error);
            throw error;
        }
    }

    async login(usuario){
        try{
            const [resultado] = await pool.query('SELECT * FROM Cuidadores WHERE id = ?', [usuario.id]);
            return resultado;
        }
        catch(error){
            console.error('Error al iniciar sesión de un Cuidador: ', error);
            throw error;
        }
    }

    async registro(usuario){
        try{
            const [resultado] = await pool.query('INSERT INTO Cuidadores (id, rol) VALUES(?, ?)', [usuario.id, usuario.rol]);
            return resultado;
        }
        catch(error){
            console.error('Error al iniciar sesión de un Cuidador: ', error);
            throw error;
        }
    }

    async compartirPerfil(idUsuario, idPerfil){
        try{
            let [resultado] = await pool.query('INSERT INTO Cuidadores_Usu (id_cuidador, id_usuario) VALUES (?,?)', [idUsuario, idPerfil]);
            return resultado.affectedRows;
        }
        catch(error){
            console.error('Error al compartir perfil: ', error);
            throw error;
        }
    }

    async perfilVinculadoId(idUsuario, idPerfil){
        try{
            let [resultado] = await pool.query('SELECT * FROM Cuidadores_Usu WHERE id_cuidador = ? AND id_usuario = ?', [idUsuario, idPerfil]);
            return resultado;
        }
        catch(error){
            console.error('Error al comprobar si el perfil esta vinculado al cuidador: ', error);
            throw error;
        }
    }
}

module.exports = CuidadoresDao;