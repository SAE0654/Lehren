import styles from "../../styles/restorepassword.module.scss";

const RestorePassword = () => {
  return <div className={styles.page_container}>
    <form>
      <h1>RESTAURAR CONTRASEÑA</h1>
      <input type="password" placeholder="Nueva contraseña" />
      <input type="password" placeholder="Repetir contraseña" />
      <input type="submit" value="Actualizar" />
    </form>
  </div>
}

export default RestorePassword
