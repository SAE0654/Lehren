import User from "../../models/User";
import connectMongo from "../../utils/db";

const handler = async (req, res) => {
    const { user } = req.body;
    let _user = null;
    if (req.method == 'POST') {
        console.log("Login")
        try {
            await connectMongo();
            const userRes = await User.findOne({ email: user.email });
            _user = {
                user: {
                    email: userRes.email,
                    names: userRes.names,
                    username: userRes.Primernombre,
                    rol: userRes.rol,
                    comite: userRes.Comite
                }
            };
            const passwordsTheSame = await userRes.matchPassword(user.password);
            if (passwordsTheSame) {
                return res.status(200).json(_user);
            } else {
                return res.status(404).json({ message: "Credenciales incorrectas" });
            }
        } catch (error) {
            console.log("Something went wrong: ", error)
        }

        return _user
            ? res.status(200).json(_user)
            : res.status(404).json({ message: "Clave o corrreo incorrectos" });
    }
}

export default handler;
