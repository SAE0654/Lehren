import axios from "axios";

export const getOneUserByEmail = async (email) => {
    try {
        const { data } = await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/usuario/` + email);
        if(data.length > 0) {
            return true;
        } else {
            return false;
        }
        return data;
    } catch (error) {
        return [{
            message: "Ha ocurrido un errors"
        }]
    }
}