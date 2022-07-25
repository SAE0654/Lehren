import { Router, useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
import Layout from '../../../components/Layout';
import styles from "../../../styles/pages/ventas.module.scss";
import { isAnyFieldEmpty, sessionHasExpired } from '../../../utils/forms';
import { toast } from 'react-toastify';

export default function Complete() {
  const router = useRouter();
  const [Producto, setProducto] = useState(null);
  // Función de cambios sin guardar
  const [notSaved, setNotSaved] = useState(false);
  const [OnChangeRoute, setOnChangeRoute] = useState(false);
  const [NextRoute, setNextRoute] = useState(null);
  const [GoToNext, setGoToNext] = useState(false);
  const Route = useRouter();
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
    console.log("RECARGA")
    return () => {
      Router.events.off('routeChangeStart', beforeRouteHandler);
    };
  }, [notSaved, GoToNext]);


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

  const setProductoItem = (e) => {
    if (!notSaved) setNotSaved(true);
    setProducto({
      ...Producto,
      [e.target.name]: e.target.value
    });
  }

  const updateCourse = async (e) => {
    e.preventDefault();
    const producto = Producto;
    console.log(producto)
    if (isAnyFieldEmpty(e.target)) { // Si true, campos vacíos
      toast.error("Rellena todos los campos");
      return;
    }
    await axios.put(`https://lehren-productos.vercel.app/api/productos/` + id, producto,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        toast.info(res.data.message);
        e.target.reset();
        router.push("https://lehren-productos.vercel.app/actions/consultas")
      }).catch((err) => {
        toast.error("Error al completar")
      })
  }

  const desaprobarProducto = async () => {
    if (notSaved) return;
    setNotSaved(false);
    const producto = Producto;
    producto.aprobado = 'off';
    producto.aprobadoPor = 'Mandado a revisión';
    await axios.put('https://lehren-productos.vercel.app/api/productos/' + producto._id, producto, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      toast.info("Producto mandado a revisión");
      router.push("/actions/consultas")
    }).catch(() => {
      toast.error("Ocurrió un error inesperado, inténtalo de nuevo")
    });
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
            </div>
            <div className={styles.form_group}>
              <h2>Análisis de mercado</h2>
              <textarea name="instrumentoValidacion" placeholder="Instrumentos de validación empleados" defaultValue={Producto.instrumentoValidacion} onChange={(e) => setProductoItem(e)} maxLength="6000" required></textarea>
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
              <textarea
                name="comentarios"
                placeholder="Comentarios adicionales"
                defaultValue={Producto.comentarios}
                onChange={(e) => setProductoItem(e)}></textarea>
            </div>
            <input type="submit" value={Producto.objetivo !== null ? "Actualizar datos" : "Guardar formulario"} onClick={() => setNotSaved(false)} />
          </form>
          <button onClick={() => desaprobarProducto()}>Mandar producto a revisión (desaprobar)</button>
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
