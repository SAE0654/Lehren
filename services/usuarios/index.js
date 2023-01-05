import axios from "axios";

export const getOneUserByEmail = async (email) => {
    try {
        const { data } = await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/usuario/` + email);
        return data.Items;
    } catch (error) {
        return []
    }
}

export const getOneUserById = async (id) => {
    try {
        const { data } = await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/usuario/` + id);
        return data.Items;
    } catch (error) {
        return []
    }
}
