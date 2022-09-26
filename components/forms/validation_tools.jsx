import { useEffect, useState } from "react";
import styles from "../../styles/pages/ventas.module.scss";

const ValidationToolsForm = ({ HerramientasValidacion, setHerramientasValidacion }) => {
    const [One, setOne] = useState(true);
    const [Two, setTwo] = useState(true);
    const [Three, setThree] = useState(true);
    const [Four, setFour] = useState(true);
    const [Five, setFive] = useState(true);
    const [Six, setSix] = useState(true);
    const [Seven, setSeven] = useState(true);
    const [Eight, setEight] = useState(true);
    const [Nine, setNine] = useState(true);
    const [Ten, setTen] = useState(true);
    const [Eleven, setEleven] = useState(true);

    const clearFields = (fieldsHTML) => {
        let tools = HerramientasValidacion;
        const campos = Array.from(fieldsHTML);
        campos.map((item) => {
            if (typeof item.children[0].value === "undefined") return;
            item.children[0].value = "default"
        });
        const input = campos[0].children[0].children[0];
        const isInputCheckboxChecked = input.checked;
        if (!isInputCheckboxChecked) {
            tools = tools.filter((tool) => tool.name !== input.value);
            setHerramientasValidacion(tools);
        }
    }

    const setInformation = (e) => {
        setHerramientasValidacion([...HerramientasValidacion, {
            name: e.target.value,
            quienDirigido: null,
            medioCanal: null,
            tipoServicio: null,
            responsable: null,
            numeroParticipantes: null,
            duracionActividad: null,
            evidencia: null
            ,
        }])
    }

    const setAttributes = (e) => {
        const nombre = e.target.name.split(" ")[0];
        const campo = e.target.name.split(" ")[1];
        const tools = HerramientasValidacion;
        tools.map((tool) => {
            if (typeof tool[campo] !== "undefined") {
                tool[nombre] = e.target.value;
            }
        })
    }

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
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Focus Group
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Focus Group"
                                id="fg"
                                onChange={(e) => (setOne(!One), setInformation(e), clearFields(document.querySelector('table').children[1].children[0].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido fg" className={styles.select_sp} disabled={One} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal fg" className={styles.select_sp} disabled={One} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio fg" className={styles.select_sp} disabled={One} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable fg" className={styles.select_sp} disabled={One} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes fg" className={styles.select_sp} disabled={One} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad fg" className={styles.select_sp} disabled={One} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia fg" className={styles.select_sp} disabled={One} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Encuestas de retroalimentación
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="er"
                                onChange={(e) => (setTwo(!Two), setInformation(e), clearFields(document.querySelector('table').children[1].children[1].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido er" className={styles.select_sp} disabled={Two} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal er" className={styles.select_sp} disabled={Two} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio er" className={styles.select_sp} disabled={Two} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable er" className={styles.select_sp} disabled={Two} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes er" className={styles.select_sp} disabled={Two} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad er" className={styles.select_sp} disabled={Two} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia er" className={styles.select_sp} disabled={Two} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Piloto de un prototipo
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="pp"
                                onChange={(e) => (setThree(!Three), setInformation(e), clearFields(document.querySelector('table').children[1].children[2].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido pp" className={styles.select_sp} disabled={Three} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal pp" className={styles.select_sp} disabled={Three} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio pp" className={styles.select_sp} disabled={Three} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable pp" className={styles.select_sp} disabled={Three} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes pp" className={styles.select_sp} disabled={Three} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad pp" className={styles.select_sp} disabled={Three} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia pp" className={styles.select_sp} disabled={Three} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Entrevistas a profundidad
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="ep"
                                onChange={(e) => (setFour(!Four), setInformation(e), clearFields(document.querySelector('table').children[1].children[3].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido ep" className={styles.select_sp} disabled={Four} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal ep" className={styles.select_sp} disabled={Four} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio ep" className={styles.select_sp} disabled={Four} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable ep" className={styles.select_sp} disabled={Four} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes ep" className={styles.select_sp} disabled={Four} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad ep" className={styles.select_sp} disabled={Four} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia ep" className={styles.select_sp} disabled={Four} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Herramientas digitales (Google Trends, Alexa, Semrush )
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="hd"
                                onChange={(e) => (setFive(!Five), setInformation(e), clearFields(document.querySelector('table').children[1].children[4].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido hd" className={styles.select_sp} disabled={Five} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal hd" className={styles.select_sp} disabled={Five} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio hd" className={styles.select_sp} disabled={Five} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable hd" className={styles.select_sp} disabled={Five} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes hd" className={styles.select_sp} disabled={Five} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad hd" className={styles.select_sp} disabled={Five} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia hd" className={styles.select_sp} disabled={Five} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Bitácora social
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="bs"
                                onChange={(e) => (setSix(!Six), setInformation(e), clearFields(document.querySelector('table').children[1].children[5].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido bs" className={styles.select_sp} disabled={Six} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal bs" className={styles.select_sp} disabled={Six} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio bs" className={styles.select_sp} disabled={Six} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable bs" className={styles.select_sp} disabled={Six} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes bs" className={styles.select_sp} disabled={Six} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad bs" className={styles.select_sp} disabled={Six} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia bs" className={styles.select_sp} disabled={Six} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Estudio de mercado con un tercero
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="emt"
                                onChange={(e) => (setSeven(!Seven), setInformation(e), clearFields(document.querySelector('table').children[1].children[6].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido emt" className={styles.select_sp} disabled={Seven} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal emt" className={styles.select_sp} disabled={Seven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio emt" className={styles.select_sp} disabled={Seven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable emt" className={styles.select_sp} disabled={Seven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes emt" className={styles.select_sp} disabled={Seven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad emt" className={styles.select_sp} disabled={Seven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia emt" className={styles.select_sp} disabled={Seven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Comunidades Online / Foros
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="co"
                                onChange={(e) => (setEight(!Eight), setInformation(e), clearFields(document.querySelector('table').children[1].children[7].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido co" className={styles.select_sp} disabled={Eight} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal co" className={styles.select_sp} disabled={Eight} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio co" className={styles.select_sp} disabled={Eight} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable co" className={styles.select_sp} disabled={Eight} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes co" className={styles.select_sp} disabled={Eight} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad co" className={styles.select_sp} disabled={Eight} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia co" className={styles.select_sp} disabled={Eight} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Test de humo
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="th"
                                onChange={(e) => (setNine(!Nine), setInformation(e), clearFields(document.querySelector('table').children[1].children[8].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido th" className={styles.select_sp} disabled={Nine} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal th" className={styles.select_sp} disabled={Nine} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio th" className={styles.select_sp} disabled={Nine} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable th" className={styles.select_sp} disabled={Nine} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes th" className={styles.select_sp} disabled={Nine} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad th" className={styles.select_sp} disabled={Nine} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia th" className={styles.select_sp} disabled={Nine} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Prueba A/B
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="pab"
                                onChange={(e) => (setTen(!Ten), setInformation(e), clearFields(document.querySelector('table').children[1].children[9].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido pab" className={styles.select_sp} disabled={Ten} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal pab" className={styles.select_sp} disabled={Ten} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio pab" className={styles.select_sp} disabled={Ten} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable pab" className={styles.select_sp} disabled={Ten} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes pab" className={styles.select_sp} disabled={Ten} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad pab" className={styles.select_sp} disabled={Ten} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia pab" className={styles.select_sp} disabled={Ten} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td className={styles.herr}>
                        <label className="control control-radio">
                            Prueba de mercado
                            <input
                                type="checkbox"
                                name="herramientas"
                                value="Encuestas de retroalimentación"
                                id="pm"
                                onChange={(e) => (setEleven(!Eleven), setInformation(e), clearFields(document.querySelector('table').children[1].children[10].children))}
                            />
                            <div className="control_indicator"></div>
                        </label>
                    </td>
                    <td>
                        <select name="quienDirigido pm" className={styles.select_sp} disabled={Eleven} onChange={(e) => setAttributes(e)}>
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
                        <select name="medioCanal pm" className={styles.select_sp} disabled={Eleven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                            <option value="Redes sociales (FB, Instagram, LinkedIn)">Redes sociales (FB, Instagram, LinkedIn)</option>
                            <option value="Otros medios">Otros medios</option>
                        </select>
                    </td>
                    <td>
                        <select name="tipoServicio pm" className={styles.select_sp} disabled={Eleven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Gratuito">Gratuito</option>
                            <option value="De pago">De pago</option>
                        </select>
                    </td>
                    <td>
                        <select name="responsable pm" className={styles.select_sp} disabled={Eleven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Team EC-Online">Team EC-Online</option>
                            <option value="Team Marketing">Team Marketing</option>
                            <option value="Team EC-Online/ Team Marketing">Team EC-Online/ Team Marketing</option>
                            <option value="Externo">Externo</option>
                        </select>
                    </td>
                    <td>
                        <select name="numeroParticipantes pm" className={styles.select_sp} disabled={Eleven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="1 - 5 personas">1 - 5 personas</option>
                            <option value="5 - 10 personas">5 - 10 personas</option>
                            <option value="10 - 20 personas">10 - 20 personas</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="duracionActividad pm" className={styles.select_sp} disabled={Eleven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="30 - 45 minutos">30 - 45 minutos</option>
                            <option value="1 hora">1 hora</option>
                            <option value="Por definir">Por definir</option>
                        </select>
                    </td>
                    <td>
                        <select name="evidencia pm" className={styles.select_sp} disabled={Eleven} onChange={(e) => setAttributes(e)}>
                            <option value="default">Opciones</option>
                            <option value="Reporte de resultados">Reporte de resultados</option>
                            <option value="Presentación reporte externo">Presentación reporte externo</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
}

export default ValidationToolsForm