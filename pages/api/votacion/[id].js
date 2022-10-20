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
            const tipo = id.split("=")[0];
            const _id = id.split("=")[1];
            console.log(tipo);
            console.log(_id);
            try {
                await Producto.findByIdAndUpdate(
                    _id,
                    tipo === 'like' ? {$set: {likes: body}} : {$set: {dislikes: body}}
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
