import styles from "../styles/pages/search.module.scss";
import { useState, useRef } from "react";
import { BiSearchAlt } from "react-icons/bi";
import axios from 'axios';
import { toast } from 'react-toastify';
const bcrypt = require('bcryptjs');

export default function Search() {
    const [Name, setName] = useState(null);
    const [Resultados, setResultados] = useState(null);
    const [InitialData, setInitialData] = useState({});
    // Estados de muestra
    const [ShowNewPassword, setShowNewPassword] = useState(false);

    const oldPassword = useRef(null);

    const searchUser = async () => {
        setShowNewPassword(false);
        setResultados(null);
        setInitialData({})
        if (Name === null || Name.trim().length === 0) {
            toast.info("Escribe algo para continuar");
            return
        }
        const idMsg = toast.loading("Buscando usuario...");
        let nombre = Name;
        nombre = nombre[0].toUpperCase() + nombre.substring(1);
        axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}api/usuario/` + Name)
            .then((res) => {
                if (res.data.length === 0) {
                    toast.info("No se encontró una coincidencia");
                } else {
                    toast.success("Coincidencias encontradas");
                    setResultados(res.data[0]);
                    setInitialData(res.data[0]);
                }
            });
        toast.dismiss(idMsg);
    }

    const handleChanges = (e) => {
        setResultados({
            ...Resultados,
            [e.target.name]: e.target.value
        });
    }

    const updateBasicInfo = async () => {
        const camposACambiar = [];
        if(Resultados.names !== InitialData.names) {
            camposACambiar.push("names");
        }
        if(Resultados.rol !== InitialData.rol) {
            camposACambiar.push("rol")
        }
        if(ShowNewPassword) {
            camposACambiar.push("password");
        }
        if (camposACambiar.length === 0) {
            toast.info("Cambia algo, antes de continuar");
            return;
        }
        const idMsg = toast.loading("Actualizando datos...");
        console.log(camposACambiar)
        await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/usuario/` + camposACambiar, Resultados)
            .then(() => {
                toast.success("Usuario actualizado con éxito");
            });
        setShowNewPassword(false);
        toast.dismiss(idMsg);
    }

    const matchPasswords = async () => {
        if (oldPassword.current.value === Resultados['password']) {
            const encrypted = await bcrypt.genSalt(10);
            bcrypt.hash(Resultados['password'], encrypted)
                .then((res) => {
                    Resultados['password'] = res;
                    updateBasicInfo();
                });
        } else {
            toast.error("Las contraseñas no coinciden")
        }
    }

    return <>
        <div className={styles.search_wrapper}>
            <input
                type="text"
                placeholder="Ingresa nombre o correo"
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' ? searchUser() : null}
                maxLength="30" />
            <button className={styles.btn_search} onClick={() => searchUser()}>
                <BiSearchAlt />
            </button>
            {
                !Resultados ? null :
                    <>
                        <div className={styles.information}>
                            <h2>Resultados</h2>
                            {ShowNewPassword ? null :
                                <>
                                    <p>Correo: <input type="text" defaultValue={Resultados.email} disabled /></p>
                                    <p>Nombre: <input type="text" name="names" defaultValue={Resultados.names} onChange={(e) => handleChanges(e)} /></p>
                                    <p>Rol: <select name="rol" defaultValue={Resultados.rol} onChange={(e) => handleChanges(e)}>
                                        <option value="administrador">Administrador</option>
                                        <option value="staff">Staff</option>
                                    </select></p>
                                    <button className={styles.btn_update} onClick={() => updateBasicInfo()}>Actualizar información</button>
                                    <button className={styles.btn_update} onClick={() => (setShowNewPassword(true))}>Actualizar contraseña</button>
                                </>

                            }
                            <br />
                            {
                                ShowNewPassword ?
                                    <div className="change_password">
                                        <input type="password" name="password" placeholder="Nueva contraseña" onChange={(e) => handleChanges(e)} />
                                        <input type="password" name="password1" placeholder="Repetir nueva contraseña" ref={oldPassword} />
                                    </div> : null
                            }
                            <br />
                            {
                                ShowNewPassword ?
                                    <>
                                        <button className={styles.btn_update} style={{ background: "red" }} onClick={() => (setShowNewPassword(false))}>Cancelar</button>
                                        <button className={styles.btn_update} onClick={() => matchPasswords()}>Actualizar contraseña</button>
                                    </>
                                    : null
                            }

                        </div>
                    </>
            }
        </div>

    </>
}
