import { Router, useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import styles from "../../../styles/pages/ventas.module.scss";
import { acceptedFiles, isAnyFieldEmpty, sessionHasExpired } from '../../../utils/forms';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2/dist/sweetalert2';
import ValidationToolsForm from '../../../components/forms/validation_tools';

const BUCKET_URI = "https://sae-files.s3.amazonaws.com/";

export default function StepTwo() {
    const router = useRouter();
    const [Producto, setProducto] = useState(null);
    const [Files, setFiles] = useState([]);
    const [Objetivos, setObjetivos] = useState([]);
    const [HerramientasValidacion, setHerramientasValidacion] = useState([])
    // Función de cambios sin guardar
    const [notSaved, setNotSaved] = useState(false);

    const { id } = router.query;
    const { data: session } = useSession();

    let url_files = [];

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
        await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + id)
            .then((res) => {
                setProducto(res.data);
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

    const uploadF2 = async (e) => {
        e.preventDefault();
        await saveFilesToAWS();
        const producto = Producto;
        producto.archivosETP2 = url_files;
        producto.status = "Recolección";
        producto.etapa = "Resultado"
        if (isAnyFieldEmpty(e.target) || typeof producto.prioridad === 'undefined') { // Si true, campos vacíos
            toast.error("Rellena todos los campos");
            return;
        }
        if (Objetivos.length <= 0) {
            toast.error("Elige al menos un objetivo");
            return;
        }
        if (HerramientasValidacion.length <= 0) {
            toast.error("Elige al menos una herramienta de validación");
            return;
        }
        producto.objetivo = Objetivos;
        producto.instrumentoValidacion = HerramientasValidacion;
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + id, producto,
            {
                headers: {
                    accept: '*/*',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                toast.info(res.data.message);
                e.target.reset();
                router.push(`${process.env.NEXT_PUBLIC_ENDPOINT}/view/resultado/` + id);
            }).catch(() => {
                toast.error("Error al completar");
            })
    }

    const handleChange = (e) => {
        if (!notSaved) setNotSaved(true);
        setProducto({
            ...Producto,
            [e.target.name]: e.target.value
        });
    }

    const setObjetivoItem = (e) => {
        let objetivos = Objetivos;
        if (e.target.checked) {
            objetivos.push(e.target.value);
        } else {
            objetivos = objetivos.filter((objetivo) => objetivo !== e.target.value);
        }
        setObjetivos(objetivos);
    }

    if (!Producto) {
        return <h1>Cargando...</h1>
    }

    return <>
        <Head>
            <title>Etapa de validación | {!session ? 'Cargando...' : session.user.names}</title>
            <meta name="description" content="Login app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            <div className={styles.main_content} style={{ transform: 'translate(0%, -40%)', maxHeight: '1000px' }}>
                <div className={styles.box_container}>
                    <h1 className={styles.t_container} style={{ marginTop: "10em" }}>Proceso de validación</h1>
                    <form style={{ flexDirection: 'column', alignItems: 'center' }} onSubmit={(e) => uploadF2(e)}>
                        <div className={styles.form_group} style={{ width: '100%' }}>
                        <div className={styles.container_footer}>
                            <div className={styles.prioridad} style={{ justifyContent: "center" }}>
                                <span>Prioridad: </span>
                                <label className={styles.form_control} style={{ color: "red" }}>
                                    <input type="radio" name="prioridad" value="alta" style={{ color: "red" }} onChange={(e) => handleChange(e)} />
                                    Alta
                                </label>
                                <label className={styles.form_control} style={{ color: "yellow" }}>
                                    <input type="radio" name="prioridad" value="media" style={{ color: "yellow" }} onChange={(e) => handleChange(e)} />
                                    Media
                                </label>
                                <label className={styles.form_control} style={{ color: "green" }}>
                                    <input type="radio" name="prioridad" value="baja" style={{ color: "green" }} onChange={(e) => handleChange(e)} />
                                    Baja
                                </label>
                            </div>
                        </div>
                            <div className="radio_ck_section">
                                <h3>Objetivos</h3>
                                <label className="control control-radio">
                                    Nombre de la oferta educativa
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Nombre de la oferta educativa"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Público objetivo
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Público objetivo"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Demanda
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Demanda"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Contenido académico
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Contenido académico"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Costos
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Costos"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Calidad educativa
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Calidad educativa"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Nuevos productos
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Nuevos productos"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Actualización del producto
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Actualización del producto"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Perfil de estudiantes (ingreso/egreso)
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Perfil de estudiantes (ingreso/egreso)"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Impacto en la industria
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Impacto en la industria"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Mercados
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Mercados"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Costos
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Costos"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Calidad educativa
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Calidad educativa"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio">
                                    Tendencia
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Tendencia"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                            </div>
                            <ValidationToolsForm HerramientasValidacion={HerramientasValidacion} setHerramientasValidacion={setHerramientasValidacion} />
                            <br />
                            <textarea name="generalComments" placeholder="Comentarios generales" maxLength="10000" required onChange={(e) => handleChange(e)} style={{ marginTop: '2em' }}></textarea>
                            <input type="text" name="fechaEjecucion" placeholder="Fecha de ejecución de la actividad" required onChange={(e) => handleChange(e)} />
                            <input type="text" name="fechaEntrega" placeholder="Fecha de entrega de resultados" required onChange={(e) => handleChange(e)} />
                        </div>
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
                        <input type="submit" value="Guardar formulario" />
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
