import { useRouter } from 'next/router'
import { getSession } from "next-auth/react";
import { Fragment, useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import Layout from '../../../components/Layout';
// Estilos
import styles from "../../../styles/pages/ventas.module.scss";
import { AiTwotoneDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2/dist/sweetalert2';
// Componentes
import { NavLink } from '../../../components/NavLink';
// Funciones externas
import { sessionHasExpired } from '../../../utils/forms';
import { getProductoById } from '../../../utils/api';

export default function ViewProduct() {
  const router = useRouter();
  const [Producto, setProducto] = useState(null);
  const [EvidenciaAdjunta, setEvidenciaAdjunta] = useState([]);

  const { id } = router.query;

  useEffect(() => {
    getId();
    if (!Producto) {
      callProduct();
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

  const callProduct = async () => {
    const data = await getProductoById(id);
    setProducto(data);
    setEvidenciaAdjunta(data.evidenciaAdjunta);
    console.log(data)
  }

  const deleteFile = async (fileName, etapa) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_ENDPOINT}api/s3/delete/${fileName.split("https://sae-files.s3.amazonaws.com/")[1]}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }).then(() => {
      deleteDBRecord(fileName, etapa)
    }).catch((err) => {
      console.log(err)
    })
  }

  const deleteDBRecord = async (fileName, etapa) => { // Borrar el link del archivo de la BD
    const productoArr = EvidenciaAdjunta.filter((item) => item !== fileName);
    setEvidenciaAdjunta(productoArr);
    Producto[etapa] = productoArr;
    await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/${id}`, Producto)
      .then(() => {
        toast.success("Archivo eliminado")
      });
  }

  if (!Producto) {
    return <h1>Cargando...</h1>
  }

  return <>
    <Head>
      <title>Vista de datos </title>
      <meta name="description" content="Login app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <div className={styles.main_content}>
        <div className={styles.box_container}>
          <h1 className={styles.t_container} style={{ marginTop: 'inherit' }}>Datos completos del producto</h1>
          <div className={styles.info_container}>
            <div className={styles.info_box}>
              <h2 className={styles.title}>Datos generales</h2>
              <p><b>Tiene RVOE:</b></p>
              <p className={styles.right_border}>{Producto.RVOE === 'on' ? 'Sí' : 'No'}</p>
              <p><b>Tipo de oferta</b></p>
              <p className={styles.right_border}>{Producto.tipo}</p>
              <p><b>Modalidad</b></p>
              <p className={styles.right_border}>{Producto.modalidad}</p>
              <p><b>Institución:</b></p>
              <p className={styles.right_border}>{Producto.institucion.toUpperCase()}</p>
              <p><b>Persona/área propone el producto:</b></p>
              <p className={styles.right_border}>{Producto.quienPropone}</p>

              <h2 className={styles.title2}>Datos del mercado</h2>
              <p><b>A quién va dirigido:</b></p>
              <p className={styles.right_border}>{Producto.poblacionObj}</p>
              <p><b>Justificación de la propuesta:</b></p>
              <p className={styles.right_border}>{Producto.justificacionPropuesta}</p>
              <p className={styles.right_border}>Evidencia adjunta:</p>
              <p className={styles.right_border}>
                {
                  Producto.evidenciaAdjunta && EvidenciaAdjunta.length > 0 ?
                    EvidenciaAdjunta.map((item, index) => (
                      <div className={styles.container_file} key={index} style={{ minWidth: '200px', alignItems: 'center' }}>
                        <AiTwotoneDelete className={styles.btn_delete} onClick={() => deleteFile(item, "evidenciaAdjunta")} />
                        <a href={item} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'inherit', marginBottom: 'inherit', width: '40%' }}>
                          {item.split("https://sae-files.s3.amazonaws.com/")}
                        </a>
                      </div>
                    )) : "Ningún archivo fue cargado"
                }
              </p>
              <h2 className={styles.title3}>Datos de la propuesta</h2>
              <p><b>Nombres tentativos: </b></p>
              <p>
                {
                  Producto.nombre.split("|").map((nom, index) => (
                    <Fragment key={index}>{index + 1}.- {nom}<br /> </Fragment>
                  ))
                }
              </p>
              <p><b>Descripción general del programa:</b></p>
              <p className={styles.right_border}>{Producto.genDescProg}</p>
              <p><b>Objetivos del programa:</b></p>
              <p className={styles.right_border}>{Producto.objetivosPrograma}</p>
              <p><b>Propuesta inicial de temas:</b></p>
              <p className={styles.right_border}>{Producto.propuestaInicialTemario}</p>
              <p><b>Horas totales:</b></p>
              <p className={styles.right_border}>{Producto.horasTotales + ' hrs' || 'N/A'}</p>
              <p><b>Periodicidad:</b></p>
              <p className={styles.right_border}>{Producto.periodicidad}</p>
              <p><b>Propuesta de experto:</b></p>
              <p className={styles.right_border}>{Producto.responsable}</p>

              <h2 className={styles.title4}>Recursos extra necesarios</h2>
              <p><b>Descripción general:</b></p>
              <p className={styles.right_border}>{Producto.descripcion}</p>
              <p className={styles.last_row}><b>Comentarios:</b></p>
              {
                Producto.comentarios === null ?
                  <p className={styles.right_bottom_border} style={{ minHeight: '60px' }}>{Producto.comentarios === null ? "Sin comentarios" : Producto.comentarios[0].comentarios}</p>
                  :
                  <p className={styles.right_bottom_border} style={{ minHeight: '60px' }}>{Producto.comentarios.length <= 0 ? "Sin comentarios" : Producto.comentarios[0].comentarios}</p>
              }
            </div>
          </div>
          <NavLink href={"/vw/query/" + Producto.institucion} exact>
            Regresar
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
