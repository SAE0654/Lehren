import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
import Layout from '../../../components/Layout';
import styles from "../../../styles/pages/ventas.module.scss";
import { NavLink } from '../../../components/NavLink';
import { sessionHasExpired } from '../../../utils/forms';

export default function ViewProduct() {
  const router = useRouter();
  const [Producto, setProducto] = useState(null);

  const { id } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    getId();
    if (!Producto) {
      getProductoById();
    }
    document.querySelector("body").className = '';
        document.querySelector("body").classList.add("consultas_bg");
        sessionHasExpired();
  }, []);

  const getId = () => {
    if (typeof id === 'undefined') {
      id = localStorage.getItem("Id");
    }
    localStorage.setItem("Id", id);
  }

  const getProductoById = async () => {
    await axios.get(`https://lehren-productos.vercel.app/api/productos/` + id)
      .then((res) => {
        setProducto(res.data);
      });
  }

  if (!Producto) {
    return <h1>Cargando...</h1>
  }

  return <>
    <Head>
      <title>{!session ? 'Cargando...' : session.user.username} | Vista de datos </title>
      <meta name="description" content="Login app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <div className={styles.main_content} style={{transform: 'translate(0%, -40%)', maxHeight: '200vh'}}>
        <div className={styles.box_container}>
          <h1 className={styles.t_container}>Datos completos del producto</h1>
          <img src="/img/LOGO2.png" alt="" />
          <div className={styles.info_container}>
            <div className={styles.info_box}>
                <h2 className={styles.title}>Datos generales</h2>
                <p><b>Nombre del producto</b></p>
                <p className={styles.right_border}>{Producto.nombre}</p>
                <p><b>Tipo de oferta</b></p>
                <p className={styles.right_border}>{Producto.tipo}</p>
                <p><b>Modalidad</b></p>
                <p className={styles.right_border}>{Producto.modalidad}</p>
                <p><b>Área a la que se víncula</b></p>
                <p className={styles.right_border}>{Producto.areaV}</p>
                <p className={styles.last_row}><b>Persona que propone el producto:</b></p>
                <p className={styles.right_bottom_border}>{Producto.quienPropone}</p>
                <h2 className={styles.title2}>Análisis de mercado</h2>
                <p><b>Instrumentos de validación empleados:</b></p>
                <p className={styles.right_border}>{Producto.instrumentoValidacion}</p>
                <p><b>Datos que sustentan la propuesta:</b></p>
                <p className={styles.right_border}>{Producto.datosSustentan}</p>
                <p><b>Oferta frente a la que compite:</b></p>
                <p className={styles.right_border}>{Producto.competencia}</p>
                <p className={styles.last_row}><b>Mercado en el que incide:</b></p>
                <p className={styles.right_bottom_border}>{Producto.mercado}</p>
                <h2 className={styles.title3}>Análisis financiero</h2>
                <p><b>Enlace a ROI:</b></p>
                <p className={styles.right_border}>{Producto.ROI}</p>
                <p className={styles.last_row}><b>Comentarios adicionales:</b></p>
                <p className={styles.right_bottom_border}>{Producto.comentarios}</p>
                <h2 className={styles.title4}>Análisis académico</h2>
                <p><b>Razón y necesidad de la propuesta:</b></p>
                <p className={styles.right_border}>{Producto.razon}</p>
                <p><b>A quién va dirigido:</b></p>
                <p className={styles.right_border}>{Producto.poblacionObj}</p>
                <p><b>Descripción general:</b></p>
                <p className={styles.right_border}>{Producto.descripcion}</p>
                <p><b>Tiene RVOE:</b></p>
                <p className={styles.right_border}>{Producto.RVOE === 'on' ? 'Sí' : 'No'}</p>
                <p><b>Institución:</b></p>
                <p className={styles.right_border}>{Producto.institucion.toUpperCase()}</p>
                <p><b>Aprobado:</b></p>
                <p className={styles.right_border}>{Producto.aprobado === 'on' ? 'Sí' : 'No'}</p>
                {
                    Producto.aprobadoPor === 'NP' ? null : 
                    <>
                    <p><b>Aprobado por:</b> </p>
                    <p className={styles.right_border}>{Producto.aprobadoPor}</p>
                    </>
                }
                <p><b>Objetivo del producto:</b></p>
                <p className={styles.right_border}>{Producto.objetivo}</p>
                <p><b>Propuesta temas:</b></p>
                <p className={styles.right_border}>{Producto.temas}</p>
                <p><b>Forma de titulación o producto final integrador:</b></p>
                <p className={styles.right_border}>{Producto.titulacion}</p>
                <p><b>Experto recomendado para el desarrollo:</b></p>
                <p className={styles.right_border}>{Producto.experto}</p>
                <p className={styles.last_row}><b>Requerimientos:</b></p>
                <p className={styles.right_bottom_border}>{Producto.requerimientos}</p>
            </div>
          </div>
          <NavLink href="/actions/consultas" exact>
          <button>
            Regresar a Consultas
          </button>
          </NavLink>
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
