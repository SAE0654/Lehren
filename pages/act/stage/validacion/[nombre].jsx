import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import Layout from '../../../../components/Layout';
import styles from "../../../../styles/pages/ventas.module.scss";
import { acceptedFiles, isAnyFieldEmpty, sessionHasExpired } from '../../../../utils/forms';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import ValidationToolsForm from '../../../../components/validationTools/validation_tools';
import Swal from 'sweetalert2/dist/sweetalert2';
import VotosComponent from '../../../../components/VotosComponent';

const BUCKET_URI = "https://sae-files.s3.amazonaws.com/";

export default function StepTwo() {
    const router = useRouter();
    const [Producto, setProducto] = useState(null);
    const [Files, setFiles] = useState([]);
    const [Objetivos, setObjetivos] = useState([]);
    const [HerramientasValidacion, setHerramientasValidacion] = useState([])
    // Función de cambios sin guardar
    const [notSaved, setNotSaved] = useState(false);

    const { nombre } = router.query;
    const { data: session } = useSession();

    let url_files = [];

    useEffect(() => {
        getId();
        if (!Producto) {
            getProductoByNombre();
        }
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add("consultas_bg");
        sessionHasExpired();
    }, []);

    const getId = () => {
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

    const uploadF2 = async (e) => {
        e.preventDefault();
        await saveFilesToAWS();
        const producto = Producto;
        producto.archivosETP2 = url_files;
        producto.statusProducto = "Recolección";
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
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + nombre, producto,
            {
                headers: {
                    accept: '*/*',
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                Swal.fire(
                    'Datos guardados',
                    'Etapa de validación',
                    'success'
                  )
                e.target.reset();
                router.push(`${process.env.NEXT_PUBLIC_ENDPOINT}/vw/query/` + Producto.institucion);
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

    const getMinAndMaxDate = (type) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        const day = date.getDate();
        if (type === "max") {
            return (year + 1) + "-" + month + "-" + day;
        }
        if (type === "min") {
            return (year - 1) + "-" + month + "-" + day;
        }
    }

    if (!Producto) {
        return <h1>Cargando...</h1>
    }

    return <>
        <Head>
            <title>Etapa de propuesta | {!session ? 'Cargando...' : session.user.names}</title>
            <meta name="description" content="Login app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            <div className={styles.main_content} style={{ transform: 'translate(0%, -40%)', maxHeight: '1000px' }}>
                <div className={styles.box_container}>
                    <h1 className={styles.t_container} style={{ marginTop: "10em" }}>Proceso de propuesta</h1>
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
                                    <VotosComponent nombre={Producto.nombre} likes={Producto.likes} dislikes={Producto.dislikes} />
                                </div>
                            </div>
                            <div className="radio_ck_section">
                                <h3>Objetivos</h3>
                                <label className="control control-radio valid">
                                    Nombre de la oferta educativa
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Nombre de la oferta educativa"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Público objetivo
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Público objetivo"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Demanda
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Demanda"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Contenido académico
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Contenido académico"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Costos
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Costos"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator valid"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Calidad educativa
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Calidad educativa"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Nuevos productos
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Nuevos productos"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Actualización del producto
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Actualización del producto"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator valid"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Perfil de estudiantes (ingreso/egreso)
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Perfil de estudiantes (ingreso/egreso)"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator valid"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Impacto en la industria
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Impacto en la industria"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator valid"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Mercados
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Mercados"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator valid"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Costos
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Costos"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator valid"></div>
                                </label>
                                <label className="control control-radio valid">
                                    Calidad educativa
                                    <input
                                        type="checkbox"
                                        name="objetivos"
                                        value="Calidad educativa"
                                        onChange={(e) => setObjetivoItem(e)}
                                    />
                                    <div className="control_indicator valid"></div>
                                </label>
                                <label className="control control-radio valid">
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
                            <br />
                            <div className="fecha">
                                <label htmlFor="fechaEj" style={{ color: "#fff" }}>Fecha de ejecución de la actividad: </label>
                                <input type="date" name="fechaEjecucion" id="fechaEj" required onChange={(e) => handleChange(e)} min={getMinAndMaxDate("min")} max={getMinAndMaxDate("max")} />
                                <br />
                                <label htmlFor="fechaEn" style={{ color: "#fff" }}>Fecha de entrega de resultados: </label>
                                <input type="date" name="fechaEntrega" id="fechaEn" required onChange={(e) => handleChange(e)} min={getMinAndMaxDate("min")} max={getMinAndMaxDate("max")} />
                            </div>
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
