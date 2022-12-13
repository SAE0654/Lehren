import Product from "../../../models/Producto";
import { UpdateStatus } from "../../../utils/dynamoOps";

const handler = async (req, res) => {
    const body = req.body;
    const { nombre } = req.query;
    switch (req.method) {
        case 'GET':
            try {
                const producto = await Product.query("nombre").eq(nombre).exec();
                return res.status(200).json(producto.toJSON()[0])
            } catch (error) {
                console.log(error)
                return res.status(400).json({message: "Ocurrió un error inesperado"});
            }
        case 'PUT':
            try {
                if(nombre.split("=")[0] === 'updateStatus') {
                    await UpdateStatus(nombre.split("=")[1], body); // nombre, status
                    return res.status(200).json({message: "Estatus actualizado con éxito"});
                }
                const updateProduct = new Product(body);
                await updateProduct.save();
                return res.status(200).json({message: "Actualizado con éxito"});
            } catch (error) {
                console.log(error)
                return res.status(400).json({message: "Ya valió :c"})
            }
        default:
            return res.status(500).json({ message: 'No autorizado' });
    }

}

export default handler;
