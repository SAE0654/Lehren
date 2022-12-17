import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
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
import { getProductoByNombre } from '../../../services/productos';

export default function ViewProduct() {
  const router = useRouter();
  const [Producto, setProducto] = useState(null);
  const [FilesETP1, setFilesETP1] = useState([]);
  const [FilesETP2, setFilesETP2] = useState([]);

  const { nombre } = router.query;

  useEffect(() => {
    getId();
    if (!Producto) {
      callProduct();
    }
    // document.querySelector("body").className = '';
    // document.querySelector("body").classList.add("consultas_bg");
    sessionHasExpired();
  }, []);

  const getId = () => {
    if (typeof nombre === 'undefined') {
      nombre = localStorage.getItem("Nombre");
    }
    localStorage.setItem("Nombre", nombre);
  }

  const callProduct = async () => {
    const data = await getProductoByNombre(nombre);
    setProducto(data);
    setFilesETP1(data.archivosETP1);
    setFilesETP2(data.archivosETP2)
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
    const productoArr = etapa === "archivosETP1" ? FilesETP1.filter((item) => item !== fileName) : FilesETP2.filter((item) => item !== fileName);
    etapa === "archivosETP1" ? setFilesETP1(productoArr) : setFilesETP2(productoArr);
    Producto[etapa] = productoArr;
    await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/producto/updateETP12=${nombre}`, [Producto[etapa], etapa])
      .then(() => {
        toast.success("Archivo eliminado")
      });
  }

  const editOptions = async () => {
    const inputOptions = {
      [`act/register/${Producto.nombre}`]: "1. Registro",
      // [`vw/validacion/${Producto._id}`]: "2. Propuesta",
      // [`vw/resultado/${Producto._id}`]: "3. Resultado"
    }

    const { value: editChose } = await Swal.fire({
      title: 'Editar datos del...',
      input: 'radio',
      inputOptions: inputOptions,
      confirmButtonText: "Continuar",
      inputValidator: (value) => {
        if (!value) {
          return '¡Debes elegir algo!'
        }
      }
    })

    if (editChose) {
      router.push(`${process.env.NEXT_PUBLIC_ENDPOINT}` + editChose)
    }
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
      <div className={styles.main_content} style={{ transform: 'translate(0%, -40%)', maxHeight: '200vh' }}>
        <div className={styles.box_container}>
          <h1 className={styles.t_container}>Datos completos del producto</h1>
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
              <p><b>Persona que propone el producto:</b></p>
              <p className={styles.right_border}>{Producto.quienPropone}</p>
              <p><b>Responsable:</b></p>
              <p className={styles.right_border}>{Producto.responsable}</p>
              <p className={styles.last_row}><b>Prioridad:</b></p>
              <p className={styles.right_bottom_border}>{Producto.prioridad ? Producto.prioridad : "baja"}</p>
              <h2 className={styles.title2}>Análisis académico</h2>
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
              <p className={styles.right_border}>{Producto.aprobado === 'Aprobado' ? 'Sí' : /*pregunta 2: */ Producto.aprobado === "Validacion" ? 'En validación' : 'En propuesta'}</p>
              {
                Producto.aprobadoPor === 'NP' ? null :
                  <>
                    <p><b>Aprobado por:</b> </p>
                    <p className={styles.right_border}>{Producto.aprobado !== "aprobado" ? "Este producto no ha sido aprobado" : Producto.aprobadoPor}</p>
                  </>
              }
              <p><b>Objetivo del producto:</b></p>
              <p className={styles.right_border}>{Producto.objetivo === null ? "Sin objetivos" : Producto.objetivo.map((item, index) => (item + ((index + 1) >= Producto.objetivo.length ? "." : ", ")))}</p>
              <p><b>Propuesta temas:</b></p>
              <p className={styles.right_border}>{Producto.temas}</p>
              <p><b>Forma de titulación o producto final integrador:</b></p>
              <p className={styles.right_border}>{Producto.titulacion}</p>
              <p><b>Experto recomendado para el desarrollo:</b></p>
              <p className={styles.right_border}>{Producto.experto}</p>
              <p className={styles.last_row}><b>Requerimientos:</b></p>
              <p className={styles.right_bottom_border}>{Producto.requerimientos}</p>
              <h2 className={styles.title3}>Análisis de mercado</h2>

              <p><b>Datos que sustentan la propuesta:</b></p>
              <p className={styles.right_border}>{Producto.datosSustentan}</p>
              <p><b>Oferta frente a la que compite:</b></p>
              <p className={styles.right_border}>{Producto.competencia}</p>
              <p className={styles.last_row}><b>Mercado en el que incide:</b></p>
              <p className={styles.right_bottom_border}>{Producto.mercado}</p>
              <h2 className={styles.title4}>Herramientas de validación</h2>
              <p><b>Instrumentos de validación empleados:</b></p>
              {Producto.instrumentoValidacion === null ? <p className={styles.right_border}>No se han seleccionado instrumentos de validación</p> : <p className={styles.right_border}>{Producto.instrumentoValidacion.length > 0
                ? Producto.instrumentoValidacion.map((tool, index) => (Producto.instrumentoValidacion.length - 1) === index ? (index + 1) + " .-" + tool.nombre + ". " : (index + 1) + " .-" + tool.nombre + ", ")
                : null}
              </p>}
              <p className={styles.last_row}><b>Comentarios:</b></p>
              {
                Producto.comentarios === null ?
                  <p className={styles.right_bottom_border} style={{ minHeight: '60px' }}>{Producto.comentarios === null ? "Sin comentarios" : Producto.comentarios[0].comentarios}</p>
                  :
                  <p className={styles.right_bottom_border} style={{ minHeight: '60px' }}>{Producto.comentarios.length <= 0 ? "Sin comentarios" : Producto.comentarios[0].comentarios}</p>
              }
              <h2 className={styles.title5}>Análisis financiero</h2>
              <p className={styles.last_row}><b>Enlace a ROI:</b></p>
              <p className={styles.right_bottom_border} style={{ minHeight: '60px' }}>{Producto.ROI}</p>
              <h2 className={styles.title6}>Archivos cargados</h2>
              <p className={styles.right_border}>Etapa 1: </p>
              <p className={styles.right_border}>
                {
                  Producto.archivosETP1 && FilesETP1.length > 0 ?
                    FilesETP1.map((item, index) => (
                      <div className={styles.container_file} key={index} style={{minWidth: '200px', alignItems: 'center'}}>
                        <AiTwotoneDelete className={styles.btn_delete} onClick={() => deleteFile(item, "archivosETP1")} />
                        <a href={item} target="_blank" rel="noopener noreferrer" style={{marginTop: 'inherit', marginBottom: 'inherit', width: '40%'}}>
                          {item.split("https://sae-files.s3.amazonaws.com/")}
                        </a>
                      </div>
                    )) : "Ningún archivo fue cargado"
                }
              </p>
              <p className={styles.last_row}>Etapa 2: </p>
              <p className={styles.right_bottom_border}>
                {
                  Producto.archivosETP2 && FilesETP2.length > 0 ?
                    FilesETP2.map((item, index) => (
                      <div className={styles.container_file} key={index}>
                        <AiTwotoneDelete className={styles.btn_delete} onClick={() => deleteFile(item, "archivosETP2")} />
                        <a href={item} target="_blank" rel="noopener noreferrer">
                          {item.split("https://sae-files.s3.amazonaws.com/")}
                        </a>
                      </div>
                    )) : "Ningún archivo fue cargado"
                }
              </p>
            </div>
          </div>
          <button className={styles.editar_btn} onClick={() => editOptions()}>
            Actualizar información
          </button>
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
