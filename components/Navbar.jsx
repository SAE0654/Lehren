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
    const { data } = useSession();

    useEffect(() => {
        if(!data) return;
        setRolInterface();
    }, [data]);

    const setRolInterface = () => {
        switch (data.user.rol) {
            case 'administrador':
                setInterface(ADMIN);
                break;
            case 'staff':
                setInterface(STAFF);
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
                            <NavLink href={item.link} exact key={index}>
                                {item.texto}
                            </NavLink>
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