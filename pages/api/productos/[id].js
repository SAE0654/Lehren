import Producto from "../../../models/Producto";
import connectMongo from "../../../utils/db";

const handler = async (req, res) => {
    const body = req.body;
    const { id } = req.query;
    await connectMongo();
    switch (req.method) {
        case 'GET':
            if (id.length > 10) { // Es un Id de mongo
                try {
                    const producto = await Producto.findById(id);
                    return res.status(200).json(producto);
                } catch (error) {
                    console.log("Error: ", error);
                }
            } else {
                try { // El id aquí representa en realidad la institución
                    const producto = await Producto.find({institucion: id});
                    return res.status(200).json(producto);
                } catch (error) {
                    console.log("Error: ", error);
                }
            }
            return res.status(404).json({ message: "Not found" });
        case 'POST':
            const newProduct = new Producto(body);
            console.log(body)
            const productExists = await Producto.find({ nombre: body.nombre });
            if (productExists.length >= 1) {
                return res.status(200).json({ message: 'Producto ya existente' })
            }
            try {
                await newProduct.save();
                return res.status(200).json(newProduct);
            } catch (error) {
                console.log("Error: ", error);
            }
            return res.status(401).json({ message: 'Error' });
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
