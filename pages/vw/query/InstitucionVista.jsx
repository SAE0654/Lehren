// Estilos
import styles from "../../../styles/pages/ventas.module.scss";
import { AiOutlineClose, AiOutlineEye, AiFillDelete, AiOutlineSave } from 'react-icons/ai';
import { BsSearch } from "react-icons/bs";
import { MdAddComment } from 'react-icons/md';
import { BiEdit, BiSad } from "react-icons/bi";
// Componentes externos
import { NavLink } from '../../../components/NavLink';
import Pagination from '../../../components/Pagination';
import Comment from '../../../components/Comment';
import { CSVLink } from 'react-csv';
import VotosComponent from '../../../components/VotosComponent';

export const InstitucionVista = ({
    Productos,
    Query,
    NoResults,
    CSV,
    headers,
    CSVChosed,
    TempProductos,
    lastPage,
    pageSize,
    session,
    editInputResponsable,
    CurrentId,
    currentPage,
    Loading,
    // Funciones:
    deleteProduct,
    displayCommentSection,
    setEditInputResponsable,
    setCurrentId,
    setInputResponsableValue,
    updateResponsable,
    search,
    setQuery,
    prepareCSV,
    setCurrentPage
}) => {

    return <>
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
                                                            {producto.lastUpdate}
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
    </>
}
