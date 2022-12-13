// CORE
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// SESSION
import { getSession, useSession } from "next-auth/react";
// ESTILOS
import styles from "../../../styles/pages/ventas.module.scss";
import { AiOutlineClose, AiOutlineEye, AiFillDelete, AiOutlineSave } from 'react-icons/ai';
import { BsSearch } from "react-icons/bs";
import { MdAddComment } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2/dist/sweetalert2';
import { BiEdit, BiSad } from "react-icons/bi"
// COMPONENTES Y FUNCIONES EXTERNAS
import Layout from '../../../components/Layout';
import { getTimeStamp, sessionHasExpired } from '../../../utils/forms';
import { NavLink } from '../../../components/NavLink';
import Pagination from '../../../components/Pagination';
import Comment from '../../../components/Comment';
import { CSVLink } from 'react-csv';
import VotosComponent from '../../../components/VotosComponent';

let pageSize = 4;

export default function Consultas() {
    const [Productos, setProductos] = useState([]);
    const [TempProductos, setTempProductos] = useState([]);
    const [NoResults, setNoResults] = useState(false);
    const [Query, setQuery] = useState('');
    const [Loading, setLoading] = useState(true);
    // Monitor
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setlastPage] = useState(1);
    const Route = useRouter();
    //CSV
    const [CSV, setCSV] = useState([]);
    const [CSVChosed, setCSVChosed] = useState(null);

    const headers = [
        { label: "No.", key: "no" },
        { label: "Nombre del producto", key: "nombre" },
        { label: "Responsable", key: "responsable" },
        { label: "Estatus", key: "statusProducto" },
        { label: "Tipo", key: "tipo" },
        { label: "Modalidad", key: "modalidad" },
        { label: "Area vinculada", key: "areaV" },
        { label: "Persona o área que propone", key: "quienPropone" },
        { label: "Razón", key: "razon" },
        { label: "Población objetivo", key: "poblacionObj" },
        { label: "Descripción", key: "descripcion" },
        { label: "Institución", key: "institucion" },
        { label: "Creado por", key: "creadoPor" },
        { label: "RVOE", key: "RVOE" },
        { label: "Me gusta", key: "meGusta" },
        { label: "No me gusta", key: "noMeGusta" }
    ];

    //Editado
    const [CurrentId, setCurrentId] = useState(null);
    const [editInputResponsable, setEditInputResponsable] = useState(false);
    const [InputResponsableValue, setInputResponsableValue] = useState(null);

    const { institucion } = Route.query;
    const { data: session } = useSession();

    useEffect(() => {
        if (Productos.length <= 0) {
            getProductos();
        }
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add("consultas_bg");
        sessionHasExpired();
    }, []);

    useEffect(() => {
        setCurrentId(null);
        setEditInputResponsable(false);
        setInputResponsableValue(null);
        getProductos();
    }, [institucion]);

    const computePages = (data) => {
        const firstPageIndex = (currentPage - 1) * pageSize;
        let lastPageIndex = firstPageIndex + pageSize;
        setlastPage(lastPageIndex)
        data === null ? setTempProductos(() => Productos.slice(firstPageIndex, lastPageIndex)) : setTempProductos(() => data.slice(firstPageIndex, lastPageIndex));
        return Productos.slice(firstPageIndex, lastPageIndex);
    }

    useMemo(() => {
        computePages(null);
    }, [currentPage]);

    const getProductos = async () => {
        setLoading(true);
        await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + institucion).then((res) => {
            setProductos(res.data);
            setTempProductos(res.data);
            setLoading(false);
            computePages(res.data);
        });
    }

    const search = (e) => {
        const searchText = e.target.value.trim().length <= 0 ? '' : e.target.value;
        setQuery(searchText);
        if (searchText.trim().length <= 0) return;
        let productos = [];
        Productos.map((field, index) => {
            if (field.nombre.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                || field.institucion.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                || field.creadoPor.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                productos.push(Productos[index]);
            }
        });

        if (productos.length <= 0) {
            setNoResults(true);
        } else {
            setNoResults(false);
        }
        setTempProductos(productos);
    }

    const deleteProduct = async (nombre) => {
        Swal.fire({
            title: '¿Borrar producto?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + nombre)
                    .then(() => {
                        Swal.fire(
                            'Eliminado',
                            'Producto borrado con éxito',
                            'success'
                        )
                        getProductos();
                    });
            }
        })
    }

    const displayCommentSection = async (nombre, commentario) => {
        const hasAlreadyAComment = commentario === null || commentario.length === 0 ? false : true;
        await Swal.fire({
            input: 'textarea',
            inputLabel: session.user.names,
            inputValue: hasAlreadyAComment ? commentario[0].comentarios : '',
            inputPlaceholder: hasAlreadyAComment ? commentario[0].comentarios : 'Agrega un comentario al registro...',
            inputAttributes: {
                'aria-label': 'Escribe tu comentario aquí',
                maxlength: 500
            },
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
        }).then((res) => {
            if (res.isDismissed) return;
            if (res.value.trim().length === 0 && res.isConfirmed) {
                toast.warn("El comentario no puede estar vacío");
                displayCommentSection()
                return;
            }
            saveComment(res.value, nombre, hasAlreadyAComment);
        })
    }

    const saveComment = async (comentario, nombre, alreadyAdded) => {
        const producto = Productos.filter((item) => item.nombre === nombre);
        producto[0].comentarios = [{
            user: session.user.names,
            comentarios: comentario,
            createdAt: getTimeStamp()
        }];
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/${producto[0].nombre}=updateComment`, producto[0])
            .then(() => {
                toast.success(alreadyAdded ? "Comentario actualizado" : "Comentario agregado");
                getProductos()
            })
    }

    const prepareCSV = async () => {
        const inputOptions = {
            "sae": "SAE",
            "artek": "ARTEK",
            "all": "Todo"
        }

        const { value: institucionAExportar } = await Swal.fire({
            title: 'Selecciona qué exportar',
            input: 'radio',
            inputOptions: inputOptions,
            confirmButtonText: "Descargar",
            inputValidator: (value) => {
                if (!value) {
                    return '¡Debes elegir algo!'
                }
            }
        })

        if (institucionAExportar) {
            setCSVChosed(institucionAExportar === "all" ? "todos" : institucionAExportar);
            await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/csv/` + institucionAExportar).then((res) => {
                setDataToCSV(res.data);
            });
        }
    }

    const setDataToCSV = (data) => {
        const _CSV = [];
        data.map((item, index) => {
            _CSV = [..._CSV, {
                no: index + 1,
                nombre: item.nombre,
                statusProducto: item.statusProducto,
                responsable: item.responsable ? item.responsable : "No ha sido asignado",
                tipo: item.tipo,
                modalidad: item.modalidad,
                areaV: item.areaV,
                quienPropone: item.quienPropone,
                razon: item.razon,
                poblacionObj: item.poblacionObj,
                descripcion: item.descripcion,
                institucion: item.institucion,
                creadoPor: item.creadoPor,
                RVOE: item.RVOE === "off" ? "No tiene RVOE" : "Tiene RVOE",
                meGusta: item.likes.length || 0,
                noMeGusta: item.dislikes.length || 0
            }]
        });
        setCSV(_CSV);
    }

    useEffect(() => {
        if (CSV.length > 0) {
            document.getElementById("downloadCSV").click();
        }
    }, [CSV]);

    const updateResponsable = async (id) => {
        if (InputResponsableValue === null || InputResponsableValue === '') {
            toast.info("Debes escribir algo");
            return;
        }
        const producto = Productos.filter((_producto) => _producto._id === id);
        if (InputResponsableValue === producto[0].responsable) {
            toast.info("El valor no puede ser el mismo");
            return;
        }
        producto[0].responsable = InputResponsableValue;
        producto[0].lastUpdate = getTimeStamp() + " por " + session.user.names;
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/${producto[0].nombre}=updateResponsable`, producto[0]).then(() => {
            toast.success("Campo actualizado con éxito");
        });
        setEditInputResponsable(false);
        setCurrentId(null);
    }

    return <>
        <Head>
            <title>{!session ? 'Cargando...' : session.user.names} | Consultas </title>
            <meta name="description" content="Login app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            {
                Productos.length <= 0 && !Loading ?
                    <div className="badge_info">
                        <h1>No hay consultas</h1>
                        <BiSad className="icon" />
                        <NavLink href="/act/register/new">Carga tu primer producto</NavLink>
                    </div> :
                    <>
                        <div className={styles.main_content}>
                            <h1>Consultas</h1>
                            <div className={styles.action_bar}>
                                <div className={styles.search} onSubmit={(e) => search(e)}>
                                    <label htmlFor="search" className={styles.search_icon}>
                                        {Query !== '' ?
                                            <AiOutlineClose
                                                className="btn"
                                                onClick={() => (setQuery(''), setNoResults(false), computePages(Productos), setCurrentPage(1))} />
                                            : <BsSearch />}
                                    </label>
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        placeholder="Busca registros por nombre, institución o creador"
                                        onChange={(e) => search(e)}
                                        defaultValue={Query}
                                        value={Query} />
                                    {
                                        NoResults ?
                                            <span className={styles.alert_badge}>
                                                {Query.trim().length <= 0 ?
                                                    <>Escribe algo o <a onClick={() => (computePages(Productos), setNoResults(false))}>restaura los datos</a></>
                                                    : <>No hay resultados para <b>{Query}</b></>}
                                            </span>
                                            : null
                                    }
                                </div>
                                <div className={styles.filters}>
                                    <CSVLink data={CSV} headers={headers} filename={`${CSVChosed}.csv`} style={{ display: "none" }} id="downloadCSV">Exportar</CSVLink>
                                    <a href="#" onClick={() => prepareCSV()}>Exportar CSV</a>
                                </div>
                            </div>
                            {
                                TempProductos.length <= 0 ? null :
                                    <table className={styles.table + " scroll"}>
                                        <thead>
                                            <tr>
                                                <th>No. </th>
                                                <th className="medium">Etapa</th>
                                                <th>Estatus</th>
                                                <th>Votación</th>
                                                <th>Nombre del producto</th>
                                                <th className="medium">Responsable</th>
                                                <th>Tipo de oferta</th>
                                                <th>Modalidad</th>
                                                <th>Área vinculada</th>
                                                <th>Persona o área que propone</th>
                                                <th>Razón</th>
                                                <th>Población objetivo</th>
                                                <th>Descripción</th>
                                                <th>Institución</th>
                                                <th>Creado por</th>
                                                <th>Aprobado por</th>
                                                <th>Última actualización</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                TempProductos.map((producto, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {(lastPage - pageSize) + index + 1}
                                                        </td>
                                                        <td>
                                                            <div className={styles.action_by_id}>
                                                                <NavLink href={"/vw/aprobado/" + producto.nombre} exact>
                                                                    <button>
                                                                        <AiOutlineEye />
                                                                    </button>
                                                                </NavLink>
                                                                <button
                                                                    onClick={() => deleteProduct(producto.nombre)}>
                                                                    <AiFillDelete />
                                                                </button>
                                                                <button
                                                                    className="comment_card"
                                                                    onClick={() => displayCommentSection(producto.nombre, producto.comentarios)}>
                                                                    <MdAddComment />
                                                                </button>
                                                                <Comment comments={producto.comentarios} />
                                                                {
                                                                    session.user.rol === "administrador" ?
                                                                        producto.etapa === "Aprobado" ?
                                                                            <div className={styles.etapa2} style={{ backgroundColor: "green" }}>
                                                                                <NavLink
                                                                                    href={"/vw/aprobado/" + producto.nombre}
                                                                                    exact>
                                                                                    {producto.etapa}
                                                                                </NavLink>
                                                                            </div>
                                                                            :
                                                                            <div className={styles.etapa2}>
                                                                                <NavLink
                                                                                    href={
                                                                                        `/vw/${producto.etapa === "Propuesta" || producto.etapa === "Validación" || producto.etapa === "Pendiente"
                                                                                            ? "validacion" :
                                                                                            producto.etapa.toLowerCase()}/` + producto.nombre}
                                                                                    exact>
                                                                                    {producto.etapa}
                                                                                </NavLink>
                                                                            </div>
                                                                        : null
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="short"> {producto.statusProducto} </td>
                                                        <td>
                                                            <VotosComponent nombre={producto.nombre} likes={producto.likes} dislikes={producto.dislikes} />
                                                        </td>
                                                        <td className="long"> {producto.nombre} </td>
                                                        <td className="medium" style={{ padding: '4em', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                            {
                                                                editInputResponsable && CurrentId === producto._id ?
                                                                    <input type="text"
                                                                        name="responsable"
                                                                        defaultValue={producto.responsable}
                                                                        disabled={!editInputResponsable}
                                                                        onChange={(e) => setInputResponsableValue(e.target.value)}
                                                                        id={producto._id}
                                                                        style={{ width: '50%', minWidth: 'inherit', color: editInputResponsable && CurrentId === producto._id ? 'yellow' : 'white' }} />
                                                                    : producto.responsable
                                                            }
                                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                                            {
                                                                editInputResponsable && CurrentId === producto._id ?
                                                                    <>
                                                                        <AiOutlineSave className="btn" onClick={() => updateResponsable(producto._id)} /> &nbsp;&nbsp;
                                                                        <AiOutlineClose className="btn" onClick={() => (setEditInputResponsable(false), document.getElementById(producto._id).value = producto.responsable || 'No asignado')} />
                                                                    </> :
                                                                    <BiEdit onClick={() => (setEditInputResponsable(true), setCurrentId(producto._id))} />
                                                            }

                                                        </td>
                                                        <td className="short">{producto.tipo}</td>
                                                        <td className="medium">{producto.modalidad}</td>
                                                        <td className="medium">{producto.areaV}</td>
                                                        <td className="medium">{producto.quienPropone}</td>

                                                        <td className="long">
                                                            <textarea
                                                                className="scroll"
                                                                placeholder={producto.razon}
                                                                disabled={true} />
                                                        </td>

                                                        <td className="long">
                                                            <textarea
                                                                className="scroll"
                                                                placeholder={producto.poblacionObj}
                                                                disabled={true}>
                                                            </textarea>
                                                        </td>
                                                        <td className="long">
                                                            <textarea
                                                                className="scroll"
                                                                placeholder={producto.descripcion}
                                                                disabled={true} />
                                                        </td>
                                                        <td>{producto.institucion}</td>
                                                        <td className="long">{producto.creadoPor}</td>
                                                        <td className="medium">{producto.aprobadoPor}</td>
                                                        {
                                                            producto.lastUpdate ? <td className="long">
                                                                {producto.lastUpdate !== "Sin actualizaciones" ? <>{producto.lastUpdate}</> : "No ha sido actualizado "}
                                                            </td> : null
                                                        }
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>

                            }
                            {
                                TempProductos.length === 0 && !Loading ?
                                    <div className={styles.info}>
                                        <button onClick={() => (computePages(Productos), setCurrentPage(1))}>Volver a página 1</button>
                                    </div> :
                                    <Pagination
                                        className="pagination-bar"
                                        currentPage={currentPage}
                                        totalCount={Productos.length}
                                        pageSize={pageSize}
                                        onPageChange={(page) => setCurrentPage(page)}
                                    />
                            }

                        </div></>
            }

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