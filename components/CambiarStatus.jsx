import { toast } from 'react-toastify';
import Swal from 'sweetalert2/dist/sweetalert2';
import axios from 'axios';
import { getTimeStamp } from '../utils/forms';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function CambiarStatusComponent({ Producto }) {

    const { data: session } = useSession();
    const router = useRouter();

    const setStatus = async (Status) => {
        const producto = Producto;
        if(Status === "Pendiente") {
            producto.statusProducto = Status;
            if(producto.etapa === "Propuesta") {
                producto.statusAnterior = "Revisión";
            }
            if(producto.etapa === "Validación") {
                producto.statusAnterior = "Elección";
            }
            if(producto.etapa === "Resultado") {
                producto.statusAnterior = "Recolección";
            }
            if(producto.etapa === "Aprobado") {
                producto.statusAnterior = "Validado";
            }
        } else {
            producto.statusAnterior = Status;
            if(producto.etapa === "Propuesta") {
                producto.statusProducto = "Revisión";
            }
            if(producto.etapa === "Validación") {
                producto.statusProducto = "Elección";
            }
            if(producto.etapa === "Resultado") {
                producto.statusProducto = "Recolección";
            }
            if(producto.etapa === "Aprobado") {
                producto.statusProducto = "Validado";
            }
        }
        // } else {
        //     if(producto.etapa === "Propuesta") {
        //         producto.statusProducto = "Revisión";
        //     }
        //     if(producto.etapa === "Validación") {
        //         producto.statusProducto = "Elección";
        //     }
        //     if(producto.etapa === "Resultado") {
        //         producto.statusProducto = "Recolección";
        //     }
        //     if(producto.etapa === "Aprobado") {
        //         producto.statusProducto = "Validado";
        //     }
        //     if(producto.etapa === "Resultado") {
        //         producto.statusProducto = "Pendiente";
        //     }
        // }
        await Swal.fire({
            input: 'textarea',
            inputLabel: "Explica por qué el producto será puesto en " + Status,
            inputValue: '',
            inputPlaceholder: "Comentario...",
            inputAttributes: {
                'aria-label': 'Escribe tu comentario aquí',
                maxlength: 1500
            },
            showCancelButton: true,
            confirmButtonText: 'Poner en ' + Status,
            cancelButtonText: 'Cancelar',
        }).then(async (res) => {
            if (res.isDismissed) return;
            if (res.value.trim().length === 0 && res.isConfirmed) {
                toast.warn("El comentario no puede estar vacío");
                return;
            }
            producto.comentarios = [{
                user: session.user.names,
                comentarios: res.value,
                createdAt: getTimeStamp()
            }];
            await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/producto/updateStatus=${Producto.nombre}`, [producto.statusProducto, Producto.etapa, Producto.statusAnterior], // nuevoStatus, Etapa, statusAnterior
                {
                    headers: {
                        accept: '*',
                        'Content-Type': 'application/json'
                    }
                });
            await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/${Producto.nombre}=updateComment`, producto)
                .then(() => {
                    toast.success("Puesto en " + Status);
                    router.push("/vw/query/" + Producto.institucion)
                })

        })
    }
    return <>{
        Producto.statusProducto !== "Pendiente" ?
            <button onClick={() => setStatus("Pendiente")}>Poner en pendiente</button> :
            <button onClick={() => setStatus(Producto.statusAnterior)}>Devolver a {Producto.statusAnterior}</button>}</>
}