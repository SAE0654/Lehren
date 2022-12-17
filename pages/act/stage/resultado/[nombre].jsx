import { Router, useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
import Layout from '../../../../components/Layout';
import styles from "../../../../styles/pages/ventas.module.scss";
import { acceptedFiles, getTimeStamp, isAnyFieldEmpty, sessionHasExpired } from '../../../../utils/forms';
import { toast } from 'react-toastify';
import { IoMdClose } from "react-icons/io";
import Swal from 'sweetalert2/dist/sweetalert2';

const BUCKET_URI = "https://sae-files.s3.amazonaws.com/";
let onChangeURI = false;

export default function Complete() {
  const router = useRouter();
  const [Producto, setProducto] = useState(null);
  // Función de cambios sin guardar
  const [notSaved, setNotSaved] = useState(false);
  const [GoToNext, setGoToNext] = useState(false);
  const [Files, setFiles] = useState([]);
  const { nombre } = router.query;
  const { data: session } = useSession();

  let url_files = [];

  useEffect(() => {
    getNombre();
    if (!Producto) {
      getProductoByNombre();
    }
    // document.querySelector("body").className = '';
    // document.querySelector("body").classList.add("consultas_bg");
    sessionHasExpired();
  }, []);

  useEffect(() => {
    onChangeURI = false;
    const beforeRouteHandler = (url) => {
      if (url === router.asPath) return;
      if (!onChangeURI) {
        displaySureMessage(url);
      }
      if (!GoToNext) {
        Router.events.emit('routeChangeError');
        throw "Operación cancelada";
      } else {
        Swal.close()
      }
    };
    if (notSaved) {
      Router.events.on('routeChangeStart', beforeRouteHandler);
    } else {
      Router.events.off('routeChangeStart', beforeRouteHandler);
    }
    return () => {
      Router.events.off('routeChangeStart', beforeRouteHandler);
    };
  }, [notSaved, GoToNext]);

  const displaySureMessage = (NextRoute) => {
    Swal.fire({
      title: '¿Salir de la página?',
      text: "Perderás tu trabajo actual",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setGoToNext(true);
        onChangeURI = true;
        router.push(NextRoute)
      } else {
        onChangeURI = false;
        setGoToNext(false)
      }
    })
  }


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
      });
  }

  const setProductoItem = (e) => {
    if (!notSaved) setNotSaved(true);
    if (e.target.name === "comentarios") {
      setProducto({
        ...Producto,
        [e.target.name]: [{
          user: session.user.names,
          comentarios: e.target.value,
          createdAt: getTimeStamp()
        }]
      });
      return;
    }
    setProducto({
      ...Producto,
      [e.target.name]: e.target.value
    });
  }

  const updateCourse = async (e) => {
    e.preventDefault();
    await saveFilesToAWS();
    const producto = Producto;
    producto.archivosETP2 = url_files;
    producto.statusProducto = "Validado";
    producto.etapa = "Aprobado";
    producto.aprobadoPor = session.user.names;
    if (isAnyFieldEmpty(e.target)) { // Si true, campos vacíos
      toast.error("Rellena todos los campos");
      return;
    }
    if (producto.statusProducto === "No aprobado") {
      producto.comentarios = [{
        user: session.user.names,
        comentarios: "Este producto fue aprobado",
        createdAt: getTimeStamp()
      }];
    }
    await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/producto/` + nombre, producto,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json'
        }
      }).then(async (res) => {
        toast.info(res.data.message);
        e.target.reset();
        setNotSaved(false);
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/${producto.nombre}=updateComment`, producto);
        router.push(`${process.env.NEXT_PUBLIC_ENDPOINT}`);
      }).catch((err) => {
        toast.error("Error al completar")
      })
  }

  const desaprobarProducto = async () => {
    setNotSaved(false);
    await Swal.fire({
      input: 'textarea',
      inputLabel: "Explica por qué el producto no fue aprobado",
      inputValue: "",
      inputPlaceholder: "Comentario...",
      inputAttributes: {
        'aria-label': 'Escribe tu comentario aquí',
        maxlength: 500
      },
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    }).then(async (res) => {
      if (res.isDismissed) return;
      if (res.value.trim().length === 0 && res.isConfirmed) {
        toast.warn("El comentario no puede estar vacío");
        return;
      }
      const producto = Producto;
      producto.statusProducto = 'No aprobado';
      producto.etapa = "Resultado"
      producto.aprobadoPor = 'Producto no aprobado';
      producto.comentarios = [{
        user: session.user.names,
        comentarios: "NO APROBADO: " + res.value,
        createdAt: getTimeStamp()
      }];
      await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/producto/updateToNoAprobado=${producto.nombre}`, producto, {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json'
        }
      }).then(() => {
        toast.info("Producto mandado a propuesta");
        router.push("/vw/query/" + producto.institucion)
      }).catch(() => {
        toast.error("Ocurrió un error inesperado, inténtalo de nuevo")
      });
    })
  }

  const verifyFiles = (e) => {
    let files = e.target.files;
    let file = [];
    let hasTheSameName = false;
    if (!acceptedFiles(e)) {
      toast.error("Extensión de archivo no admitida");
      return;
    }
    if (files.length >= 5 || file.length >= 5 || Files.length >= 5) {
      toast.info("Máximo de archivos admitido: 5");
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if ((files[i].size / 1024 / 1024).toFixed(2) >= 8) {
        toast.error("No puedes subir un archivo mayor a 8MB");
        return;
      }
    }
    Array.from(files).map((_file) => {
      for (let i = 0; i < Files.length; i++) {
        if (Files[i].name === _file.name) {
          toast.info("No puedes subir 2 veces el mismo archivo");
          hasTheSameName = true;
          break;
        }
      }
      if (hasTheSameName) return;
      file.push(_file);
    });
    setFiles([...Files, ...file]);
  }


  const deleteFiles = (index) => {
    let file = Files.filter((item, _Lindex) => _Lindex !== index);
    if (file.length <= 0) {
      document.querySelector("#fileUpload").value = '';
    }
    setFiles(file);
  }

  const saveFilesToAWS = async () => {
    if (Files.length <= 0) return;
    for (let i = 0; i < Files.length; i++) {
      let { data } = await axios.post("/api/s3/uploadFile", {
        name: Files[i].name,
        type: Files[i].type
      }, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      const url = data.url;
      /*let { data: newData } = */ await axios.put(url, Files[i], {
        headers: {
          "Content-type": Files[i].type,
          "Access-Control-Allow-Origin": "*",
        },
      }).then(() => {
        toast.success("Archivo subido con éxito: " + Files[i].name, {
          autoClose: 3000
        })
      });
      url_files.push(BUCKET_URI + Files[i].name);
    }
    setFiles([]);
  }

  if (!Producto) {
    return <h1>Cargando...</h1>
  }

  return <>
    <Head>
      <title>Etapa de resultados </title>
      <meta name="description" content="Login app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <div className={styles.main_content}>
        <div className={styles.box_container}>
          <h1>Proceso de resultados</h1>
          <form onSubmit={(e) => updateCourse(e)}>
            <div className={styles.form_group}>
              <h2>Análisis académico</h2>
              <textarea name="temas" placeholder="Propuesta de temas" defaultValue={Producto.temas} onChange={(e) => setProductoItem(e)} maxLength="6000" required></textarea>
              <br />
              <textarea name="titulacion" placeholder="Forma de titulación o producto final integrador" defaultValue={Producto.titulacion} onChange={(e) => setProductoItem(e)} maxLength="3000" required></textarea>
              <br />
              <textarea name="experto" placeholder="Experto recomendado para el desarrollo (en caso de ser programa curricular, incluir posibles expertos por asignatura)" defaultValue={Producto.experto} onChange={(e) => setProductoItem(e)} maxLength="3000" required></textarea>
              <br />
              <textarea name="requerimientos" placeholder="Requerimientos especiales de instalaciones, equipo, software, etc" defaultValue={Producto.requerimientos} onChange={(e) => setProductoItem(e)} maxLength="6000" required></textarea>
              <br />
              <textarea name="comentarios" maxLength="5000" placeholder='Comentarios' defaultValue={Producto.comentarios === null || typeof Producto.comentarios[0] === "undefined" ? "" : Producto.comentarios[0].comentarios} onChange={(e) => setProductoItem(e)}></textarea>
            </div>
            <div className={styles.form_group}>
              <h2>Análisis de mercado</h2>
              <br />
              <textarea name="datosSustentan" placeholder="Datos que sustentan la propuesta" defaultValue={Producto.datosSustentan} onChange={(e) => setProductoItem(e)} maxLength="6000" required></textarea>
              <br />
              <textarea name="competencia" placeholder="Oferta frente a la que compite" defaultValue={Producto.competencia} onChange={(e) => setProductoItem(e)} maxLength="6000" required></textarea>
              <br />
              <textarea name="mercado" placeholder="Mercado en el que incide" defaultValue={Producto.mercado} onChange={(e) => setProductoItem(e)} maxLength="6000" required></textarea>
              <br />
              <h2>Análisis financiero</h2>
              <input
                type="text"
                name="ROI"
                placeholder="Enlace a ROI"
                defaultValue={Producto.ROI}
                onChange={(e) => setProductoItem(e)} />
              <div className={styles.files_zone}>
                <label className={styles.form_files}>
                  <input type="file" name="files_att" id="fileUpload" onChange={(e) => verifyFiles(e)} multiple />
                  Subir archivos
                </label>
                {
                  Files.length <= 0 ? null :
                    Files.map((file, index) => (
                      <div className={styles.zoner} key={index}>
                        <div className={styles.zoner_box}>
                          <p>
                            <IoMdClose className={styles.zoner_delete} onClick={() => deleteFiles(index)} />
                            <span className={styles.fileName}>{file.name}</span>
                            <span className={
                              file.type.split("/")[1] === "vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                                file.type.split("/")[1] === "vnd.openxmlformats-officedocument.presentationml.presentation" ||
                                file.type.split("/")[1] === "vnd.openxmlformats-officedocument.spreadsheetml.sheet" ?
                                (
                                  file.type.split("/")[1].split(".")[3] === "presentation" ? "powerpoint" :
                                    file.type.split("/")[1].split(".")[3] === "document" ? "word" :
                                      file.type.split("/")[1].split(".")[3] === "sheet" ? "excel" : null
                                )
                                : file.type.split("/")[1]
                            }>
                              {
                                file.type.split("/")[1] === "vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                                  file.type.split("/")[1] === "vnd.openxmlformats-officedocument.presentationml.presentation" ||
                                  file.type.split("/")[1] === "vnd.openxmlformats-officedocument.spreadsheetml.sheet" ?
                                  (
                                    file.type.split("/")[1].split(".")[3] === "presentation" ? "powerpoint" :
                                      file.type.split("/")[1].split(".")[3] === "document" ? "word" :
                                        file.type.split("/")[1].split(".")[3] === "sheet" ? "excel" : null
                                  )
                                  : file.type.split("/")[1]
                              }
                            </span>
                          </p>
                        </div>
                      </div>
                    ))
                }
              </div>
              <div className="btn_gr">
                {
                  Producto.statusProducto === "No aprobado" ?
                    <button type="button" value="Aprobar ya" style={{ backgroundColor: "transparent", opacity: "0.7", cursor: "not-allowed" }}>Ya fue desaprobado</button>
                    :
                    <button type="button" value="No aprobar" onClick={() => desaprobarProducto()} style={{ backgroundColor: "transparent" }}>No aprobar </button>
                }
                <input type="submit" style={{ top: "100em", bottom: "inherit", left: "5em" }} value="Aprobar este producto" onClick={() => setNotSaved(false)} />
              </div>
            </div>

          </form>
          <br /><br />
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
