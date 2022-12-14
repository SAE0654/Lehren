export function StatusInforme(SAE, ARTEK) { // Revisión, Recolección, Validado, No aprobado
    let statusSAE = [0, 0, 0, 0]; 
    let statusARTEK = [0, 0, 0, 0]; 

    SAE.map(({ statusProducto }) => {
        if (statusProducto === 'Revisión') statusSAE[0]++;
        if (statusProducto === 'Recolección') statusSAE[1]++;
        if (statusProducto === 'Validado') statusSAE[2]++;
        if (statusProducto === 'No aprobado') statusSAE[3]++;
    });
    ARTEK.map(({ statusProducto }) => {
        if (statusProducto === 'Revisión') statusARTEK[0]++;
        if (statusProducto === 'Recolección') statusARTEK[1]++;
        if (statusProducto === 'Validado') statusARTEK[2]++;
        if (statusProducto === 'No aprobado') statusARTEK[3]++;
    });
    const resultado = [
        {
            labels: ['Revisión', 'Recolección', 'Validado', 'No aprobado'],
            dataset: statusSAE
        },
        {
            labels: ['Revisión', 'Recolección', 'Validado', 'No aprobado'],
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
            labels: ['Presencial', 'Mixto', 'En línea asincrónico', 'En línea sincrónico'],
            dataset: modalidadARTEK
        }
    ]
    return resultado;
}