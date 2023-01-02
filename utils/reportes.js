import { compareDesc, formatDistance } from "date-fns";

export function StatusInforme(SAE, ARTEK) { // Revisión, Elección, Validado, No aprobado
    let statusSAE = [0, 0, 0, 0, 0];
    let statusARTEK = [0, 0, 0, 0, 0];

    SAE.map(({ statusProducto }) => {
        if (statusProducto === 'Revisión') statusSAE[0]++;
        if (statusProducto === 'Elección') statusSAE[1]++;
        if (statusProducto === 'Validado') statusSAE[2]++;
        if (statusProducto === 'Pendiente') statusSAE[3]++;
        if (statusProducto === 'No aprobado') statusSAE[4]++;
    });
    ARTEK.map(({ statusProducto }) => {
        if (statusProducto === 'Revisión') statusARTEK[0]++;
        if (statusProducto === 'Elección') statusARTEK[1]++;
        if (statusProducto === 'Validado') statusARTEK[2]++;
        if (statusProducto === 'Pendiente') statusARTEK[3]++;
        if (statusProducto === 'No aprobado') statusARTEK[4]++;
    });
    const resultado = [
        {
            labels: ['Revisión', 'Elección', 'Validado', 'Pendiente', 'No aprobado'],
            dataset: statusSAE
        },
        {
            dataset: statusARTEK
        }
    ]
    return resultado;
}

export function ModalidadInforme(SAE, ARTEK) { // Presencial, Mixto, En línea asincrónico, En línea sincrónico
    let modalidadSAE = [0, 0, 0, 0];
    let modalidadARTEK = [0, 0, 0, 0];

    SAE.map(({ modalidad }) => {
        if (modalidad === 'Presencial') modalidadSAE[0]++;
        if (modalidad === 'Mixto') modalidadSAE[1]++;
        if (modalidad === 'En línea asincrónico') modalidadSAE[2]++;
        if (modalidad === 'En línea sincrónico') modalidadSAE[3]++;
    });
    ARTEK.map(({ modalidad }) => {
        if (modalidad === 'Presencial') modalidadARTEK[0]++;
        if (modalidad === 'Mixto') modalidadARTEK[1]++;
        if (modalidad === 'En línea asincrónico') modalidadARTEK[2]++;
        if (modalidad === 'En línea sincrónico') modalidadARTEK[3]++;
    });
    const resultado = [
        {
            labels: ['Presencial', 'Mixto', 'En línea asincrónico', 'En línea sincrónico'],
            dataset: modalidadSAE
        },
        {
            dataset: modalidadARTEK
        }
    ]
    return resultado;
}

export function TipoOfertaInforme(SAE, ARTEK) { // Diplomado, Especialidad, Licenciatura, Maestría, Taller, Curso, Certificado, Libro, Otro
    let tipoOfertaSAE = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let tipoOfertaARTEK = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    SAE.map(({ tipo }) => {
        if (tipo === 'Diplomado') tipoOfertaSAE[0]++;
        if (tipo === 'Especialidad') tipoOfertaSAE[1]++;
        if (tipo === 'Licenciatura') tipoOfertaSAE[2]++;
        if (tipo === 'Maestría') tipoOfertaSAE[3]++;
        if (tipo === 'Taller') tipoOfertaSAE[4]++;
        if (tipo === 'Curso') tipoOfertaSAE[5]++;
        if (tipo === 'Certificado') tipoOfertaSAE[6]++;
        if (tipo === 'Libro') tipoOfertaSAE[7]++;
        if (tipo === 'Otro') tipoOfertaSAE[8]++;
    })
    ARTEK.map(({ tipo }) => {
        if (tipo === 'Diplomado') tipoOfertaARTEK[0]++;
        if (tipo === 'Especialidad') tipoOfertaARTEK[1]++;
        if (tipo === 'Licenciatura') tipoOfertaARTEK[2]++;
        if (tipo === 'Maestría') tipoOfertaARTEK[3]++;
        if (tipo === 'Taller') tipoOfertaARTEK[4]++;
        if (tipo === 'Curso') tipoOfertaARTEK[5]++;
        if (tipo === 'Certificado') tipoOfertaARTEK[6]++;
        if (tipo === 'Libro') tipoOfertaARTEK[7]++;
        if (tipo === 'Otro') tipoOfertaARTEK[8]++;
    })
    const resultado = [
        {
            labels: ['Diplomado', 'Especialidad', 'Licenciatura', 'Maestría', 'Taller', 'Curso', 'Certificado', 'Libro', 'Otro'],
            dataset: tipoOfertaSAE
        },
        {
            dataset: tipoOfertaARTEK
        }
    ]
    return resultado;
}

export function RVOEInforme(SAE, ARTEK) { // off, on
    let RVOESAE = [0, 0];
    let RVOEARTEK = [0, 0];

    SAE.map(({ RVOE }) => {
        if (RVOE === 'off') RVOESAE[0]++;
        if (RVOE === 'on') RVOESAE[1]++;
    })
    ARTEK.map(({ RVOE }) => {
        if (RVOE === 'off') RVOEARTEK[0]++;
        if (RVOE === 'on') RVOEARTEK[1]++;
    })
    const resultado = [
        {
            labels: ['Sin RVOE', 'Con RVOE'],
            dataset: RVOESAE
        },
        {
            dataset: RVOEARTEK
        }
    ]
    return resultado;
}

export function MasRecienteProducto(SAE, ARTEK) {
    let saeUltimoProducto;
    let artekUltimoProducto;
    const datesSAE = SAE.map((item) => new Date(item.createdAt).getTime());
    const ordenadoSAE = datesSAE.sort(compareDesc);
    saeUltimoProducto = SAE.filter((item) => item.createdAt === ordenadoSAE[0]);
    const datesARTEK = ARTEK.map((item) => new Date(item.createdAt).getTime());
    const ordenadoARTEK = datesARTEK.sort(compareDesc);
    artekUltimoProducto = ARTEK.filter((item) => item.createdAt === ordenadoARTEK[0]);
    return [saeUltimoProducto[0], artekUltimoProducto[0]];
}

export function RegistradosPorMes(SAE, ARTEK) {
    const meses = ['Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const mesesSAE = [0, 0, 0, 0, 0, 0];
    const mesesARTEK = [0, 0, 0, 0, 0, 0];
    console.log(SAE)
    SAE.map((sae) => {
        const fechaSAE = sae.creadoPor.split(" ");
        const monthSAE = meses.indexOf(fechaSAE[5]);
        mesesSAE[monthSAE]++;
    });
    ARTEK.map((sae) => {
        const fechaARTEK = sae.creadoPor.split(" ");
        const monthARTEK = meses.indexOf(fechaARTEK[5]);
        mesesARTEK[monthARTEK]++;
    })
    const resultado = [
        {
            labels: meses,
            dataset: mesesSAE
        },
        {
            dataset: mesesARTEK
        }
    ]
    return resultado;
}
