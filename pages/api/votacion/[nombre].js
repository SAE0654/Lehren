import Producto from "../../../models/Producto";
import { VoteProduct } from "../../../utils/dynamoOps";

const handler = async (req, res) => {
    const body = req.body;
    const { nombre } = req.query;
    switch (req.method) {
        case 'PUT':
            const tipo = nombre.split("=")[0];
            const _nombre = nombre.split("=")[1];
            try {
                await VoteProduct(_nombre, tipo, body);
                return res.status(200).json({ message: 'Actualizado con éxito' });
            } catch (error) {
                console.log(error)
            }
            return res.status(401).json({ message: 'Error al actualizar' });
        case 'DELETE':
            return res.status(500).json({ message: 'No autorizado' });
    }

}

export default handler;
