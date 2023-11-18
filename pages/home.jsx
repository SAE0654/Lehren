import Head from 'next/head';
import { AiOutlineFileSearch, AiOutlineFolderAdd } from "react-icons/ai";
import { MdPersonAdd } from "react-icons/md";
import { NavLink } from '../components/NavLink';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ADMIN, COMITE, STAFF } from '../utils/roles';
import Layout from '../components/Layout';
import styles from "../styles/pages/inicio.module.scss";
import { sessionHasExpired } from '../utils/forms';

export default function Home() {
  const [Interface, setInterface] = useState([]);
  const { data } = useSession();

  useEffect(() => {
    if (!data) return;
    setRolInterface();
    document.querySelector("body").className = '';
    document.querySelector("body").classList.add("menu");
    sessionHasExpired();
  }, []);

  const setRolInterface = () => {
    switch (data.user.rol) {
      case 'super-admin':
        ADMIN[0].icono = <AiOutlineFolderAdd className="icon_button" />;
        ADMIN[1].icono = <AiOutlineFileSearch className="icon_button" />;
        ADMIN[2].icono = <AiOutlineFileSearch className="icon_button" />;
        ADMIN[3].icono = <MdPersonAdd className="icon_button" />
        setInterface(ADMIN);
        break;
      case 'administrador':
        ADMIN[0].icono = <AiOutlineFolderAdd className="icon_button" />;
        ADMIN[1].icono = <AiOutlineFileSearch className="icon_button" />;
        ADMIN[2].icono = <AiOutlineFileSearch className="icon_button" />;
        ADMIN[3].icono = <MdPersonAdd className="icon_button" />
        setInterface(ADMIN);
        break;
      case 'comité':
        COMITE[0].icono = <AiOutlineFolderAdd className="icon_button" />;
        COMITE[1].icono = <AiOutlineFileSearch className="icon_button" />;
        COMITE[2].icono = <AiOutlineFileSearch className="icon_button" />;
        setInterface(COMITE);
        break;
      case 'staff':
        STAFF[0].icono = <AiOutlineFolderAdd className="icon_button" />;
        setInterface(STAFF);
        break;
      case 'docente':
        STAFF[0].icono = <AiOutlineFolderAdd className="icon_button" />;
        setInterface(STAFF);
        break;
      default:
        console.error("ALGO SALIÓ TERRIBLEMENTE MAL. COMPRA OTRA PC")
        break;
    }
  }

  return (
    <>
      <Head>
        <title>Inicio</title>
        <meta name="description" content="Start app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className={styles.quest_next}>
          <h1>Inicio</h1>
          <div className={styles.options}>
            {
              Interface.map((item, index) => (
                <div key={index}>
                  <NavLink href={item.link}>
                    {item.icono}
                    <span>{item.texto}</span>
                  </NavLink>

                </div>
              ))
            }
          </div>
        </div>
      </Layout>
    </>
  )
}
