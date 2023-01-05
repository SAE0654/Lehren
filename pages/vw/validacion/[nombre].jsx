import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'

import Head from 'next/head';
import Layout from '../../../components/Layout';
import styles from "../../../styles/pages/ventas.module.scss";
import { sessionHasExpired } from '../../../utils/forms';

import { NavLink } from '../../../components/NavLink';
import { getProductoByNombre } from '../../../services/productos';
import CambiarStatusComponent from '../../../components/CambiarStatus';
import axios from 'axios';

export default function ValidacionView() {
    const router = useRouter();
    const [Producto, setProducto] = useState(null);
    // Función de cambios sin guardar

    const { nombre } = router.query;
    const { data: session } = useSession();

    useEffect(() => {
        getnombre();
        if (!Producto) {
            getProducto();
        }
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add('consultas_bg');
        sessionHasExpired();
    }, []);

    const getnombre = () => {
        if (typeof nombre === 'undefined') {
            nombre = localStorage.getItem("nombre");
        }
        localStorage.setItem("nombre", nombre);
    }

    const getProducto = async () => {
        const data = await getProductoByNombre(nombre);
        setProducto(data);
        if (data.etapa === "Validación") {
            redirect(data.nombre)
        }
    }

    const redirect = (lnombre) => router.push('/act/stage/validacion/' + lnombre);

    const setStatus = async (Status) => {
        if (Status === "Validación") {
            await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/producto/updateStatus=${nombre}`, ['Elección', 'Validación', 'Elección'], // nuevoStatus, etapa, statusAnterior
                {
                    headers: {
                        accept: '*/*',
                        'Content-Type': 'application/json'
                    }
                }).then(() => {
                    router.push(`/act/stage/validacion/${Producto.nombre}`);
                }).catch(() => {
                    toast.error("Error al procesar");
                })
            return;
        }
    }

    if (!Producto) {
        return <h1>Cargando...</h1>
    }

    return <>
        <Head>
            <title>Etapa de propuesta | {!session ? 'Cargando...' : session.user.names}</title>
            <meta name="description" content="Login app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            <div className={styles.main_content} style={{ transform: 'translate(0%, -40%)', maxHeight: '1000px' }}>
                <div className={styles.box_container}>
                    <h1 className={styles.t_container} style={{ marginTop: "13em" }}>Etapa de propuesta</h1>
                    <div className={styles.info_container}>
                        <div className={styles.info_box_step2}>
                            <h2 className={styles.title}>Datos registrados</h2>
                            <p><b>Nombre del producto: </b></p>
                            <p className={styles.right_border}>{Producto.nombre}</p>
                            <p><b>Estatus: </b></p>
                            <p className={styles.right_border}>{Producto.statusProducto}</p>
                            <p className={styles.last_row}><b>Tipo de oferta:</b></p>
                            <p className={styles.right_bottom_border}>{Producto.tipo}</p>
                            <p><b>Modalidad de oferta: </b></p>
                            <p className={styles.right_border}>{Producto.modalidad}</p>
                            <p><b>Institución: </b></p>
                            <p className={styles.right_border}>{Producto.institucion}</p>
                            <p><b>Persona o área que propone el producto: </b></p>
                            <p className={styles.right_border}>{Producto.quienPropone}</p>
                            <p><b>Razón o necesidad del producto: </b></p>
                            <p className={styles.right_border}>{Producto.razon}</p>
                            <p><b>A quién va dirigido: </b></p>
                            <p className={styles.right_border}>{Producto.poblacionObj}</p>
                            <p><b>Descripción general: </b></p>
                            <p className={styles.right_border}>{Producto.descripcion}</p>
                            <p className={styles.last_row}><b>RVOE: </b></p>
                            <p className={styles.right_bottom_border}>{Producto.RVOE === "on" ? "Tiene RVOE" : "No tiene RVOE"}</p>
                        </div>
                    </div>
                    <br />
                    <NavLink href={"/act/stage/validacion/" + Producto.nombre} style={{ color: "#fff" }} onClick={() => setStatus("Validación")}>Mandar a proceso de validación</NavLink>
                    <CambiarStatusComponent Producto={Producto}/>
                </div>
            </div>
        </Layout>
    </>
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
