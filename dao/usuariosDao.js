const pool = require('../config/conexionbbdd');

class UsuariosDao {
    constructor() { }

    async leerUsuarioId(id) {
        try {
            const resultado = await pool.query('SELECT * FROM Usuarios WHERE id = ?', [id]);
            return resultado[0];
        }
        catch (error) {
            console.error('ERROR[UsuariosDao]: buscar usuario por ID: ', error);
            throw error;
        }
    }

    async leerUsuariosCuidador(idCuidador) {
        try {
            const usuarios = await pool.query('SELECT Usuarios.nombre, Usuarios.id, i.imagen, i.mimetype FROM Usuarios JOIN Cuidadores_Usu ON Usuarios.id = Cuidadores_Usu.id_usuario LEFT JOIN ImgPerfil i ON i.id_usuario = Cuidadores_Usu.id_usuario WHERE Cuidadores_Usu.id_cuidador = ?', [idCuidador]);
            return usuarios[0];
        }
        catch (error) {
            console.error('ERROR[UsuariosDao]: buscar usuarios por Id del cuidador', error);
        }
    }

    async login(usuario) {
        try{
            const [u] = await pool.query('SELECT * FROM Usuarios WHERE usuario = ?', [usuario.usuario]);
            return u[0];
        }
        catch(error){
            console.error('ERROR[UsuariosDao]: al hacer login: ', error);
        }
    }

    async leerUsuario(usuario) {
        try {
            const [usu] = await pool.query('SELECT * FROM Usuarios WHERE usuario = ?', [usuario]);
            return usu;
        }
        catch (error) {
            console.error('Error al buscar cuidador por Usuario: ', error);
            throw error;
        }
    }

    async registrarUsuario(usuario) {
        try {
            const [resultado] = await pool.query('INSERT INTO Usuarios (nombre, usuario, contraseña)  VALUES (?, ?, ?)', [usuario.nombre, usuario.usuario, usuario.password]);
            const [r] = await pool.query('INSERT INTO Config (id_usuario) VALUES (?)', [resultado.insertId]);
            return resultado;
        }
        catch (error) {
            console.error('Error al registrar un Cuidador: ', error);
            throw error;
        }
    }

    async realcionCuidador(usuarioId, cuidadorId){
        try{
            const [resultado] = await pool.query('INSERT INTO Cuidadores_Usu (Id_cuidador, Id_usuario)  VALUES (?, ?)', [cuidadorId, usuarioId]);
            return resultado;
        }
        catch(error){
            console.error('Error al vincular un usuario a un cuidador: ', error);
            throw error;
        }
    }

    async imagenUsuario(imagen) {
        try{
            let [resultado] = await pool.query('INSERT INTO ImgPerfil (imagen, mimetype, id_usuario) VALUES (?, ?, ?)', [imagen.imagen, imagen.mimetype, imagen.id_usuario]);
            return resultado.insertId;
        }
        catch(error){
            console.error('Error al añadir una imagen de perfil: ', error);
            throw error;
        }
    }
};



module.exports = UsuariosDao;