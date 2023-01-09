import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from "../../styles/restorepassword.module.scss";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import Swal from 'sweetalert2/dist/sweetalert2';
const bcrypt = require('bcryptjs');

let _i = 0; // controlador

const RestorePassword = () => {
  const [User, setUser] = useState(null);
  const [Password1, setPassword1] = useState(null);
  const [Password2, setPassword2] = useState(null);

  const error = useRef(null);

  const router = useRouter();
  const { query } = router;
  useEffect(() => {
    if (typeof query.id === "undefined") {
      return;
    }
    console.log(query.id.split("=").length)
    if (query.id.split("=").length <= 1 || query.id.split("=").length >= 3) {
      Swal.fire({
        title: 'Enlace no válido',
        text: 'Si tienes problemas, contáctanos',
        icon: 'info',
        confirmButtonText: 'De acuerdo'
      })
      redirect();
      return;
    }
    if (new Date().getTime() >= query.id.split("=")[1]) {
      Swal.fire({
        title: 'Enlace expirado',
        text: 'Lo sentimos, este enlace ha expirado',
        icon: 'info',
        confirmButtonText: 'De acuerdo'
      })
      redirect();
      return;
    }
    getUserByEmail();
    _i++;
  }, [query]);

  const getUserByEmail = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}api/usuario/` + query.id.split("=")[0])
      .then(({ data }) => {
        if (data['Count'] === 0) {
          redirect();
          return;
        }
        setUser(data[0]);
      });
  }

  const updatePassword = async (e) => {
    e.preventDefault();

    if (new Date().getTime() >= query.id.split("=")[1]) {
      redirect();
      return;
    }

    if (Password1 === null || Password2 === null) {
      toast.info("Rellena todos los campos");
      return;
    }

    if (Password1.trim() === "" || Password2.trim() === "") {
      toast.info("Debes escribir algo para continuar");
      return;
    }

    if (Password1 !== Password2) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const encrypted = await bcrypt.genSalt(10);
    bcrypt.hash(Password1, encrypted)
      .then(async (res) => {
        User.password = res;
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/usuario/` + User.id, {
          password: User.password,
          rol: User.rol
        })
          .then(() => {
            Swal.fire({
              title: 'Éxito',
              text: 'Tu contraseña ha sido actualizada con éxito',
              icon: 'success',
              confirmButtonText: 'Cerrar'
            })
            redirect();
          }).catch(() => {
            toast.error("Ocurrió un error");
          })
      });
  }

  const validatePassword = (password) => {
    if (password.length < 7) {
      error.current.innerHTML = `<li>La contraseña debe contener al menos 7 caracteres<li>`;
      return;
    }
    if (password.search(/[a-z]/) < 0) {
      error.current.innerHTML = `<li>La contraseña debe contener al menos una minúscula<li>`;
      return;
    }
    if (password.search(/[0-9]/) < 0) {
      error.current.innerHTML = `<li>La contraseña debe contener al menos un número<li>`;
      return;
    }
    error.current.innerHTML = "";
    setPassword1(password);
  }

  const redirect = () => router.push("/");

  if (User === null) {
    return <h1>Cargando...</h1>
  }

  return <>
    <Head>
      <title>Restaurar contraseña</title>
      <meta name="description" content="Start app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark" />
    <div className={styles.page_container}>
      <form onSubmit={(e) => updatePassword(e)}>
        <h1>RESTAURAR CONTRASEÑA <span>Hola, {User.names}, este enlace expirará en 15 minutos</span></h1>
        <div className={styles.error} ref={error}>Debes</div>
        <input type="password" placeholder="Nueva contraseña" onChange={(e) => validatePassword(e.target.value)} />
        <input type="password" placeholder="Repetir contraseña" onChange={(e) => setPassword2(e.target.value)} />
        <input type="submit" value="Actualizar" />
      </form>
    </div>
  </>
}

export default RestorePassword
