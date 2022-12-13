import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import styles from "../../../styles/pages/ventas.module.scss";
import { sessionHasExpired } from '../../../utils/forms';
import { NavLink } from '../../../components/NavLink';

export default function ResultadoView() {
    const router = useRouter();
    const [Producto, setProducto] = useState(null);
    // Función de cambios sin guardar

    const { nombre } = router.query;
    const { data: session } = useSession();

    useEffect(() => {
        getNombre();
        if (!Producto) {
            getProductoByNombre();
        }
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add("consultas_bg");
        sessionHasExpired();
    }, []);

    const getNombre = () => {
        if (typeof nombre === 'undefined') {
            nombre = localStorage.getItem("Nombre");
        }
        localStorage.setItem("Nombre", nombre);
    }

    const getProductoByNombre = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}api/producto/` + nombre)
            .then((res) => {
                setProducto(res.data);
                if(res.data.status === "No aprobado" || res.data.status === "Aprobado") {
                    redirect(res.data.nombre)
                }
            });
    }

    const redirect = (lNombre) => router.push('/act/stage/resultado/' + lNombre)

    if (!Producto) {
        return <h1>Cargando...</h1>
    }

    return <>
        <Head>
            <title>Etapa de validación | {!session ? 'Cargando...' : session.user.names}</title>
            <meta name="description" content="Login app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            <div className={styles.main_content} style={{ transform: 'translate(0%, -40%)', maxHeight: '1000px' }}>
                <div className={styles.box_container}>
                    <h1 className={styles.t_container} style={{ marginTop: "10em" }}>Etapa de resultados</h1>
                    <div className={styles.info_container} style={{ flexDirection: "column" }}>
                        <div className={styles.info_box_step2}>
                            <h2 className={styles.title}>Datos de la etapa de registro</h2>
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
                        <div className={styles.info_box_step2}>
                            <h2 className={styles.title}>Datos de la etapa de validación</h2>
                            <p><b>Prioridad: </b></p>
                            <p className={styles.right_border}>{Producto.prioridad}</p>
                            <p><b>Objetivos: </b></p>
                            <p className={styles.right_border}>{Producto.objetivo.length === 0 ? "Sin objetivos" : Producto.objetivo.map((item, index) => (item + ((index + 1) >= Producto.objetivo.length ? "." : ", ")))}</p>
                            <p className={styles.last_row}><b>Herramientas de validación:</b></p>
                            {Producto.instrumentoValidacion === null ?
                                <p className={styles.right_border}>No se han seleccionado instrumentos de validación</p> :
                                <p className={styles.right_border}>
                                    {Producto.instrumentoValidacion.length > 0
                                    ? Producto.instrumentoValidacion.map((tool, index) => (Producto.instrumentoValidacion.length - 1) === index ? (index +1) + " .-" + tool.nombre + ". " : (index +1) + " .-" + tool.nombre + ", ")
                                    : null}
                                </p>}
                            <p><b>Comentarios generales: </b></p>
                            <p className={styles.right_border}>{Producto.generalComments}</p>
                            <p><b>Fecha de ejecución de la actividad: </b></p>
                            <p className={styles.right_border}>{Producto.fechaEjecucion}</p>
                            <p><b>Fecha de entrega de resultados: </b></p>
                            <p className={styles.right_border}>{Producto.fechaEntrega}</p>
                        </div>
                    </div>
                    <br />
                    <button>
                        <NavLink href={"/act/stage/resultado/" + Producto.nombre} style={{ color: "#fff" }}>Ir al último paso</NavLink>
                    </button>
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
