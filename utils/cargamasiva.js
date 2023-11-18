import axios from 'axios';

export function cargarUsuarios() {
    let userIndex = 1001;
    usuarios.map((usuario, index) => {
        axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}api/signup`, usuario)
            .then(() => {
                console.log('Usuario ' + userIndex + ' registrado');
            }).catch((err) => {
                console.log('Error al registrar al usuario ' + userIndex);
            });
        userIndex++;
    })
}

export function cargarUnUsuario() {
    const usuario = {
        Identificador: "",
        Comite: "",
        names: "",
        email: "",
        rol: "",
        Primernombre: "",
        password: ""
    }
    axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}api/signup`, usuario)
        .then(() => {
            console.log('Usuario registrado');
        }).catch((err) => {
            console.log('Error al registrar al usuario ', err);
        });
}