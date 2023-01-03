import axios from "axios";
import { useState } from "react";
// FUNCIONES EXTERNAS
import { getOneUserByEmail } from "../services/usuarios";
// ESTILOS
import styles from "../styles/restorepassword.module.scss";
import Swal from 'sweetalert2/dist/sweetalert2';
import { toast } from "react-toastify";

export default function RestoreEmailComponent({setShowRestorePassword}) {
    const [Email, setEmail] = useState(null);

    const sendEmail = async () => {
        if (Email === null) {
            toast.error("Introduce un correo");
            return;
        }
        const email = Email.trim();
        console.log(email)
        if (email.split("@").length === 1) {
            toast.error("Correo no válido");
            return;
        }
        const thisUserExist = await getOneUserByEmail(email);
        if (thisUserExist) {
            // await axios.post("/api/mail/restore-password", {
            //     email: email
            // }).then((res) => {
            //     console.log("Éxito: ", res);
            // }).catch((err) => {
            //     console.log("Error: ", err)
            // })
        }
        Swal.fire({
            title: 'Éxito',
            text: 'Si el correo está registrado se te mandará un código de restauración',
            icon: 'success',
            confirmButtonText: 'De acuerdo'
        }
        )
        setEmail(null);
    };

    return <div className={styles.container}>
        <button onClick={() => setShowRestorePassword(false)}>Cerrar ventana</button>
        <form>
            <p>Introduce la dirección del correo electrónico registrado</p>
            <span>Se te enviará un correo desde donde podrás restaurar tu contraseña</span>
            <input type="email" name="email" id="email" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} defaultValue={Email} />
            <button type="button" onClick={() => sendEmail()}>Enviar correo</button>
        </form>
    </div>
}
