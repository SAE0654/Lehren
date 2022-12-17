import Product from "../../../models/Producto";
import { DeleteProductoByName, GetProductosByIndexDB, UpdateComment, UpdateResponsable } from "../../../utils/dynamoOps";

const handler = async (req, res) => {
    const body = req.body;
    const { id } = req.query;
    switch (req.method) {
        case 'GET':
            try {
                const producto = await GetProductosByIndexDB('institucion-index', 'institucion', id); // El id aquí representa en realidad la institución (artek, sae)
                return res.status(200).json(producto['Items']);
            } catch (error) {
                console.log("Error: ", error);
            }
            return res.status(404).json({ message: "Not found" });
        case 'POST':
            try {
                const producto = await Product.query("nombre").eq(body.nombre).exec();
                if (producto['count'] > 0) {
                    return res.status(400).json({ message: "Este producto ya fue registrado" });
                }
                const newProduct = new Product(body);
                try {
                    await newProduct.save();
                    return res.status(200).json(newProduct);
                } catch (error) {
                    console.log("Error: ", error);
                    return res.status(400).json({message: 'Error inesperado'})
                }
            } catch (error) {
                return res.status(400).json({ message: 'Ha ocurrido un error inesperado. Recarga la página' });
            }
        case 'PUT':
            try {
                const tipoDeOperacion = id.split("=")[1];
                if (tipoDeOperacion === "updateResponsable") {
                    await UpdateResponsable(id.split("=")[0], req.body.responsable, req.body.lastUpdate)
                }
                if (tipoDeOperacion === "updateComment") {
                    await UpdateComment(req.body.nombre, req.body.comentarios[0]);
                }
                return res.status(200).json({ message: 'Actualizado con éxito' });
            } catch (error) {
                return res.status(401).json({ message: 'Error al actualizar' });
            }
        case 'DELETE':
            try {
                await DeleteProductoByName(id); // Aquí el id = nombre
                return res.status(200).json({ message: 'Eliminado con éxito' });
            } catch (error) {
                console.log(error);
            }
        default:
            return res.status(500).json({ message: 'No autorizado' });
    }

}

export default handler;
