import User from "../../models/User";
import { encryptPassword } from "../../utils/forms";

const handler = async (req, res) => {
    const { email, names, rol, password } = req.body;
    if (req.method == 'POST') {
        try {
            const user = await User.query("email").eq(email).exec();
            if(user['count'] > 0) {
                return res.status(400).json({message: "Este correo ya fue registrado"});
            }
            const newUser = new User({
                "email": email,
                "password": password,
                "rol": rol,
                "names": names
            });
            newUser.password = await encryptPassword(password);
            await newUser.save();

            return res.status(200).json({message: "Success"})
        } catch (error) {
            console.log("ERRORSOTE: ", error)
        }
    }
}

export default handler;
