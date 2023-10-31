import { signOut } from "next-auth/react";

export const isAnyFieldEmpty = (form, schema) => {
  let fieldEmpty = "";
  for (let i = 0; i < form.length; i++) {
    if (form[i].name === "files_att" ||
      form[i].id === "otro" ||
      form[i].name === "horasTotales" ||
      form[i].name === "periodicidad" ||
      form[i].name === "responsable" ||
      form[i].name === "descripcion" ||
      form[i].name === "nombre_2" ||
      form[i].name === "nombre_3") {
      continue;
    } else {
      if (form[i].type === "submit" || form[i].type === "file" || form[i].type === "checkbox") {
        continue;
      } else {
        if (schema[form[i].name].trim().length <= 0) {
          fieldEmpty = form[i].title.toLowerCase();
          break;
        }
      }
    }
  }
  return fieldEmpty;
}

export const getTimeStamp = () => {
  let meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
  let date = new Date();
  let fecha = date.getDate() + " de " + meses[date.getMonth()] + " del " + date.getFullYear();
  const time = date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
  const timeStamp = fecha + " a las " + time;
  return timeStamp;
}

export const sessionHasExpired = () => {
  if (!localStorage.getItem('L')) {
    const expiryDate = (Number(getTimeStamp().split(' ')[7].split(':')[0]) + 1) + ':' + getTimeStamp().split(' ')[7].split(':')[1]; // Seteamos la fecha de expiración
    localStorage.setItem('L', expiryDate);
  } else {
    const expiryHour = Number(localStorage.getItem('L').split(':')[0]);
    const expiryMinutes = Number(localStorage.getItem('L').split(':')[1]);
    const currentHour = Number(getTimeStamp().split(' ')[7].split(':')[0]);
    const currentMinutes = Number(getTimeStamp().split(' ')[7].split(':')[1]);
    if (currentHour >= expiryHour && currentMinutes >= expiryMinutes) {
      localStorage.removeItem('L');
      signOut();
      console.error("Expired")
    }
  }
}

export const acceptedFiles = (e) => {
  // PDF, WORD, PNG, JPG
  let files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    console.log(e.target.files[i].type)
    if (e.target.files[i].type !== "image/png"
      && e.target.files[i].type !== "image/jpg"
      && e.target.files[i].type !== "image/jpeg"
      && e.target.files[i].type !== "application/pdf"
      && e.target.files[i].type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      && e.target.files[i].type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      && e.target.files[i].type !== "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
      return false;
    }
  }

  return true;

}

export const makeid = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


