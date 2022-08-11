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
    const [Interface, setInterface] = useState([]);
    const [ShowConsultasSubMenu, setShowConsultasSubMenu] = useState(false)
    const { data } = useSession();

    useEffect(() => {
        if (!data) return;
        setRolInterface();
    }, [data]);

    const setRolInterface = () => {
        switch (data.user.rol) {
            case 'administrador':
                setInterface(ADMIN);
                break;
            case 'staff':
                setInterface(STAFF);
                break;
            case 'docente':
                setInterface(STAFF);
                break;
            default:
                break;
        }
    }

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
                        {
                            Interface.map((item, index) => (
                                <div key={index}>
                                    {
                                        item.texto === "Consultar" ?
                                            <button className={styles.btn_sub} href="#" onClick={() => setShowConsultasSubMenu(!ShowConsultasSubMenu)}>
                                                Consultar
                                                <ul className={styles.submenu_consultas} style={ShowConsultasSubMenu ? { display: "flex" } : { display: "none"}}>
                                                    <li>
                                                        <NavLink href={item.link + "sae"} exact>
                                                            {item.texto} SAE
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink href={item.link + "artek"} exact>
                                                            {item.texto} ARTEK
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </button>
                                            :
                                            <NavLink href={item.link} exact key={index}>
                                                {item.texto}
                                            </NavLink>
                                    }

                                </div>

                            ))
                        }
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