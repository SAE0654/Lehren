// CORE
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// SESSION
import { getSession, useSession } from "next-auth/react";
// ESTILOS
import { toast } from 'react-toastify';
import Swal from 'sweetalert2/dist/sweetalert2';
// COMPONENTES Y FUNCIONES EXTERNAS
import { getTimeStamp, sessionHasExpired, sortByDate } from '../../../utils/forms';
import { InstitucionVista } from './InstitucionVista';
import Layout from '../../../components/Layout';
import { deleteProductoByNombre, getProductosByInstitution } from '../../../services/productos';

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
        document.querySelector("body").classList.add('consultas_bg');
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
        const data = sortByDate(await getProductosByInstitution(institucion));
        setProductos(data);
        setTempProductos(data);
        setLoading(false);
        computePages(data);
        console.log(data)
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
                const resultado = await deleteProductoByNombre(nombre);
                resultado ? toast.success("Producto eliminado") : toast.error("Algo salió mal")
                getProductos();
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
                Productos.length === 0 ? null :
                    <InstitucionVista
                        Productos={Productos}
                        Query={Query}
                        NoResults={NoResults}
                        CSV={CSV}
                        headers={headers}
                        CSVChosed={CSVChosed}
                        TempProductos={TempProductos}
                        lastPage={lastPage}
                        pageSize={pageSize}
                        session={session}
                        editInputResponsable={editInputResponsable}
                        CurrentId={CurrentId}
                        currentPage={currentPage}
                        Loading={Loading}
                        // Funciones:
                        deleteProduct={deleteProduct}
                        displayCommentSection={displayCommentSection}
                        setEditInputResponsable={setEditInputResponsable}
                        setCurrentId={setCurrentId}
                        setInputResponsableValue={setInputResponsableValue}
                        updateResponsable={updateResponsable}
                        search={search}
                        setQuery={setQuery}
                        prepareCSV={prepareCSV}
                        setCurrentPage={setCurrentPage}
                    />
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