import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import styles from "../../styles/pages/catalogo.module.scss";
import { useEffect, useRef } from 'react';
import { sessionHasExpired } from '../../utils/forms';

const Catalogue = () => {
  const cat_scroll = useRef(null);

  useEffect(() => {
    // document.querySelector("body").className = '';
    // document.querySelector("body").classList.add("registro_bg");
    sessionHasExpired();
  }, []);

  const scrolling = (e) => {
    const total = e.target.scrollLeft * 4; // 2.91 sale de la división del padre entre el total de la caja 1600 / 550
    cat_scroll.current.scrollLeft = total;
  }
  return (
    <>
      <Head>
        <title>Catálogo de validación</title>
        <meta name="description" content="Start app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className={styles.main_content}>
          <h1>Catálogo de validación</h1>
          <div className={styles.controls + " scroll"} onScroll={(e) => scrolling(e)}>
            <span>.</span>
          </div>
          <div className={styles.tabla_catalogo} ref={cat_scroll}>
            <div className={styles.row + " " + styles.last_element}>
              <h3>Número</h3>
            </div>
            <div className={styles.col}>
              <h3>Herramienta de validación</h3>
            </div>
            <div className={styles.col}>
              <h3>A quien va dirigido</h3>
            </div>
            <div className={styles.col}>
              <h3>Medios o canal</h3>
            </div>
            <div className={styles.col}>
              <h3>Tipo de servicio</h3>
            </div>
            <div className={styles.col}>
              <h3>Descripción</h3>
            </div>
            <div className={styles.col}>
              <h3>Objetivos o alcance de los instrumentos</h3>
            </div>
            <div className={styles.col}>
              <h3>Caracteristicas</h3>
            </div>
            <div className={styles.col}>
              <h3>Quién aplica</h3>
            </div>
            <div className={styles.col}>
              <h3>Evidencia</h3>
            </div>
            <div className={styles.col}>
              <h3>Número de participantes mínimos</h3>
            </div>
            <div className={styles.col}>
              <h3>Número de participantes máximos</h3>
            </div>
            <div className={styles.col}>
              <h3>Duración de la actividad</h3>
            </div>
            <div className={styles.col}>
              <h3>Consideraciones</h3>
            </div>
            <div className={styles.col}>
              <h3>Ligas</h3>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>1</span>
            </div>
            <div className={styles.row}>
              <span>Focus Group</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Método utilizado para inbvestigaciones
                cualitativas, el objetivo de esta herramienta es
                conocer la opinión de un público objetivo a través de una serie de actividades.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Sesiones con una duración  de 1 hora</span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online</span>
            </div>
            <div className={styles.row}>
              <span>Reporte de resultados</span>
            </div>
            <div className={styles.row}>
              <span>5 personas por sesión</span>
            </div>
            <div className={styles.row}>
              <span>10 personas por sesión</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>2</span>
            </div>
            <div className={styles.row}>
              <span>Encuestas de retroalimentación </span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Cuestionario cuya finalidad es recabar información
                de cierta audiencia  y mejorar los elementos que
                se evalúan para el logro de los objetivos.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Formulario entre 3-5 preguntas.</span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online/Team Marketing</span>
            </div>
            <div className={styles.row}>
              <span>Reporte de resultados</span>
            </div>
            <div className={styles.row}>
              <span>1% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <span>3% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>3</span>
            </div>
            <div className={styles.row}>
              <span>Encuesta cuantitativa (proyección de datos, cálculo sensorial, investigación causal)</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Método de recogida de datos , que utiliza herramientas
                de análisis matemático y estadístico.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span>1% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <span>3% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>4</span>
            </div>
            <div className={styles.row}>
              <span>Piloto de un prototipo</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Puesta en marcha de un nuevo producto en una muestra
                representativa de personas.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Contar con un cronograma de los tiempos de ejecución</span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online</span>
            </div>
            <div className={styles.row}>
              <span>Reporte de resultados</span>
            </div>
            <div className={styles.row}>
              <span>1% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <span>3% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>5</span>
            </div>
            <div className={styles.row}>
              <span>Entrevistas  a profundidad</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Sesión de entrevistas individuales cuyo propósito es recabar
                de una manera personalizada comentarios.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Sesiones con una duración entre 30-45 min</span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online</span>
            </div>
            <div className={styles.row}>
              <span>Reporte de resultados</span>
            </div>
            <div className={styles.row}>
              <span>1 personas</span>
            </div>
            <div className={styles.row}>
              <span>5 personas</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>6</span>
            </div>
            <div className={styles.row}>
              <span>Herramientas digitales (Google Trends, Alexa, Semrush)</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Servicios digitales con diversos proveedores en la nube.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Por definir de acuerdo al objetivo</span>
            </div>
            <div className={styles.row}>
              <span>Externo</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>1 resultados en herramientas</span>
            </div>
            <div className={styles.row}>
              <span>3 resultados en herramientas</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>7</span>
            </div>
            <div className={styles.row}>
              <span>Master research</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Contratación de empresas expertas en proporcionar servicios
                relacionados a la investigación de mercados.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Por definir de acuerdo al objetivo</span>
            </div>
            <div className={styles.row}>
              <span>Externo</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>1% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <span>3% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>8</span>
            </div>
            <div className={styles.row}>
              <span>Bitácora social</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Contratación de empresas expertas en proporcionar
                servicios relacionados a la investigación de mercados.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Por definir de acuerdo al objetivo</span>
            </div>
            <div className={styles.row}>
              <span>Externo</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>1% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <span>3% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>9</span>
            </div>
            <div className={styles.row}>
              <span>Estudio de mercado con un tercero</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Contratación de empresas expertas en proporcionar
                servicios relacionados a la investigación de mercados.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Por definir de acuerdo al objetivo</span>
            </div>
            <div className={styles.row}>
              <span>Externo</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>1% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <span>3% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>10</span>
            </div>
            <div className={styles.row}>
              <span>Consultor(s) o asesor externo</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Contratación de un experto que implemente actividades
                y metodologías para alcanzar el objetivo.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Por definir de acuerdo al objetivo</span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online/Team Marketing</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>1% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <span>3% de la muestra de la población objetivo</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>11</span>
            </div>
            <div className={styles.row}>
              <span>Comunidades Online/Foros </span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Participación en distintos fotos o grupos online
                que compartan intereses similares a la institución.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Generar una pregunta detonante para que la comunidad participe</span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online/Team Marketing</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>10 personas</span>
            </div>
            <div className={styles.row}>
              <span>20 personas</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>12</span>
            </div>
            <div className={styles.row}>
              <span>Test de humo</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Testing rápido que permite verificar si un producto
                esta diseñado para la demando de los estudiantes.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Colocar para inscripción una nueva oferta educativa</span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online/Team Marketing</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>10 personas</span>
            </div>
            <div className={styles.row}>
              <span>5 personas</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>13</span>
            </div>
            <div className={styles.row}>
              <span>Prueba A/B</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Comparación de 2 versiones de una oferta educativa para conocer
                cuál de las dos tiene mayor éxito y aceptación.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>2 versiones de una oferta educativa </span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>10 personas</span>
            </div>
            <div className={styles.row}>
              <span>6 personas</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>14</span>
            </div>
            <div className={styles.row}>
              <span>Prueba de mercado</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Prueba en donde se ofreceré por tiempo limitado una nueva
                oferta educativa con el fin de probar o evaluar el sevicio.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Prueba con un tiempo limitado no mayor a 1 mes</span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>5 personas</span>
            </div>
            <div className={styles.row}>
              <span>10 personas</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row + " " + styles.last_element}>
              <span>15</span>
            </div>
            <div className={styles.row}>
              <span>Dummie</span>
            </div>
            <div className={styles.row}>
              <select name="dirigido">
                <option value="default">Opciones</option>
                <option value="estudiantes">Estudiantes</option>
                <option value="exalumnos">Ex alumnos</option>
                <option value="expertos">Expertos</option>
                <option value="publicoGeneral">Público en general</option>
                <option value="Competencia">Competencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="medios">
                <option value="default">Opciones</option>
                <option value="estudiantes">Online</option>
                <option value="exalumnos">Redes sociales (FB, Instagram, LinkedIn)</option>
                <option value="expertos">Otros medios</option>
              </select>
            </div>
            <div className={styles.row}>
              <select name="servicio">
                <option value="default">Opciones</option>
                <option value="gratuito">Gratuito</option>
                <option value="de pago">De pago</option>
              </select>
            </div>
            <div className={styles.row}>
              <p>
                Es un estilo de prototipo el cual se experimenta con asistrentes al focus group.
              </p>
            </div>
            <div className={styles.row}>
              <select name="instrumentos">
                <option value="default">Opciones</option>
                <option value="nombre">Nombre de la oferta educativa</option>
                <option value="público objetivo">Público objetivo</option>
                <option value="contAcademico">Contenido académico</option>
                <option value="costos">Costos</option>
                <option value="calidad">Calidad educativa</option>
                <option value="nuevos">Nuevos productos</option>
                <option value="actualización">Actualización del producto</option>
                <option value="perfil">Perfil de estudiantes (ingreso/egreso)</option>
                <option value="impacto">Impacto en la industria</option>
                <option value="mercados">Mercados</option>
                <option value="tendencia">Tendencia</option>
              </select>
            </div>
            <div className={styles.row}>
              <span>Prueba con un tiempo limitado no mayor a 1 mes</span>
            </div>
            <div className={styles.row}>
              <span>Team EC-Online</span>
            </div>
            <div className={styles.row}>
              <span>Reporte</span>
            </div>
            <div className={styles.row}>
              <span>5 personas</span>
            </div>
            <div className={styles.row}>
              <span>10 personas</span>
            </div>
            <div className={styles.row}>
              <select name="duracion">
                <option value="default">Opciones</option>
                <option value="30-45 minutos">30-45 minutos</option>
                <option value="1 hora">1 hora</option>
                <option value="por definir">Por definir</option>
              </select>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
            <div className={styles.row}>
              <span></span>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Catalogue;

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
