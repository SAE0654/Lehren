import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import styles from "../../../styles/pages/ventas.module.scss";
import { getTimeStamp, sessionHasExpired } from '../../../utils/forms';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2/dist/sweetalert2';
import { NavLink } from '../../../components/NavLink';

export default function ValidacionView() {
    const router = useRouter();
    const [Producto, setProducto] = useState(null);
    // Función de cambios sin guardar

    const { nombre } = router.query;
    const { data: session } = useSession();

    useEffect(() => {
        getnombre();
        if (!Producto) {
            getProductoByNombre();
        }
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add("consultas_bg");
        sessionHasExpired();
    }, []);

    const getnombre = () => {
        if (typeof nombre === 'undefined') {
            nombre = localStorage.getItem("nombre");
        }
        localStorage.setItem("nombre", nombre);
    }

    const getProductoByNombre = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}api/producto/` + nombre)
            .then((res) => {
                setProducto(res.data);
                if (res.data.etapa === "Validación") {
                    redirect(res.data.nombre)
                }
            }).catch((res) => {
               toast.error(res.response.data.message);
            });
    }

    const redirect = (lnombre) => router.push('/act/stage/validacion/' + lnombre)

    const setStatus = async (Status) => {
        const producto = Producto;
        producto.status = Status === "Validación" ? "Elección" : "Revisión";
        producto.etapa = Status;
        if (Status === "Validación") {
            await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + nombre, producto,
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
        await Swal.fire({
            input: 'textarea',
            inputLabel: "Explica por qué el producto será puesto en Pendiente",
            inputValue: '',
            inputPlaceholder: "Comentario...",
            inputAttributes: {
                'aria-label': 'Escribe tu comentario aquí',
                maxlength: 1500
            },
            showCancelButton: true,
            confirmButtonText: 'Poner en Pendiente',
            cancelButtonText: 'Cancelar',
        }).then(async (res) => {
            if (res.isDismissed) return;
            if (res.value.trim().length === 0 && res.isConfirmed) {
                toast.warn("El comentario no puede estar vacío");
                return;
            }
            producto.comentarios = [{
                user: session.user.names,
                comentarios: res.value,
                createdAt: getTimeStamp()
            }];
            await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + nombre, producto,
                {
                    headers: {
                        accept: '*/*',
                        'Content-Type': 'application/json'
                    }
                }).then(() => {
                    router.push(`/vw/query/${Producto.institucion}`);
                }).catch(() => {
                    toast.error("Error al procesar");
                })
        })
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
                    <h1 className={styles.t_container} style={{ marginTop: "10em" }}>Etapa de propuesta</h1>
                    <div className={styles.info_container}>
                        <div className={styles.info_box_step2}>
                            <h2 className={styles.title}>Datos registrados</h2>
                            <p><b>Nombre del producto: </b></p>
                            <p className={styles.right_border}>{Producto.nombre}</p>
                            <p><b>Estatus: </b></p>
                            <p className={styles.right_border}>{Producto.status}</p>
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
                    <NavLink href={"/act/stage/validacion/" + Producto._id} style={{ color: "#fff" }} onClick={() => setStatus("Validación")}>Mandar a proceso de validación</NavLink>
                    <button onClick={() => setStatus("Pendiente")}>
                        Poner en pendiente
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
