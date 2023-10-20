import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlinePassword } from "react-icons/md";
import { toast } from 'react-toastify';
import styles from "../styles/pages/login.module.scss";

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [logginIn, setlogginIn] = useState(false)
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
        callbackUrl: `https://www.productoslehren.com/`
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
      <link rel="icon" href="/favicon.ico" />
    </Head>

      <div className={styles.login_container}>
        <img src="/img/Logo_Vertical.svg" alt="" />
        <h1>Inicia sesión</h1>
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
          <input type="submit" value="Acceder" className="login_btn" disabled={logginIn} />
        </form>
      </div>

  </>
  )
}
