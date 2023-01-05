import User from "../../../models/User";
import { GetUserByEmail, UpdatePassword } from "../../../utils/dynamoOps";

const handler = async (req, res) => {
    const { email } = req.query;
    switch (req.method) {
        case 'GET':
            if (email.length >= 23) { // Este es un Id
                const user = await User.query("id").eq(email).exec();
                delete user[0].password;
                return res.status(200).json(user);
            } else { // Este es un correo
                try {
                    const usuario = await GetUserByEmail("email-index", "email", email);
                    if (usuario['count'] === 0) {
                        return res.status(404).json({ message: "Usuario no encontrado" });
                    }
                    return res.status(200).json(usuario);
                } catch (error) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }
            }
        case 'PUT':
            if(email.length >= 23) { // Si es Id, es actualización de contraseña
                try {
                    await UpdatePassword(email, req.body.password, req.body.rol);
                    return res.status(200).json({message: "Éxito"});
                } catch (error) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }
            }
        default:
            return res.status(500).json({ message: 'No autorizado' });
    }

}

export default handler;