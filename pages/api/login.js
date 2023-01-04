import { GetUserByEmail } from "../../utils/dynamoOps";
import { matchPassword } from "../../utils/forms";

const handler = async (req, res) => {
    const { user } = req.body;
    let _user = null;
    if (req.method == 'POST') {
        console.log(user)
        try {
            const usuario = await GetUserByEmail("email-index", "email", user.email);
            if(usuario['count'] === 0) {
                return res.status(404).json({message: "Usuario o contraseña incorrectos"});
            }
            _user = {
                user: {
                    id: usuario['Items'][0].id,
                    email: usuario['Items'][0].email,
                    names: usuario['Items'][0].names,
                    rol: usuario['Items'][0].rol
                }
            }
            const passwordDoesMatch = await matchPassword(user.password, usuario['Items'][0].password);
            if (passwordDoesMatch) {
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
