import { Router, useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
import Layout from '../../../components/Layout';
import styles from "../../../styles/pages/ventas.module.scss";
import { acceptedFiles, getTimeStamp, isAnyFieldEmpty, sessionHasExpired } from '../../../utils/forms';
import { toast } from 'react-toastify';
import { IoMdClose } from "react-icons/io";

const BUCKET_URI = "https://sae-files.s3.amazonaws.com/"

export default function Complete() {
  const router = useRouter();
  const [Producto, setProducto] = useState(null);
  // Función de cambios sin guardar
  const [notSaved, setNotSaved] = useState(false);
  const [OnChangeRoute, setOnChangeRoute] = useState(false);
  const [NextRoute, setNextRoute] = useState(null);
  const [GoToNext, setGoToNext] = useState(false);
  const [VTools, setVTools] = useState([]);
  const [SelectedTools, setSelectedTools] = useState([]);
  const [Files, setFiles] = useState([]);

  const Route = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  let url_files = [];

  let herramientas = [
    "Focus Group con estudiantes y docentes",
    "Encuestas de retroalimentación de estudiantes",
    "Encuestas de ex alumnos",
    "Piloto de un prototipo",
    "Encuestas en redes sociales",
    "Sesiones con expertos de la industria",
    "Herramientas digitales (Google Trends)",
    "Master research",
    "Bitácora social",
    "Estudio de mercado con un tercero",
    "Consultor o asesor externo"]

  useEffect(() => {
    getId();
    if (!Producto) {
      getProductoById();
    }
    document.querySelector("body").className = '';
    document.querySelector("body").classList.add("consultas_bg");
    sessionHasExpired();
  }, []);

  useEffect(() => {
    const beforeRouteHandler = (url) => {
      if (url === Route.asPath) return;
      setOnChangeRoute(true);
      setNextRoute(url);
      if (!GoToNext) {
        Router.events.emit('routeChangeError');
        throw "Operación cancelada";
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

  const getToolsSelected = (data) => {
    let indexes = '';

    if (!data.instrumentoValidacion) return;
    data.instrumentoValidacion.map(tool => {
      const _indice = herramientas.indexOf(tool);
      setVTools(data.instrumentoValidacion)
      if (_indice >= 0) {
        indexes += ' ' + _indice;
      }
    })
    setSelectedTools(indexes);
  }


  const getId = () => {
    if (typeof id === 'undefined') {
      id = localStorage.getItem("Id");
    }
    localStorage.setItem("Id", id);
  }

  const getProductoById = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + id)
      .then((res) => {
        setProducto(res.data);
        getToolsSelected(res.data);
        console.log(res.data)
      });
  }

  const setProductoItem = (e) => {
    if (!notSaved) setNotSaved(true);
    const tools = VTools;
    if (e.target.name === "instrumentoValidacion") {
      if (e.target.checked) {
        tools.push(e.target.value);
        setProducto({
          ...Producto,
          [e.target.name]: tools
        });
      } else {
        const _index = tools.indexOf(e.target.value)
        tools.splice(_index, 1);
      }
      return;
    }
    if(e.target.name === "comentarios") {
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
    producto.aprobado = "aprobado";
    if (isAnyFieldEmpty(e.target)) { // Si true, campos vacíos
      toast.error("Rellena todos los campos");
      return;
    }
    await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + id, producto,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        toast.info(res.data.message);
        e.target.reset();
        router.push(`${process.env.NEXT_PUBLIC_ENDPOINT}`)
      }).catch((err) => {
        toast.error("Error al completar")
      })
  }

  const desaprobarProducto = async () => {
    if (notSaved) return;
    setNotSaved(false);
    const producto = Producto;
    producto.aprobado = 'off';
    producto.aprobadoPor = 'Mandado a propuesta';
    await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + producto._id, producto, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      toast.info("Producto mandado a propuesta");
      router.push("/")
    }).catch(() => {
      toast.error("Ocurrió un error inesperado, inténtalo de nuevo")
    });
  }

  const verifyFiles = (e) => {
    console.log(e.target.files[0].size / 1024 / 1024 + "MiB")
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
      <title>{!session ? 'Cargando...' : session.user.username} | Completar datos </title>
      <meta name="description" content="Login app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <div className={OnChangeRoute ? "wrapper_bg" : "wrapper_bg hide"} aria-hidden="true"></div>
      <div className={OnChangeRoute ? "window_confirm" : "window_confirm hide"}>
        <h1 className="mini">¿Seguro que quieres salir? Perderás tu trabajo actual</h1>
        <div className="cancel_continue">
          <button onClick={() => (setGoToNext(true), Route.push(NextRoute))}>Continuar</button>
          <button onClick={() => setOnChangeRoute(false)}>Cancelar</button>
        </div>
      </div>
      <div className={styles.main_content}>
        <div className={styles.box_container}>
          <h1>{Producto.nombre}</h1>
          <form onSubmit={(e) => updateCourse(e)}>
            <div className={styles.form_group}>
              <h2>Análisis académico</h2>
              <textarea name="objetivo" placeholder="Objetivo del producto" defaultValue={Producto.objetivo} onChange={(e) => setProductoItem(e)} maxLength="3000" required></textarea>
              <br />
              <textarea name="temas" placeholder="Propuesta de temas" defaultValue={Producto.temas} onChange={(e) => setProductoItem(e)} maxLength="6000" required></textarea>
              <br />
              <textarea name="titulacion" placeholder="Forma de titulación o producto final integrador" defaultValue={Producto.titulacion} onChange={(e) => setProductoItem(e)} maxLength="3000" required></textarea>
              <br />
              <textarea name="experto" placeholder="Experto recomendado para el desarrollo (en caso de ser programa curricular, incluir posibles expertos por asignatura)" defaultValue={Producto.experto} onChange={(e) => setProductoItem(e)} maxLength="3000" required></textarea>
              <br />
              <textarea name="requerimientos" placeholder="Requerimientos especiales de instalaciones, equipo, software, etc" defaultValue={Producto.requerimientos} onChange={(e) => setProductoItem(e)} maxLength="6000" required></textarea>
              <div className="radio_ck_section">
                <h3>Herramientas de validación</h3>
                <label className="control control-radio">
                  Focus Group con estudiantes y docentes
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Focus Group con estudiantes y docentes"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={SelectedTools.includes(0) ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Encuestas de retroalimentación de estudiantes
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Encuestas de retroalimentación de estudiantes"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Encuestas de retroalimentación de estudiantes') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Encuestas de ex alumnos
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Encuestas de ex alumnos"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Encuestas de ex alumnos') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Piloto de un prototipo
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Piloto de un prototipo"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Piloto de un prototipo') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Encuestas en redes sociales
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Encuestas en redes sociales"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Encuestas en redes sociales') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Sesiones con expertos de la industria
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Sesiones con expertos de la industria"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Sesiones con expertos de la industria') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Herramientas digitales (Google Trends)
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Herramientas digitales (Google Trends)"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Herramientas digitales (Google Trends)') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Master research
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Master research"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Master research') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Bitácora social
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Bitácora social"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Bitácora social') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Estudio de mercado con un tercero
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Estudio de mercado con un tercero"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Estudio de mercado con un tercero') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
                <label className="control control-radio">
                  Consultor o asesor externo
                  <input
                    type="checkbox"
                    name="instrumentoValidacion"
                    value="Consultor o asesor externo"
                    onChange={(e) => setProductoItem(e)}
                    defaultChecked={VTools.includes('Consultor o asesor externo') ? true : false} />
                  <div className="control_indicator"></div>
                </label>
              </div>
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
              <input type="submit" style={{ top: "100em", bottom: "inherit", left: "5em" }} value="Aprobar" onClick={() => setNotSaved(false)} />
              
            </div>
            
          </form>
          <button onClick={() => desaprobarProducto()}>Devolver a propuesta</button>
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
