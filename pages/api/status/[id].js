import Producto from "../../../models/Producto";
import connectMongo from "../../../utils/db";

const handler = async (req, res) => {
    const body = req.body;
    const { id } = req.query;
    await connectMongo();
    switch (req.method) {
        case 'GET':
            return res.status(500).json({ message: 'No autorizado' });
        case 'POST':
            return res.status(500).json({ message: 'No autorizado' });
        case 'PUT':
            try {
                await Producto.findByIdAndUpdate(
                    id,
                    { $set: { status: body.status } }
                );
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
