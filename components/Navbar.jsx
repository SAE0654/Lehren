import { useSession, signOut } from "next-auth/react";
// Estilos
import styles from "../styles/pages/navbar.module.scss";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlinePoweroff, AiFillHome } from "react-icons/ai";
// Custom hooks
import { NavLink } from './NavLink';
import { ADMIN, STAFF } from "../utils/roles";
import { useEffect, useState } from "react";

function Nav() {
    const [ShowConsultar, setShowConsultar] = useState(false);
    const [ShowRegistrar, setShowRegistrar] = useState(false);
    const { data } = useSession();

    return (
        data ? (
            <nav className={styles.navbar}>
                <img src="/img/Logo_horizontal.svg" alt="" />
                <ul data-animation="center">
                    <li>
                        <NavLink href="/" exact>
                            <AiFillHome /> &nbsp;&nbsp;
                            Inicio
                        </NavLink>
                        <div>
                            <NavLink href="/vw/catalogue" exact>
                                Catálogo de validación
                            </NavLink>
                        </div>
                        <div>
                            <button className={styles.btn_sub} href="#" onClick={() => (setShowConsultar(!ShowConsultar), setShowRegistrar(false))}>
                                Consultar
                                <ul className={styles.submenu_consultas} style={ShowConsultar ? { display: "flex" } : { display: "none" }}>
                                    <li>
                                        <NavLink href="/vw/query/sae" exact>
                                            Consultar SAE
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink href="/vw/query/artek" exact>
                                            Consultar ARTEK
                                        </NavLink>
                                    </li>
                                </ul>
                            </button>
                        </div>
                        <div>
                            <button className={styles.btn_sub} href="#" onClick={() => (setShowRegistrar(!ShowRegistrar), setShowConsultar(false))}>
                                Registrar
                                <ul className={styles.submenu_consultas} style={ShowRegistrar ? { display: "flex" } : { display: "none" }}>
                                    <li>
                                        <NavLink href="/act/register" exact>
                                            Registrar producto
                                        </NavLink>
                                    </li>
                                    {
                                        data.user.rol === "administrador" ? 
                                        <li>
                                        <NavLink href="/act/signup" exact>
                                            Registrar usuario
                                        </NavLink>
                                    </li>
                                    : null
                                    }
                                </ul>
                            </button>
                        </div>
                    </li>
                    <li>
                        <button>
                            <AiOutlineUser />
                        </button>
                        <ul>
                            <li>
                                <button onClick={() => (signOut(), localStorage.removeItem('L'))}>
                                    <AiOutlinePoweroff />
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>)
            : null
    );
}

export default Nav;