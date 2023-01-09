import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlinePassword } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import styles from "../styles/pages/login.module.scss";
import RestoreEmailComponent from '../components/RestoreEmail';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [logginIn, setlogginIn] = useState(false);
  const [ShowRestorePassword, setShowRestorePassword] = useState(false);

  const router = useRouter()

  useEffect(() => {
    if (router.query.error) {
      setLoginError(router.query.error)
      setCorreo(router.query.email)
    }
    document.querySelector("body").classList.add("login");
  }, [router])

  const handleLogin = (e) => {
    e.preventDefault();
    if(ShowRestorePassword) return;
    console.log("ENVIARS")
    setlogginIn(true);
    const toastId = toast.loading('Accediendo...');
    if (correo.trim().length === 0 || password.trim().length === 0) {
      setLoginError("Rellena todos los campos")
      return;
    }
    const email = correo.trim();
    signIn('credentials',
      {
        email,
        password,
        callbackUrl: `http://localhost:3000/`
      }
    ).then(() => {
      toast.dismiss(toastId);
      setlogginIn(false)
    });
  }

  return (<>
    <Head>
      <title>Inicia sesión</title>
      <meta name="description" content="Login app" />
      <link rel="icon" href="/favicon-33.ico" />
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
    <div className={styles.login_container}>
      <img src="/img/Logo_Vertical.svg" alt="" />
      <h1>Desarrollo</h1>
      <form onSubmit={(e) => handleLogin(e)}>
        <div className={styles.input_box}>
          <AiOutlineUser className={styles.icon} />
          <div className={styles.group}>
            <input
              name="email"
              type="text"
              onChange={(e) => setCorreo(e.target.value)}
              required
              autoComplete="off"
            />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Correo electrónico</label>
          </div>
        </div>
        <div className={styles.input_box}>
          <MdOutlinePassword className={styles.icon} />
          <div className={styles.group}>
            <input
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required />
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Contraseña</label>
          </div>
        </div>
        <div className="error">{loginError}</div>
        <button type="button" className={styles.anchor_btn} onClick={() => setShowRestorePassword(true)}>No puedo acceder a mi cuenta</button>
        <input type="submit" value="Acceder" className="login_btn" disabled={logginIn} />
      </form>
    </div>
    { ShowRestorePassword ? <RestoreEmailComponent setShowRestorePassword={setShowRestorePassword} /> : null}
  </>
  )
}
