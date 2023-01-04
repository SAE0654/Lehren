import User from "../../../models/User";
import { UpdateUserField } from "../../../utils/dynamoOps";

const handler = async (req, res) => {
    const body = req.body;
    const { nombre } = req.query;
    switch (req.method) {
        case 'GET':
            try {
                const nombreCapitalizado = nombre[0].toUpperCase() + nombre.substring(1); // Para que halle coincidencias mejores
                const user = await User.scan("names").contains(nombreCapitalizado).exec(); // Scan no es la mejor opción, pero la BD no es enorme
                if (user['count'] === 0) {
                    const user = await User.scan("email").contains(nombre.toLowerCase()).exec();
                    delete user.password;
                    return res.status(200).json(user);
                }
                return res.status(200).json(user);
            } catch (error) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
        case 'PUT':
            try {
                await UpdateUserField(body.email, body.rol, body.password, body.names, nombre); // Aquí nombre = campos a cambiar []
                return res.status(200).json({ message: 'Usuario actualizado con éxito' });
            } catch (error) {
                console.log(error)
            }
            return res.status(401).json({ message: 'Error al actualizar' });
        case 'DELETE':
            try {
                await User.findByIdAndDelete(nombre);
                return res.status(200).json({ message: 'Usuario eliminado' });
            } catch (error) {
                return res.status(401).json({ message: 'Error al eliminar' });
            }
        default:
            return res.status(500).json({ message: 'No autorizado' });
    }

}

export default handler;
