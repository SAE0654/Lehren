import { useEffect, useState } from "react";
import { AiFillMinusSquare, AiFillPlusSquare } from "react-icons/ai";
import styles from "../../styles/pages/ventas.module.scss";

const Options = ({ addField, deleteField, id, prefix, title, restoreField, setHerramientas }) => {
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        if (id !== 1) {
            setIsDisabled(false);
        }
    }, []);

    useEffect(() => {
        if(!isDisabled) {
            setHerramientas(id, title, "nombre", title, prefix, isDisabled);
        }
    }, [isDisabled])
    


    const setAttributes = (e) => {
        setHerramientas(id, title, e.target.name, e.target.value, prefix)
    }

    const restart = (doRestart, prefijo) => {
        const selects = document.querySelectorAll(`.${prefijo}`);
        if (!doRestart) {
            selects.forEach((item) => {
                item.value = "default"
            })
        }
    }

    return (
        <tr>
            {
                id !== 1 ? <td>
                    <AiFillMinusSquare className={styles.icon_minus} onClick={() => deleteField(prefix, id)} />
                </td> :
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            {title}
                            <input
                                type="checkbox"
                                name="herramientas"
                                value={title}
                                id={prefix}
                                onChange={() => (setIsDisabled(!isDisabled), restoreField(title, prefix), restart(isDisabled, prefix))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                        {
                            isDisabled ?
                                <AiFillPlusSquare className={styles.icon_plus} style={{ opacity: "0.8", cursor: "not-allowed" }} /> :
                                <AiFillPlusSquare className={styles.icon_plus} onClick={() => addField(prefix)} />
                        }
                    </td>
            }
            <td>
                <select name="quienDirigido" className={styles.select_sp + " " + prefix} disabled={isDisabled} onChange={(e) => setAttributes(e)}>
                    <option value="default">Opciones</option>
                    <option value="Estudiantes">Estudiantes</option>
                    <option value="Docentes">Docentes</option>
                    <option value="Ex alumnos">Ex alumnos</option>
                    <option value="Expertos">Expertos</option>
                    <option value="Público en general">Público en general</option>
                    <option value="Competencia">Competencia</option>
                </select>
            </td>
            <td>
                <select name="medioCanal" className={styles.select_sp + " " + prefix} disabled={isDisabled} onChange={(e) => setAttributes(e)}>
                    <option value="default">Opciones</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Online">Online</option>
                    <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                    <option value="Otros medios">Otros medios</option>
                </select>
            </td>
            <td>
                <select name="tipoServicio" className={styles.select_sp + " " + prefix} disabled={isDisabled} onChange={(e) => setAttributes(e)}>
                    <option value="default">Opciones</option>
                    <option value="Gratuito">Gratuito</option>
                    <option value="De pago">De pago</option>
                </select>
            </td>
            <td>
                <select name="responsable" className={styles.select_sp + " " + prefix} disabled={isDisabled} onChange={(e) => setAttributes(e)}>
                    <option value="default">Opciones</option>
                    <option value="Team EC-Online">Team EC-Online</option>
                    <option value="Team Marketing">Team Marketing</option>
                    <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                    <option value="Externo">Externo</option>
                </select>
            </td>
            <td>
                <select name="numeroParticipantes" className={styles.select_sp + " " + prefix} disabled={isDisabled} onChange={(e) => setAttributes(e)}>
                    <option value="default">Opciones</option>
                    <option value="1 - 5 personas">1 - 5 personas</option>
                    <option value="5 - 10 personas">5 - 10 personas</option>
                    <option value="10 - 20 personas">10 - 20 personas</option>
                    <option value="Por definir">Por definir</option>
                </select>
            </td>
            <td>
                <select name="duracionActividad" className={styles.select_sp + " " + prefix} disabled={isDisabled} onChange={(e) => setAttributes(e)}>
                    <option value="default">Opciones</option>
                    <option value="30 - 45 minutos">30 - 45 minutos</option>
                    <option value="1 hora">1 hora</option>
                    <option value="Por definir">Por definir</option>
                </select>
            </td>
            <td>
                <select name="evidencia" className={styles.select_sp + " " + prefix} disabled={isDisabled} onChange={(e) => setAttributes(e)}>
                    <option value="default">Opciones</option>
                    <option value="Reporte de resultados">Reporte de resultados</option>
                    <option value="Presentación reporte externo">Presentación reporte externo</option>
                </select>
            </td>
        </tr>
    )
}

export default Options