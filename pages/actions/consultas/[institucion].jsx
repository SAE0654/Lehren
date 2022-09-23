import Head from 'next/head';
import styles from "../../../styles/pages/ventas.module.scss";
import { getSession, useSession } from "next-auth/react";
import Layout from '../../../components/Layout';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AiOutlineClose, AiTwotoneEdit, AiOutlineEye, AiFillDelete, AiOutlineSave } from 'react-icons/ai';
import { BsSearch } from "react-icons/bs";
import { toast } from 'react-toastify';
import { getTimeStamp, sessionHasExpired } from '../../../utils/forms';
import { NavLink } from '../../../components/NavLink';
import { useRouter } from 'next/router';
import Pagination from '../../../components/Pagination';
import { MdAddComment } from 'react-icons/md';
import Swal from 'sweetalert2/dist/sweetalert2';
import Comment from '../../../components/Comment';

let pageSize = 4;

export default function Consultas() {
    const [Productos, setProductos] = useState([]);
    const [TempProductos, setTempProductos] = useState([]);
    const [NoResults, setNoResults] = useState(false);
    const [Query, setQuery] = useState('');
    const [BoxFilter, setBoxFilter] = useState(false);
    const [Restaurar, setRestaurar] = useState(false);
    const [Loading, setLoading] = useState(true);
    // Monitor
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setlastPage] = useState(1);
    const Route = useRouter();

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
        getProductos();
    }, [institucion])

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

    const filterFields = (e) => {
        e.preventDefault();
        const omitir = [];
        const temp = [];
        for (let i = 0; i <= 9; i++) {
            if (e.target[i].checked) {
                omitir.push(e.target[i].name);
                console.log(e.target[i].name)
            }
        }
        if (omitir.length <= 0) {
            toast.info("Filtro restaurado");
            // setTempProductos(Productos);
            computePages(Productos);
            setRestaurar(false);
            return;
        }
        omitir.push("aprobado");
        Productos.map((student) => {
            temp.push(omit(student, omitir));
        });
        // setTempProductos(temp);
        computePages(temp)
        clearFilters(e);
        toast.success("Filtro aplicado");
        setRestaurar(true);
    }

    const clearFilters = (e) => {
        for (let i = 0; i <= 9; i++) {
            e.target[i].checked = false;
        }
    }

    const omit = (source = {}, omitKeys = []) => (
        Object.keys(source).reduce((output, key) => (
            omitKeys.includes(key) ? { ...output, [key]: source[key] } : output
        ), {})
    );

    const deleteProduct = async (Id) => {
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
                await axios.delete(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + Id)
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

    const displayCommentSection = async (pId, commentario) => {
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
            saveComment(res.value, pId, hasAlreadyAComment);
        })
    }

    const saveComment = async (comentario, pId, alreadyAdded) => {
        const producto = Productos.filter((item) => item._id === pId);
        producto[0].comentarios = [{
            user: session.user.names,
            comentarios: comentario,
            createdAt: getTimeStamp()
        }];
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/` + pId, producto[0])
            .then(() => {
                toast.success(alreadyAdded ? "Comentario actualizado" : "Comentario agregado");
                getProductos()
            })
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
                        <img src="/img/sad.jpg" alt="" />
                        <NavLink href="/actions/producto">Carga tu primer producto</NavLink>
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
                                    <button onClick={() => setBoxFilter(!BoxFilter)}>Filtrar campos</button>
                                    <div className={styles.fields_options + ' scroll'} style={BoxFilter ? { display: 'block' } : { display: 'none' }}>
                                        <form onSubmit={(e) => filterFields(e)}>
                                            <h1>Campos a visualizar</h1>
                                            <div className={styles.box_wrapper_checkbox}>
                                                <input type="checkbox" name="nombre" id="nombre" />
                                                <label htmlFor="nombre">Nombre del producto</label>
                                                <input type="checkbox" name="tipo" id="tipo" />
                                                <label htmlFor="tipo">Tipo de producto</label>
                                                <input type="checkbox" name="modalidad" id="modalidad" />
                                                <label htmlFor="modalidad">Modalidad</label>
                                                <input type="checkbox" name="areaV" id="areaV" />
                                                <label htmlFor="areaV">Área vinculada</label>
                                                <input type="checkbox" name="razon" id="razon" />
                                                <label htmlFor="razon">Razón</label>
                                                <input type="checkbox" name="quienPropone" id="quienPropone" />
                                                <label htmlFor="quienPropone">Persona o área que propone</label>
                                                <input type="checkbox" name="poblacionObj" id="poblacionObj" />
                                                <label htmlFor="poblacionObj">A quién va dirigido</label>
                                                <input type="checkbox" name="descripcion" id="descripcion" />
                                                <label htmlFor="descripcion">Descripción</label>
                                                <input type="checkbox" name="RVOE" id="RVOE" />
                                                <label htmlFor="RVOE">RVOE</label>
                                                <input type="checkbox" name="institucion" id="institucion" />
                                                <label htmlFor="institucion">Institución</label>
                                            </div>
                                            {TempProductos.length <= 0 ?
                                                <button type="submit" onClick={() => (setBoxFilter(!BoxFilter), computePages(Productos), setCurrentPage(1))}>
                                                    Restaurar datos
                                                </button>
                                                : <button type="submit" onClick={() => setBoxFilter(!BoxFilter)}>
                                                    {Restaurar ? 'Restaurar filtro' : 'Aplicar filtro'}
                                                </button>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {
                                TempProductos.length <= 0 ? null :
                                    <table className={styles.table + " scroll"}>
                                        <thead>
                                            <tr>
                                                <th>No. </th>
                                                <th className="medium">Etapa</th>
                                                {TempProductos[0].status ? <th>Estatus</th> : null}
                                                {TempProductos[0].nombre ? <th>Nombre del producto</th> : null}
                                                {TempProductos[0].tipo ? <th>Tipo de oferta</th> : null}
                                                {TempProductos[0].modalidad ? <th>Modalidad</th> : null}
                                                {TempProductos[0].areaV ? <th>Área vinculada</th> : null}
                                                {TempProductos[0].quienPropone ? <th>Persona o área que propone</th> : null}
                                                {TempProductos[0].razon ? <th>Razón</th> : null}
                                                {TempProductos[0].poblacionObj ? <th>Población objetivo</th> : null}
                                                {TempProductos[0].descripcion ? <th>Descripción</th> : null}
                                                {TempProductos[0].institucion ? <th>Institución</th> : null}
                                                {TempProductos[0].creadoPor ? <th>Creado por</th> : null}
                                                {TempProductos[0].aprobadoPor ? <th>Aprobado por</th> : null}
                                                {TempProductos[0].modifiedBy ? <th>Modificado por</th> : null}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                TempProductos.map((producto, index) => (
                                                    <tr key={index}>
                                                        <td>{(lastPage - pageSize) + index + 1}</td>
                                                        <td>
                                                            <div className={styles.action_by_id}>
                                                                <NavLink href={"/view/aprobado/" + producto._id} exact>
                                                                    <button>
                                                                        <AiOutlineEye />
                                                                    </button>
                                                                </NavLink>
                                                                <button
                                                                    onClick={() => deleteProduct(producto._id)}>
                                                                    <AiFillDelete />
                                                                </button>
                                                                <button
                                                                    className="comment_card"
                                                                    onClick={() => displayCommentSection(producto._id, producto.comentarios)}>
                                                                    <MdAddComment />
                                                                </button>
                                                                <Comment comments={producto.comentarios} />
                                                                {
                                                                    session.user.rol === "administrador" ?
                                                                        producto.etapa === "Aprobado" ?
                                                                            <div className={styles.etapa2} style={{backgroundColor: "green"}}>
                                                                                <NavLink
                                                                                    href={"/view/aprobado/" + producto._id}
                                                                                    exact>
                                                                                    {producto.etapa}
                                                                                </NavLink>
                                                                            </div>
                                                                            :
                                                                            <div className={styles.etapa2}>
                                                                                <NavLink
                                                                                    href={
                                                                                        `/etapa/${producto.etapa === "Propuesta" || producto.etapa === "Validación" || producto.etapa === "Pendiente"
                                                                                            ? "validacion" :
                                                                                            producto.etapa.toLowerCase()}/` + producto._id}
                                                                                    exact>
                                                                                    {producto.etapa}
                                                                                </NavLink>
                                                                            </div>
                                                                        : null


                                                                }
                                                            </div>
                                                        </td>
                                                        {producto.status ? <td className="short"> {producto.status} </td> : null}
                                                        {producto.nombre ? <td className="long"> {producto.nombre} </td> : null}
                                                        {producto.tipo ? <td className="short">{producto.tipo}</td> : null}
                                                        {producto.modalidad ? <td className="medium">{producto.modalidad}</td> : null}
                                                        {producto.areaV ? <td className="medium">{producto.areaV}</td> : null}
                                                        {producto.quienPropone ? <td className="medium">{producto.quienPropone}</td> : null}
                                                        {producto.razon ?
                                                            <td className="long">
                                                                <textarea
                                                                    className="scroll"
                                                                    placeholder={producto.razon}
                                                                    disabled={true} />
                                                            </td> : null}
                                                        {producto.poblacionObj ?
                                                            <td className="long">
                                                                <textarea
                                                                    className="scroll"
                                                                    placeholder={producto.poblacionObj}
                                                                    disabled={true}>
                                                                </textarea>
                                                            </td> : null}
                                                        {producto.descripcion ?
                                                            <td className="long">
                                                                <textarea
                                                                    className="scroll"
                                                                    placeholder={producto.descripcion}
                                                                    disabled={true} />
                                                            </td> : null}
                                                        {producto.institucion ? <td>{producto.institucion}</td> : null}
                                                        {producto.creadoPor ? <td className="long">{producto.creadoPor}</td> : null}
                                                        {producto.aprobadoPor ? <td className="medium">{producto.aprobadoPor}</td> : null}
                                                        {
                                                            producto.modifiedBy ? <td className="long">
                                                                {producto.modifiedBy !== "Sin actualizaciones" ? <>{producto.modifiedBy}, el {producto.lastUpdate}</> : "No ha sido actualizado "}
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