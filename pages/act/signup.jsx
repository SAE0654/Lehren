import Head from 'next/head'
import { useEffect, useState } from 'react'
import Layout from "../../components/Layout";
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { toast } from 'react-toastify';
import { AiOutlineMail, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router';
import styles from "../../styles/pages/login.module.scss";
import { makeid, sessionHasExpired } from '../../utils/forms';
import Search from '../../components/Search';
import { useSession } from "next-auth/react"

export default function SignUp() {
    const [Data, setData] = useState({});
    const [Password, setPassword] = useState(null);
    // Función de cambios sin guardar
    const [notSaved, setNotSaved] = useState(false);
    const [OnChangeRoute, setOnChangeRoute] = useState(false);
    const [NextRoute, setNextRoute] = useState(null);
    const [GoToNext, setGoToNext] = useState(false);
    // Función de búsqueda
    const [IsSearching, setIsSearching] = useState(false);
    const Route = useRouter();
    const { data: session } = useSession()

    useEffect(() => {
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add('consultas_bg');
        sessionHasExpired();
    }, []);

    useEffect(() => {
        const beforeRouteHandler = (url) => {
            if (url === Route.asPath) return;
            setOnChangeRoute(true);
            setNextRoute(url);
            if (!GoToNext) {
                Router.events.emit('routeChangeError');
                throw "Operación cancelada";
            }
        };
        if (notSaved) {
            Router.events.on('routeChangeStart', beforeRouteHandler);
        } else {
            Router.events.off('routeChangeStart', beforeRouteHandler);
        }
        return () => {
            Router.events.off('routeChangeStart', beforeRouteHandler);
        };
    }, [notSaved, GoToNext]);

    const registrarUsuario = (e) => {
        e.preventDefault();
        const payload = Object.entries(Data);
        if (Data.rol === 'default' || typeof Data.rol === 'undefined') {
            toast.error("Selecciona un rol");
            return;
        }
        if (payload.length <= 3) {
            toast.error("Rellena todos los campos");
            return;
        }
        if (!matchPasswords()) {
            toast.error("Las contraseñas no coinciden");
            return;
        };

        Data.id = makeid(23).toString();

        const toastId = toast.loading('Guardando...');
        axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}api/signup`, Data)
            .then(() => {
                toast.success("Usuario registrado");
                toast.dismiss(toastId)
                e.target.reset();
                setNotSaved(false);
            }).catch((err) => {
                toast.error(err.response.data.message);
                toast.dismiss(toastId);
            });
    }

    const matchPasswords = () => {
        if (Password === Data.password) return true;
        return false;
    }

    if(typeof session === 'undefined') return <h1>Cargando</h1>

    return (<>
        <Head>
            <title>Registro de usuario</title>
            <meta name="description" content="Login app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            <div className={styles.signup}>
                <div className={OnChangeRoute || IsSearching ? "wrapper_bg" : "wrapper_bg hide"} aria-hidden="true"></div>
                <div className={OnChangeRoute ? "window_confirm" : "window_confirm hide"}>
                    <h1 className="mini">¿Seguro que quieres salir? Perderás tu trabajo actual</h1>
                    <div className="cancel_continue">
                        <button onClick={() => (setGoToNext(true), Route.push(NextRoute))}>Continuar</button>
                        <button onClick={() => setOnChangeRoute(false)}>Cancelar</button>
                    </div>
                </div>
                {session.user.rol === 'administrador' ? <button className="btn_normal" onClick={() => setIsSearching(!IsSearching)}>Buscar usuario</button> : null}
                {IsSearching ?
                    <>
                        <Search />
                        <button className={"overWrapper " + styles.btn_search} onClick={() => setIsSearching(!IsSearching)}>
                            <AiOutlineClose />
                        </button>
                    </>
                    : null}
                <form onSubmit={(e) => registrarUsuario(e)}>
                    <br />
                    <img src="/img/Logo_Vertical.svg" alt="" />
                    <h1>Registro de usuario</h1>
                    <div className={styles.input_box}>
                        <AiOutlineMail className={styles.icon} />
                        <div className={styles.group}>
                            <input
                                name="email"
                                type="email"
                                onChange={(e) => (setData({ ...Data, [e.target.name]: e.target.value }), setNotSaved(true))}
                                required
                                autoComplete='off' />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Correo electrónico</label>
                        </div>
                    </div>
                    <div className={styles.input_box}>
                        <FaUsers className={styles.icon} />
                        <div className={styles.group}>
                            <select name="rol" onChange={(e) => (setData({ ...Data, [e.target.name]: e.target.value }), setNotSaved(true))}>
                                <option value="default">Seleccionar rol</option>
                                <option value="administrador">Administrador</option>
                                <option value="staff">Staff</option>
                                <option value="docente">Docente</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.input_box}>
                        <FaUserAlt className={styles.icon} />
                        <div className={styles.group}>
                            <input
                                name="names"
                                type="text"
                                onChange={(e) => (setData({ ...Data, [e.target.name]: e.target.value }), setNotSaved(true))}
                                required
                                autoComplete='off' />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Nombre completo</label>
                        </div>
                    </div>
                    <div className={styles.input_box}>
                        <RiLockPasswordFill className={styles.icon} />
                        <div className={styles.group}>
                            <input
                                name="password"
                                type="password"
                                onChange={(e) => (setData({ ...Data, [e.target.name]: e.target.value }), setNotSaved(true))}
                                required
                                autoComplete='off' />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Contraseña</label>
                        </div>
                    </div>
                    <div className={styles.input_box}>
                        <RiLockPasswordLine className={styles.icon} />
                        <div className={styles.group}>
                            <input
                                name="password2"
                                type="password"
                                onChange={(e) => (setPassword(e.target.value), setNotSaved(true))}
                                required
                                autoComplete='off' />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Repetir contraseña</label>
                        </div>
                    </div>
                    <input type="submit" value="Registrar" />
                </form>
            </div>

        </Layout>
    </>
    )
}


export async function getServerSideProps(ctx) {
    const _session = await getSession(ctx);

    if (!_session) return {
        redirect: {
            destination: '/',
            permanent: false
        }
    }

    return {
        props: {
        }
    }
}
