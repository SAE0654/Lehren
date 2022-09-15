import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import styles from "../../../styles/pages/ventas.module.scss";
import { NavLink } from '../../../components/NavLink';
import { acceptedFiles, sessionHasExpired } from '../../../utils/forms';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';

export default function StepTwo() {
    const router = useRouter();
    const [Producto, setProducto] = useState(null);
    const [FilesETP1, setFilesETP1] = useState([]);
    const [FilesETP2, setFilesETP2] = useState([]);
    const [Files, setFiles] = useState([]);

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
                console.log(res.data)
                setFilesETP1(res.data.archivosETP1);
                setFilesETP2(res.data.archivosETP2);
            });
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
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/${id}`, Producto)
            .then(() => {
                toast.success("Archivo eliminado")
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

    const uploadF2 = (e) => {
        e.preventDefault();
        console.log(e)
    }

    if (!Producto) {
        return <h1>Cargando...</h1>
    }

    return <>
        <Head>
            <title>{!session ? 'Cargando...' : session.user.username} | Vista de datos </title>
            <meta name="description" content="Login app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            <div className={styles.main_content} style={{ transform: 'translate(0%, -40%)', maxHeight: '1000px' }}>
                <div className={styles.box_container}>
                    <h1 className={styles.t_container} style={{ marginTop: "10em" }}>Formulario 2</h1>
                    <img src="/img/LOGO2.png" alt="" />
                    <div className={styles.info_container}>
                        <div className={styles.info_box_step2}>
                            <h2 className={styles.title}>Datos generales</h2>
                            <p><b>Nombre del producto</b></p>
                            <p className={styles.right_border}>{Producto.nombre}</p>
                            <p className={styles.last_row}><b>Prioridad:</b></p>
                            <p className={styles.right_bottom_border}>{Producto.prioridad ? Producto.prioridad : "baja"}</p>
                            <p><b>Institución</b></p>
                            <p className={styles.right_border}>{Producto.institucion}</p>
                            <p><b>Oferta educativa</b></p>
                            <p className={styles.right_border}>{Producto.tipo}</p>
                            <p><b>Modalidad</b></p>
                            <p className={styles.right_border}>{Producto.modalidad}</p>
                            <p className={styles.last_row}><b>Objetivos:</b></p>
                            <p className={styles.right_bottom_border}>{Producto.objetivo}</p>
                        </div>
                    </div>
                    <br />
                    <form style={{ flexDirection: 'column', alignItems: 'center' }} onSubmit={(e) => uploadF2(e)}>
                        <div className={styles.form_group}>
                            <textarea name="consideraciones" placeholder="Comentarios o consideraciones"></textarea>
                            <input type="text" name="fechaEjecucion" placeholder="Fecha de ejecución de la actividad" />
                            <input type="text" name="fechaEntrega" placeholder="Fecha de entrega de resultados" />
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
                        <input type="submit" value="Ir al paso 3" />
                    </form>

                    {/* <NavLink href="/" exact>
                        <button>
                            Regresar a Inicio
                        </button>
                    </NavLink> */}
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
