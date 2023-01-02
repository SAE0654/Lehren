import Head from 'next/head';
import { AiOutlineFileAdd, AiOutlineFileSearch } from "react-icons/ai";
import { TbDeviceAnalytics } from "react-icons/tb"
import { BsFolderPlus } from "react-icons/bs"
import { MdPersonAdd } from "react-icons/md";
import { NavLink } from '../components/NavLink';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ADMIN, STAFF } from '../utils/roles';
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
    document.querySelector("body").className = 'menu';
    sessionHasExpired();
  }, []);

  const setRolInterface = () => {
    switch (data.user.rol) {
      case 'administrador':
        ADMIN[0].icono = <AiOutlineFileAdd className="icon_button" />;
        ADMIN[1].icono = <AiOutlineFileSearch className="icon_button" />;
        ADMIN[2].icono = <AiOutlineFileSearch className="icon_button" />;
        ADMIN[3].icono = <MdPersonAdd className="icon_button" />
        ADMIN[4].icono = <TbDeviceAnalytics className="icon_button" />
        setInterface(ADMIN);
        break;
      case 'staff':
        STAFF[1].icono = <AiOutlineFileSearch className="icon_button" />;
        STAFF[0].icono = <AiOutlineFileSearch className="icon_button" />;
        STAFF[2].icono = <BsFolderPlus className="icon_button" />;
        setInterface(STAFF);
        break;
      case 'docente':
        STAFF[1].icono = <AiOutlineFileSearch className="icon_button" />;
        STAFF[0].icono = <AiOutlineFileSearch className="icon_button" />;
        STAFF[2].icono = <BsFolderPlus className="icon_button" />;
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
