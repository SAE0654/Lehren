import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2';

const StatusComponent = ({ id, status, nombre }) => {
    const [Status, setStatus] = useState(status);

    useEffect(() => {
        if (status === Status) return;
        actualizarStatus();
    }, [Status]);

    useEffect(() => {
        setStatus(status);
    }, [id])
    

    const actualizarStatus = () => {
        Swal.fire({
            title: '¿Actualizar estatus de producto?',
            text: "Esta acción cambiará el estatus del producto " + nombre.split('|')[0] + " a " + Status,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}api/status/` + id, { status: Status })
                    .then(() => {
                        status = Status;
                        Swal.fire(
                            'Actualizado',
                            'Estatus actualizado',
                            'success'
                        )
                    });
            } else {
                setStatus(status);
            }
        })
    }

    return <div >
        <select
            name="status"
            id="status"
            onChange={(e) => setStatus(e.target.value)}
            value={Status}
            className={Status.replace(/\s/g, '').toLowerCase()}>
            <option value="Sin iniciar">Sin iniciar</option>
            <option value="Quick market overlook">Quick market overlook</option>
            <option value="Rúbrica">Rúbrica</option>
            <option value="Rechazada en rúbrica">Rechazada en rúbrica</option>
            <option value="Validación de mercado">Validación de mercado</option>
            <option value="Fast track">Fast track</option>
            <option value="Stand by">Stand by</option>
            <option value="Rechazada en validación de mercado">Rechazada en validación de mercado</option>
            <option value="ROI">ROI</option>
            <option value="Producción">Producción</option>
            <option value="Promoción">Promoción</option>
            <option value="Programa iniciado">Programada iniciado</option>
        </select>
    </div>
}

export default StatusComponent