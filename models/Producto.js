import { Schema, model, models } from 'mongoose';

const productoSchema = new Schema({
    // Datos generales
    RVOE: { type: String, required: true },
    tipo: { type: String, required: true },
    modalidad: { type: String, required: true },
    institucion: { type: String, required: true },
    quienPropone: { type: String, required: true },
    // Datos del mercado
    poblacionObj: { type: String, required: true },
    justificacionPropuesta: { type: String, required: true },
    evidenciaAdjunta: [],
    // Datos de la propuesta:
    nombre: { type: String, required: true },
    genDescProg: { type: String, required: true },
    objetivosPrograma: { type: String, required: true },
    propuestaInicialTemario: { type: String, required: true },
    horasTotales: { type: String, required: false },
    periodicidad: { type: String, required: false },
    responsable: { type: String, required: false },
    // Recursos extra necesarios
    descripcion: { type: String, required: false },
    // Extra
    creadoPor: { type: String, required: true },
    status: { type: String, default: 'Sin iniciar' },
    aprobadoPor: { type: String, default: 'No ha sido aprobado' },
    comentarios: [],
    // Agregados después
    generalComments: { type: String },
    areaV: { type: String, required: true },
    // Likes y dislikes
    likes: [],
    dislikes: []
})

const Producto = models.Producto || model('Producto', productoSchema);

export default Producto;


// const headers = [
//     { label: "No.", key: "no" },
//     { label: "Estatus", key: "status" },
//     { label: "Nombre del producto", key: "nombre" },
//     { label: "Descripción general", key: "genDescProg" },
//     { label: "Objetivos del programa", key: "objetivosPrograma" },
//     { label: "Propuesta inicial de temas", key: "propuestaInicialTemario" },
//     { label: "RVOE", key: "RVOE" },
//     { label: "Tipo de oferta", key: "tipo" },
//     { label: "Modalidad", key: "modalidad" },
//     { label: "Institución", key: "institucion" },
//     { label: "Persona o área que propone", key: "quienPropone" },
//     { label: "Área a la que se víncula", key: "areaV" },
//     { label: "A quién va dirigido", key: "poblacionObj" },
//     { label: "Justificación de la propuesta", key: "justificacionPropuesta" },
//     { label: "Creado por", key: "creadoPor" },
//     { label: "Me gusta", key: "meGusta" },
//     { label: "No me gusta", key: "noMeGusta" }
// ];
