import Producto from "../../../models/Producto";
import { GetProductosByIndexDB } from "../../../utils/dynamoOps";

const handler = async (req, res) => {
    const body = req.body;
    const { id } = req.query;
    switch (req.method) {
        case 'GET':
            if (id === "all") {
                const producto = await Producto.find();
                return res.status(200).json(producto);
            }
            if (id.length > 15) { // Es un Id de Dynamo
                try {
                    const producto = await Producto.findById(id);
                    return res.status(200).json(producto);
                } catch (error) {
                    console.log("Error: ", error);
                }
            } else {
                try {
                    const producto = await GetProductosByIndexDB('institucion-index', 'institucion', id); // El id aquí representa en realidad la institución (artek, sae)
                    return res.status(200).json(producto['Items']);
                } catch (error) {
                    console.log("Error: ", error);
                }
            }
            return res.status(404).json({ message: "Not found" });
        case 'POST':
            try {
                const producto = await Producto.query("nombre").eq(body.nombre).exec();
                if (producto['count'] > 0) {
                    return res.status(400).json({ message: "Este producto ya fue registrado" });
                }
                const newProduct = new Producto(body);
                try {
                    await newProduct.save();
                    return res.status(200).json(newProduct);
                } catch (error) {
                    console.log("Error: ", error);
                }
            } catch (error) {
                return res.status(400).json({ message: 'Ha ocurrido un error inesperado. Recarga la página' });
            }
        case 'PUT':
            try {
                await Producto.findByIdAndUpdate(
                    id,
                    req.body
                );
                return res.status(200).json({ message: 'Actualizado con éxito' });
            } catch (error) {
                console.log(error)
            }
            return res.status(401).json({ message: 'Error al actualizar' });
        case 'DELETE':
            try {
                await Producto.findByIdAndDelete(id);
                return res.status(200).json({ message: 'Eliminado con éxito' });
            } catch (error) {
                console.log(error);
            }
        default:
            return res.status(500).json({ message: 'No autorizado' });
    }

}

export default handler;
