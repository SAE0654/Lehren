import axios from "axios";

export const getProductosByInstitution = async (institucion) => {
    try {
        const { data } = await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + institucion);
        return data;
    } catch (error) {
        return [{
            message: "Ha ocurrido un error"
        }]
    }
}

export const getProductoByNombre = async (nombre) => {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}api/producto/` + nombre);
        return data;
    } catch (error) {
        return [{
            message: "Ha ocurrido un error"
        }]
    }
}

export const deleteProductoByNombre = async(nombre) => {
    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + nombre);
        return true;
    } catch (error) {
        return false;
    }  
}
