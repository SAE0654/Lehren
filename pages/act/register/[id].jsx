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

    let url_files = [];

    useEffect(() => {
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add("registro_bg");
        sessionHasExpired();
        if (id === "new") return;
        callProduct();
    }, [id]);

    useEffect(() => {
        if (id === "new") {
            setProducto({});
            setInstitucion(undefined);
            setFiles([]);
            setOtro(null);
            document.getElementById("razon").value = "";
            document.getElementById("descripcion").value = "";
        }
    }, [id])


    const registerCourse = async (e) => {
        e.preventDefault();
        const producto = Producto;
        producto = { ...producto, creadoPor: session.user.names + ", el " + getTimeStamp() };
        producto = { ...producto, RVOE: producto.RVOE ? producto.RVOE : 'off' };

        if (isAnyFieldEmpty(e.target)
            || producto.institucion === 'default'
            || typeof producto.institucion === 'undefined'
            || typeof producto.areaV === 'undefined') { // Si true, campos vacíos
            toast.error("Rellena todos los campos");
            console.log(e.target)
            return;
        }
        if((producto.tipo === 'Otro' && Otro === null) || Otro?.trim() === '') {
            toast.error("El campo Otro no puede estar vacío");
            return;
        }
        if(producto.tipo === 'Otro') {
            producto.tipo = Otro;
        }
        await saveFilesToAWS();
        producto = { ...producto, archivosETP1: url_files }
        console.log(producto)
        await axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/all`, producto,
            {
                headers: {
                    accept: '*/*',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
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
                document.getElementById("razon").value = "";
                document.getElementById("descripcion").value = "";
            }).catch(() => {
                toast.error("Falta información");
            });

    }

    const setProductoItem = (e) => {
        if (!notSaved) setNotSaved(true);
        if (e.target.name === 'institucion') {
            setInstitucion(e.target.value);
            Producto.areaV = undefined;
        }
        if (e.target.name === 'RVOE') {
            setProducto({
                ...Producto,
                [e.target.name]: e.target.checked ? 'on' : 'off'
            });
            return;
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
        document.getElementById("RVOE").checked = data.RVOE === 'on' ? true : false;
        document.getElementById("otro").value = data.tipo;
    }

    const updateCourse = async (e) => {
        e.preventDefault();
        if (!notSaved) {
            toast.info("Debes modificar la información")
            return;
        }
        const producto = Producto;
        if (isAnyFieldEmpty(e.target)
            || producto.institucion === 'default'
            || typeof producto.institucion === 'undefined'
            || typeof producto.areaV === 'undefined') { // Si true, campos vacíos
            toast.error("Rellena todos los campos");
            return;
        }
        producto.lastUpdate = "El " + getTimeStamp() + " por " + session.user.names;
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
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Propuesta del nombre del producto"
                                defaultValue={Producto.nombre}
                                onChange={(e) => setProductoItem(e)} />
                            <div className="radio_ck_section">
                                <h3>Tipo de oferta</h3>
                                <label className="control control-radio">
                                    Diplomado
                                    <input type="radio" name="tipo" value="Diplomado" checked={Producto.tipo === 'Diplomado' ? true : false} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Especialidad
                                    <input type="radio" name="tipo" value="Especialidad" checked={Producto.tipo === 'Especialidad'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Licenciatura
                                    <input type="radio" name="tipo" value="Licenciatura" checked={Producto.tipo === 'Licenciatura'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Maestría
                                    <input type="radio" name="tipo" value="Maestría" checked={Producto.tipo === 'Maestría'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Taller
                                    <input type="radio" name="tipo" value="Taller" checked={Producto.tipo === 'Taller'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Curso
                                    <input type="radio" name="tipo" value="Curso" checked={Producto.tipo === 'Curso'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Certificado
                                    <input type="radio" name="tipo" value="Certificado" checked={Producto.tipo === 'Certificado'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    <span>Libro</span>
                                    <input type="radio" name="tipo" value="Libro" checked={Producto.tipo === 'Libro'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    <span>Otro</span>
                                    <input type="radio" name="tipo" id="tipoField" value="Otro" checked={Producto.tipo === 'Otro'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <input 
                                type="text" 
                                placeholder="Valor del campo (Otro)"
                                name="tipo"
                                id="otro"
                                style={Producto.tipo === 'Otro' ? { maxWidth: '95%' } : { display: 'none'}}
                                onChange={(e) => setOtro(e.target.value)} />
                            </div>
                            <div className="radio_ck_section">
                                <h3>Modalidad de oferta</h3>
                                <label className="control control-radio">
                                    Presencial
                                    <input type="radio" name="modalidad" value="Presencial" checked={Producto.modalidad === 'Presencial'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Mixto
                                    <input type="radio" name="modalidad" value="Mixto" checked={Producto.modalidad === 'Mixto'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    En línea asincrónico
                                    <input type="radio" name="modalidad" value="En línea asincrónico" checked={Producto.modalidad === 'En línea asincrónico'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    En línea sincrónico
                                    <input type="radio" name="modalidad" value="En línea sincrónico" checked={Producto.modalidad === 'En línea sincrónico'} onChange={(e) => setProductoItem(e)} />
                                    <div className="control_indicator"></div>
                                </label>
                            </div>
                            <select name="institucion" id="institucion" value={Producto.institucion} onChange={(e) => setProductoItem(e)} >
                                <option value="default">Selecciona una institución</option>
                                <option value="sae">SAE</option>
                                <option value="artek">Artek</option>
                            </select>
                            {
                                Institucion === 'default' || typeof Institucion === 'undefined' ? null :
                                    <>
                                        <div className="radio_ck_section" style={Institucion === 'sae' ? { display: 'block' } : { display: 'none' }}>
                                            <h3>Área a la que se víncula</h3>
                                            <label className="control control-radio">
                                                Cine digital
                                                <input type="radio" name="areaV" value="Cine digital" checked={Producto.areaV === 'Cine digital'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Animación y efectos visuales
                                                <input type="radio" name="areaV" value="Animación y efectos visuales" checked={Producto.areaV === 'Animación y efectos visuales'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Comunicación
                                                <input type="radio" name="areaV" value="Comunicación" checked={Producto.areaV === 'Comunicación'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Diseño de videojuegos
                                                <input type="radio" name="areaV" value="Diseño de videojuegos" checked={Producto.areaV === 'Diseño de videojuegos'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Ingeniería de audio
                                                <input type="radio" name="areaV" value="Ingeniería de audio" checked={Producto.areaV === 'Ingeniería de audio'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Negocios de la música
                                                <input type="radio" name="areaV" value="Negocios de la música" checked={Producto.areaV === 'Negocios de la música'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Programación de videojuegos
                                                <input type="radio" name="areaV" value="Programación de videojuegos" checked={Producto.areaV === 'Programación de videojuegos'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                        </div>
                                        <div className="radio_ck_section" style={Institucion === 'artek' ? { display: 'block' } : { display: 'none' }}>
                                            <h3>Área a la que se víncula</h3>
                                            <label className="control control-radio">
                                                Gestión Tecnológica
                                                <input type="radio" name="areaV" value="Gestión tecnológica" checked={Producto.areaV === 'Gestión tecnológica'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Desarrollo de Software
                                                <input type="radio" name="areaV" value="Desarrollo de software" checked={Producto.areaV === 'Desarrollo de software'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Ciencia de Datos
                                                <input type="radio" name="areaV" value="Ciencia de datos" checked={Producto.areaV === 'Ciencia de datos'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Ciberseguridad
                                                <input type="radio" name="areaV" value="Ciberseguridad" checked={Producto.areaV === 'Ciberseguridad'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                            <label className="control control-radio">
                                                Inteligencia Artificial
                                                <input type="radio" name="areaV" value="Inteligencia artificial" checked={Producto.areaV === 'Inteligencia artificial'} onChange={(e) => setProductoItem(e)} />
                                                <div className="control_indicator"></div>
                                            </label>
                                        </div>
                                    </>
                            }
                            <div className={styles.files_zone} style={id !== "new" ? { display: "none" } : { display: "block" }}>
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
                        </div>
                        <div className={styles.form_group}>
                            <h2>Descripción general</h2>
                            <input type="text" name="quienPropone" placeholder="Persona o área que propone el producto" defaultValue={Producto.quienPropone} onChange={(e) => setProductoItem(e)} />
                            <textarea name="razon" id="razon" maxLength="500" placeholder='Razón o necesidad de la propuesta' defaultValue={Producto.razon} onChange={(e) => setProductoItem(e)}></textarea>
                            <input type="text" name="poblacionObj" placeholder="A quién va dirigido" defaultValue={Producto.poblacionObj} onChange={(e) => setProductoItem(e)} />
                            <textarea name="descripcion" id="descripcion" maxLength="500" placeholder="Descripción general" defaultValue={Producto.descripcion} onChange={(e) => setProductoItem(e)}></textarea>
                            <input type="text" name="responsable" placeholder="Responsable del programa" defaultValue={Producto.responsable} onChange={(e) => setProductoItem(e)} maxLength={40} />
                            <div className={styles.container_footer}>
                                <label className={styles.form_control}>
                                    <input type="checkbox" name="RVOE" id="RVOE" onChange={(e) => setProductoItem(e)} />
                                    RVOE
                                </label>
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
