import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from "../../styles/restorepassword.module.scss";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
const bcrypt = require('bcryptjs');

let _i = 0; // controlador

const RestorePassword = () => {
  const [User, setUser] = useState(null);
  const [Password1, setPassword1] = useState(null);
  const [Password2, setPassword2] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (_i === 0) {
      getUserByEmail();
    }
    _i++;
  }, []);


  const getUserByEmail = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}api/usuario/NHggxGHS1oCJRWNPDna8A1z`)
      .then(({ data }) => {
        setUser(data[0]);
      })
  }

  const updatePassword = async (e) => {
    e.preventDefault();

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
      .then((res) => {
        User.password = res;
      });

    await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/usuario/` + User.id, {
      password: User.password,
      rol: User.rol
    })
      .then(() => {
        toast.success("Contraseña actualizada");
        redirect();
      }).catch((res) => {
        toast.error("Ocurrió un error");
      })
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
        <input type="password" placeholder="Nueva contraseña" onChange={(e) => setPassword1(e.target.value)} />
        <input type="password" placeholder="Repetir contraseña" onChange={(e) => setPassword2(e.target.value)} />
        <input type="submit" value="Actualizar" />
      </form>
    </div>
  </>
}

export default RestorePassword
