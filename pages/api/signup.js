import User from "../../models/User";
import connectMongo from "../../utils/db";

const handler = async (req, res) => {
    const { Identificador, Comite, names, email, rol, Primernombre, password } = req.body;
    if (req.method == 'POST') {
        try {
            await connectMongo();
            const userRes = await User.findOne({ email: email });
            if (userRes) {
                return res.status(400).json({ message: "Este correo ya fue registrado" });
            }
            const newUser = new User({
                Identificador,
                Comite,
                names,
                email,
                rol,
                Primernombre,
                password
            });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            return res.status(200).json({ message: "Usuario registrado" });
        } catch (error) {
            console.log("Something went wrong: ", error)
        }
    }
}

export default handler;
