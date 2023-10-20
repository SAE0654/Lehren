import Head from 'next/head';
import { getSession, useSession } from "next-auth/react";
import styles from "../../../styles/pages/ventas.module.scss";
import Layout from '../../../components/Layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { acceptedFiles, getTimeStamp, isAnyFieldEmpty, sessionHasExpired } from '../../../utils/forms';
import { useRouter } from 'next/router';
import { IoMdClose } from "react-icons/io";
import { getProductoById } from '../../../utils/api';

const BUCKET_URI = "https://sae-files.s3.amazonaws.com/";
const dataProduct = {
    RVOE: "",
    areaV: "",
    creadoPor: "",
    descripcion: "",
    genDescProg: "",
    horasTotales: "",
    institucion: "",
    justificacionPropuesta: "",
    modalidad: "",
    nombre: "",
    nombre_2: "",
    nombre_3: "",
    objetivosPrograma: "",
    periodicidad: "",
    poblacionObj: "",
    propuestaInicialTemario: "",
    quienPropone: "",
    responsable: "",
    tipo: ""
}


export default function Producto() {
    const [Producto, setProducto] = useState({});
    // Función de cambios sin guardar
    const [notSaved, setNotSaved] = useState(false);
    // Función de institución para opciones y validacion tools
    const [Institucion, setInstitucion] = useState(undefined);
    const [Files, setFiles] = useState([]);
    // Tipo de oferta, campo opción Otro
    const [Otro, setOtro] = useState('');

    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();

    let url_files = typeof Producto.evidenciaAdjunta === "undefined" ? [] : Producto.evidenciaAdjunta;

    useEffect(() => {
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add("registro_bg");
        sessionHasExpired();
        if (id === "new") return;
        callProduct();
    }, [id]);

    useEffect(() => {
        if (id === "new") {
            setProducto(dataProduct);
            setInstitucion(undefined);
            setFiles([]);
            setOtro('');
            document.getElementById("descripcion").value = "";

        }
    }, [id]);

    const registerCourse = async (e) => {
        e.preventDefault();
        const form = e.target;
        const producto = { ...Producto };
        for (let i = 0; i < form.length; i++) {
            if (form[i].type === "submit") continue;
            if (form[i].type === "checkbox") {
                producto = { ...producto, [form[i].name]: form[i].checked };
            } else {
                if (form[i].type === "radio") {
                    if (form[i].checked) {
                        producto = { ...producto, [form[i].name]: form[i].value };
                    }
                    continue;
                }
                if (form[i].type === "select-one") {
                    const selectElement = form[i];
                    const selectedOption = selectElement.options[selectElement.selectedIndex];

                    if (selectedOption.value !== "default" && selectedOption.value.trim().length > 0) {
                        producto = { ...producto, [form[i].name]: selectedOption.value };
                        continue;
                    } else {
                        continue;
                    }
                }
                if (form[i].id === "otro") {
                    continue;
                }
                producto = { ...producto, [form[i].name]: form[i].value };
            }
        }
        producto = { ...producto, creadoPor: session.user.names + ", el " + getTimeStamp() };
        producto = { ...producto, RVOE: producto.RVOE ? 'on' : 'off' };

        if (producto.tipo === "Otro") {
            producto = { ...producto, tipo: Otro }
        }
        const fieldEmpty = isAnyFieldEmpty(form, producto);
        if (fieldEmpty.trim().length > 0) { // Si true, campos vacíos
            toast.error(`El campo ${fieldEmpty} no puede estar vacío.`);
            return;
        }

        let nombre = producto.nombre;
        if (producto.nombre_2 !== "") {
            nombre += "|" + producto.nombre_2;
        }
        // Verifica si nombre_3 tiene un valor y concaténalo a nombre con "|" si nombre ya tiene un valor
        if (producto.nombre_3 !== "") {
            if (nombre !== "") {
                nombre += "|" + producto.nombre_3;
            } else {
                nombre = producto.nombre_3;
            }
        }

        producto = { ...producto, nombre: nombre }

        await saveFilesToAWS();
        producto = { ...producto, evidenciaAdjunta: url_files }
        await axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/all`, producto,
            {
                headers: {
                    accept: '*/*',
                    'Content-Type': 'application/json'
                }
            }).then(async (res) => {
                if (res.data.message) {
                    toast.info("Este producto ya existe");
                    return;
                }
                toast.success("Producto registrado con éxito");
                setNotSaved(false);
                setProducto({});
                setInstitucion(undefined);
                setFiles([]);
                e.target.reset();
                // Limpiar textarea ::: Necesita refactorización.
                const textareas = document.getElementsByTagName('textarea');
                for (let i = 0; i < textareas.length; i++) {
                    textareas[i].value = '';
                }
            }).catch(() => {
                toast.error("Falta información");
            });

    }

    const setProductoItem = (e) => {
        if (!notSaved) setNotSaved(true);
        if (e.target.name === "institucion") {
            setInstitucion(e.target.value)
        }

        setProducto({
            ...Producto,
            [e.target.name]: e.target.value
        });
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
        if (!notSaved) setNotSaved(true);
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
            let { data } = await axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}api/s3/uploadFile`, {
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

    // Funciones de editado

    const callProduct = async () => {
        const data = await getProductoById(id);
        setProducto(data)
        setInstitucion(data.institucion);
        url_files = data.evidenciaAdjunta;
        document.getElementById("RVOE").checked = data.RVOE === 'on' ? true : false;
        document.getElementById("otro").value = data.tipo;
    }

    const updateCourse = async (e) => {
        e.preventDefault();
        if (!notSaved) {
            toast.info("Debes modificar la información")
            return;
        }
        await saveFilesToAWS();
        const producto = Producto;
        if (isAnyFieldEmpty(e.target)
            || producto.institucion === 'default'
            || typeof producto.institucion === 'undefined'
            || typeof producto.areaV === 'undefined') { // Si true, campos vacíos
            toast.error("Rellena los campos marcados con *");
            return;
        }
        producto.lastUpdate = "El " + getTimeStamp() + " por " + session.user.names;
        producto = { ...producto, evidenciaAdjunta: url_files }
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + Producto._id, producto)
            .then(() => {
                toast.success("Producto actualizado con éxito");
                router.push(`${process.env.NEXT_PUBLIC_ENDPOINT}vw/aprobado/` + producto._id);
            })
    }

    if (!Producto) {
        return <h1>Cargando...</h1>
    }

    return <>
        <Head>
            <title>{!session ? 'Cargando...' : session.user.names} | Alta de producto </title>
            <meta name="description" content="Login app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            <div className={styles.main_content}>
                <h1>{id === 'new' ? 'Genera un producto' : 'Actualiza el producto'}</h1>
                <div className={styles.box_container}>
                    <form onSubmit={(e) => id === "new" ? registerCourse(e) : updateCourse(e)}>
                        <div className={styles.form_group}>
                            <h2>Datos generales</h2>
                            <div className={styles.container_footer}>
                                <label className={styles.form_control}>
                                    <input type="checkbox" name="RVOE" id="RVOE" onChange={(e) => setProductoItem(e)} defaultChecked={false} />
                                    Tiene RVOE
                                </label>
                            </div>
                            <div className="radio_ck_section">
                                <h3>* Tipo de oferta</h3>
                                <select name="tipo" id="tipo" onChange={(e) => setProductoItem(e)} title="Tipo de oferta" >
                                    <option value="">Selecciona el tipo de oferta</option>
                                    <option value="Diplomado">Diplomado</option>
                                    <option value="Especialidad">Especialidad</option>
                                    <option value="Licenciatura">Licenciatura</option>
                                    <option value="Maestría">Maestría</option>
                                    <option value="Taller">Taller</option>
                                    <option value="Curso">Curso</option>
                                    <option value="Certificado">Certificado</option>
                                    <option value="Libro">Libro</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Valor del campo (Otro)"
                                    name="tipo"
                                    id="otro"
                                    style={Producto.tipo === 'Otro' ? { maxWidth: '95%' } : { display: 'none' }}
                                    onChange={(e) => setOtro(e.target.value)} />
                            </div>
                            <div className="radio_ck_section">
                                <h3>* Modalidad de oferta</h3>
                                <label className="control control-radio">
                                    Presencial
                                    <input type="radio" name="modalidad" value="Presencial" onChange={(e) => setProductoItem(e)} title="Modalidad de oferta" />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Híbrido
                                    <input type="radio" name="modalidad" value="Mixto" onChange={(e) => setProductoItem(e)} title="Modalidad de oferta" />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Coursera asincrónico
                                    <input type="radio" name="modalidad" value="Coursera asincrónico" onChange={(e) => setProductoItem(e)} title="Modalidad de oferta" />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    En línea sincrónico
                                    <input type="radio" name="modalidad" value="En línea sincrónico" onChange={(e) => setProductoItem(e)} title="Modalidad de oferta" />
                                    <div className="control_indicator"></div>
                                </label>
                            </div>
                            <div className="radio_ck_section">
                                <h3>* Institución</h3>
                                <label className="control control-radio">
                                    SAE
                                    <input type="radio" id="institucion1" name="institucion" value="sae" onChange={(e) => setProductoItem(e)} title="Institución" />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    ARTEK
                                    <input type="radio" id="institucion2" name="institucion" value="artek" onChange={(e) => setProductoItem(e)} title="Institución" />
                                    <div className="control_indicator"></div>
                                </label>
                            </div>
                            {
                                Institucion === 'default' || typeof Institucion === 'undefined' ? null :
                                    <>
                                        <div className="radio_ck_section" style={Institucion === 'sae' ? { display: 'block' } : { display: 'none' }}>
                                            <h3>* Área a la que se víncula</h3>
                                            <label className="control control-radio">
                                                Cine digital
                                                <input type="radio" name="areaV" value="Cine digital" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Animación y efectos visuales
                                                <input type="radio" name="areaV" value="Animación y efectos visuales" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Comunicación
                                                <input type="radio" name="areaV" value="Comunicación" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Diseño de videojuegos
                                                <input type="radio" name="areaV" value="Diseño de videojuegos" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Ingeniería de audio
                                                <input type="radio" name="areaV" value="Ingeniería de audio" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Negocios de la música
                                                <input type="radio" name="areaV" value="Negocios de la música" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Programación de videojuegos
                                                <input type="radio" name="areaV" value="Programación de videojuegos" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                        </div>
                                        <div className="radio_ck_section" style={Institucion === 'artek' ? { display: 'block' } : { display: 'none' }}>
                                            <h3>* Área a la que se víncula</h3>
                                            <label className="control control-radio">
                                                Gestión Tecnológica
                                                <input type="radio" name="areaV" value="Gestión tecnológica" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Desarrollo de Software
                                                <input type="radio" name="areaV" value="Desarrollo de software" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Ciencia de Datos
                                                <input type="radio" name="areaV" value="Ciencia de datos" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Ciberseguridad
                                                <input type="radio" name="areaV" value="Ciberseguridad" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Inteligencia Artificial
                                                <input type="radio" name="areaV" value="Inteligencia artificial" onChange={(e) => setProductoItem(e)} title="Área a la que se vincula" />
                                                <div className="control_indicator"></div>
                                            </label>
                                        </div>
                                    </>
                            }
                            <br />
                            <input type="text" name="quienPropone" placeholder="Persona o área que propone el producto *" defaultValue={Producto.quienPropone} onChange={(e) => setProductoItem(e)} title="Persona o área que propone el producto " />
                        </div>
                        <div className={styles.form_group}>
                            <h2>Datos del mercado</h2>
                            <input type="text" name="poblacionObj" placeholder="A quién va dirigido *" defaultValue={Producto.poblacionObj} onChange={(e) => setProductoItem(e)} title="A quién va dirigido" />
                            <textarea
                                name="justificacionPropuesta"
                                id="justificacionPropuesta"
                                maxLength="500"
                                placeholder='Justificación de la propuesta *'
                                defaultValue={Producto.justificacionPropuesta}
                                style={{ marginBottom: '-0.5em' }}
                                onChange={(e) => setProductoItem(e)}
                                title="Justificación de la propuesta"></textarea>
                            <div className={styles.files_zone}>
                                <span className="info_zone">
                                    Si tienes alguna evidencia que nos ayude a conocer las necesidades del mercado, tendencias, competidores, etc. Adjúntalo aquí.
                                    Archivos permitidos: PDF, Word, Excel, PowerPoint, PNG, JPG (máximo 5 archivos)
                                </span>
                                <label className={styles.form_files}>
                                    <input type="file" name="files_att" id="fileUpload" onChange={(e) => verifyFiles(e)} multiple />
                                    Adjuntar evidencia
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
                        </div>
                        <div className={styles.form_group}>
                            <h2>Datos de la propuesta</h2>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Título tentativo de la propuesta #1 *"
                                defaultValue={Producto.nombre}
                                onChange={(e) => setProductoItem(e)}
                                title="Título tentativo de la propuesta #1" />
                            <input
                                type="text"
                                name="nombre_2"
                                placeholder="Título tentativo de la propuesta #2"
                                defaultValue={Producto.nombre_2}
                                onChange={(e) => setProductoItem(e)} />
                            <input
                                type="text"
                                name="nombre_3"
                                placeholder="Título tentativo de la propuesta #3"
                                defaultValue={Producto.nombre_3}
                                onChange={(e) => setProductoItem(e)} />
                            <textarea
                                name="genDescProg"
                                id="genDescProg"
                                placeholder='Descripción general del programa *'
                                style={{ margin: 'inherit', marginTop: '1em' }}
                                defaultValue={Producto.genDescProg} onChange={(e) => setProductoItem(e)}
                                title="Descripción general del programa"></textarea>
                            <textarea
                                name="objetivosPrograma"
                                id="objetivosPrograma"
                                placeholder='Objetivos del programa *'
                                style={{ margin: 'inherit', marginTop: '1em' }}
                                defaultValue={Producto.objetivosPrograma} onChange={(e) => setProductoItem(e)}
                                title="Objetivos del programa"></textarea>
                            <textarea
                                name="propuestaInicialTemario"
                                id="propuestaInicialTemario"
                                placeholder='Propuesta inicial de temas *'
                                style={{ margin: 'inherit', marginTop: '1em' }}
                                defaultValue={Producto.propuestaInicialTemario} onChange={(e) => setProductoItem(e)}
                                title='Propuesta inicial de temas'></textarea>
                            <input
                                type="number"
                                name="horasTotales"
                                placeholder="# de horas totales del programa"
                                defaultValue={Producto.horasTotales}
                                min={0}
                                onChange={(e) => setProductoItem(e)} />
                            <input
                                type="text"
                                name="periodicidad"
                                placeholder="Periodicidad"
                                defaultValue={Producto.periodicidad}
                                min={0}
                                onChange={(e) => setProductoItem(e)} />
                            <input type="text" name="responsable" placeholder="Propuesta de experto" defaultValue={Producto.responsable} onChange={(e) => setProductoItem(e)} maxLength={40} title="Propuesta de experto" />
                        </div>
                        <div className={styles.form_group}>
                            <h2>Recursos extra necesarios</h2>
                            <span className="info_zone">
                                Además de los honorarios de los docentes, ¿qué otros
                                requerimientos tiene la oferta académica? Por favor, enlista los
                                conceptos en la caja de texto a continuación
                                (Ej; Proyector X: x lúmens. Software W 1 licencia x persona,
                                Renta de foro Z por X días.
                            </span>
                            <textarea name="descripcion" id="descripcion" maxLength="500" placeholder="Descripción general" defaultValue={Producto.descripcion} onChange={(e) => setProductoItem(e)}></textarea>
                            <span className="info_zone">
                                Si esta sección no aplica para tu propuesta, favor de escribir
                                “NA” en la caja de texto.
                            </span>
                            <div className={styles.container_footer}>
                                <input type="submit" value={id === 'new' ? "Registrar producto" : "Actualizar producto"} />
                            </div>
                        </div>
                    </form>
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

/**
 * Autor: FernandoFeN
 * Descripción: esto necesita una refactorización (eventualmente, si esto sigue creciendo, la hará el programador)
 * Fecha: 01 de febrero del 2022
 */