import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/pages/ventas.module.scss";
import { makeid } from "../../utils/forms";
import Options from "./options";

const ValidationToolsForm = ({HerramientasValidacion, setHerramientasValidacion}) => {
    const [hasChange, setHasChange] = useState(false);
    const [Herramientas, setTools] = useState([]);

    const [ValitationTool, setValitationTool] = useState({
        fg: [1],
        er: [1],
        pp: [1],
        ep: [1],
        hd: [1],
        bs: [1],
        emt: [1],
        co: [1],
        th: [1],
        pab: [1],
        pm: [1]
    });

    const addField = (type) => {
        const field = ValitationTool;
        if (field[type].length > 3) {
            toast.error("No puedes agregar más de 4 campos")
            return;
        }
        field[type].push(makeid(field[type].length + 1));
        setValitationTool(field);
        setHasChange(!hasChange);
    }

    const deleteField = (type, id) => {
        // Limpiarlo de la interfaz
        const field = ValitationTool;
        field[type] = field[type].filter((_id) => _id !== id);
        setValitationTool(field);
        // Limpiarlo del arreglo objeto
        const tools = HerramientasValidacion;
        const indexToDelete = tools.map((item) => item.id).indexOf(id + "_" + type);
        tools.splice(indexToDelete, 1);
        setHerramientasValidacion(tools);
        setHasChange(!hasChange);
    }

    //id, title, "nombre", title, prefix, isDisabled
    const restoreRow = (nombre, prefix) => {
        const field = ValitationTool;
        field[prefix] = [1];
        setValitationTool(field);
        // Limpiarlo del arreglo objeto
        const tools = HerramientasValidacion;
        let i = 0;
        while (i < tools.length) {
            if (tools[i].nombre === nombre) {
                tools.splice(i, 1);
            } else {
                ++i;
            }
        }
        setHerramientasValidacion(tools);
        setHasChange(!hasChange)
    }

    const setHerramientas = (id, nombre, campo, valor, prefix) => {
        const _id = id + "_" + prefix;
        const herramientas = HerramientasValidacion;
        const herramienta = {
            id: _id,
            nombre: nombre,
            [campo]: valor
        }
        const doesExist = herramientas.map((item) => item.id).indexOf(_id);
        if (doesExist !== -1) { // existe 
            herramientas.map((item, index) => {
                if (item.id === _id) {
                    item = { ...item, [campo]: valor }
                    herramientas[index] = item;
                }
            })
        } else {
            herramientas.push(herramienta);
        }
        console.log(herramientas)
    }

    useEffect(() => {
    }, [hasChange])

    return <div className="radio_ck_section">
        <h3>Herramientas de validación</h3>
        <table className={styles.table} style={{ overflow: 'hidden' }}>
            <thead>
                <tr>
                    <th>Herramientas</th>
                    <th className="medium">A quien va dirigido</th>
                    <th>Medios o canal</th>
                    <th className="medium">Tipo de servicio</th>
                    <th>Responsable</th>
                    <th>Número de participantes</th>
                    <th>Duración por actividad</th>
                    <th>Evidencia</th>
                </tr>
            </thead>
            <tbody>
                {
                    ValitationTool.fg.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="fg" title="Focus Group" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.er.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="er" title="Encuestas de retroalimentación" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.pp.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="pp" title="Piloto de un prototipo" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.ep.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="ep" title="Entrevistas a profundidad" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.hd.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="hd" title="Herramientas digitales (Google Trends, Alexa, Semrush )" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.bs.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="bs" title="Bitácora social" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.emt.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="emt" title="Estudio de mercado con un tercero" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.co.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="co" title="Comunidades Online / Foros" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.th.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="th" title="Test de humo" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.pab.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="pab" title="Prueba A / B" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
                {
                    ValitationTool.pm.map((item) => (
                        <Options addField={addField} deleteField={deleteField} key={item} id={item} prefix="pm" title="Prueba de mercado" restoreField={restoreRow} setHerramientas={setHerramientas} />
                    ))
                }
            </tbody>
        </table>
    </div>
}

export default ValidationToolsForm