import { signOut } from "next-auth/react";

export const isAnyFieldEmpty = (form) => {
  let isEmpty = false;
  for (let i = 0; i < form.length; i++) {
    console.log();
    if (form[i].name === "files_att") {
      console.log("Archivo")
    } else {
      console.log(form[i].value.trim().length, "===", form[i])
      form[i].value.trim().length <= 0 ? isEmpty = true : null;
    }
  }
  return isEmpty;
}

export const getTimeStamp = () => {
  let meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
  let date = new Date();
  let fecha = date.getDate() + " de " + meses[date.getMonth()] + " del " + date.getFullYear();
  const time = date.getHours() + ":" + date.getMinutes();
  const timeStamp = fecha + " a las " + time;
  return timeStamp;
}

export const sessionHasExpired = () => {
  if (!localStorage.getItem('L')) {
    const expiryDate = (Number(getTimeStamp().split(' ')[7].split(':')[0]) + 3) + ':' + getTimeStamp().split(' ')[7].split(':')[1]; // Seteamos la fecha de expiración
    localStorage.setItem('L', expiryDate);
  } else {
    const expiryHour = Number(localStorage.getItem('L').split(':')[0]);
    const expiryMinutes = Number(localStorage.getItem('L').split(':')[1]);
    const currentHour = Number(getTimeStamp().split(' ')[7].split(':')[0]);
    const currentMinutes = Number(getTimeStamp().split(' ')[7].split(':')[1]);
    if (currentHour >= expiryHour && currentMinutes >= expiryMinutes) {
      localStorage.removeItem('L');
      signOut();
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
