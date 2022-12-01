import Head from "next/head"
import Nav from "./Navbar";
import styles from "../styles/pages/navbar.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineBars } from "react-icons/ai";
import { useState } from "react";

let showNavbar = false;

const Layout = (props) => {
    const [showNavbar, setShowNavbar] = useState(false);

    return <div>
        <Head>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />
        </Head>
        <div className={styles.bar_mobile} onClick={() => setShowNavbar(!showNavbar)}>
            <AiOutlineBars className={styles.open_icon} />
        </div>
        <Nav ShowNavbar={showNavbar} />
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
        <main>
            {props.children}
        </main>
    </div>
}

export default Layout;
