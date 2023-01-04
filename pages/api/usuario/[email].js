import { GetUserByEmail } from "../../../utils/dynamoOps";

const handler = async (req, res) => {
    const { email } = req.query;
    switch (req.method) {
        case 'GET':
            try {
                const usuario = await GetUserByEmail("email-index", "email", email);
                if(usuario['count'] === 0) {
                    return res.status(404).json({message: "Usuario no encontrado"});
                }
                return res.status(200).json(usuario);
            } catch (error) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
        default:
            return res.status(500).json({ message: 'No autorizado' });
    }

}

export default handler;