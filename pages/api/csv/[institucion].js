import Producto from "../../../models/Producto";
import { GetProductosByIndexDB, updateResponsable } from "../../../utils/dynamoOps";

const handler = async (req, res) => {
    const body = req.body;
    const { institucion } = req.query;
    switch (req.method) {
        case 'GET':
            if (institucion === "all") {
                let productos = [];
                const productosARTEK = await GetProductosByIndexDB('institucion-index', 'institucion', 'artek');
                const productosSAE = await GetProductosByIndexDB('institucion-index', 'institucion', 'sae');
                productos = [...productos, ...productosARTEK['Items']];
                productos = [...productos, ...productosSAE['Items']];
                return res.status(200).json(productos);
            }
            const productos = await GetProductosByIndexDB('institucion-index', 'institucion', institucion);
            return res.status(200).json(productos['Items']);
        default:
            return res.status(401).json({ message: 'No autorizado' });
    }

}

export default handler;
