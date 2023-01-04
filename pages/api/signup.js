import User from "../../models/User";
import { GetUserByEmail } from "../../utils/dynamoOps";
import { encryptPassword } from "../../utils/forms";

const handler = async (req, res) => {
    const { id, email, names, rol, password } = req.body;
    if (req.method == 'POST') {
        try {
            const user = await GetUserByEmail("email-index", "email", email);
            if(user['Count'] > 0) {
                return res.status(400).json({message: "Este correo ya fue registrado"});
            }
            const newUser = new User({
                "id": id,
                "email": email,
                "password": password,
                "rol": rol,
                "names": names
            });
            newUser.password = await encryptPassword(password);
            await newUser.save();

            return res.status(200).json({message: "Success"})
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: 'Error al registrar' });
        }
    }
}

export default handler;
