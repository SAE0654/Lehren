import { Schema, model, models } from 'mongoose';

const productoSchema = new Schema({
    // Datos generales
    RVOE: { type: String, required: true },
    tipo: { type: String, required: true },
    modalidad: { type: String, required: true },
    institucion: { type: String, required: true },
    quienPropone: { type: String, required: false },
    // Datos del mercado
    poblacionObj: { type: String, required: false },
    justificacionPropuesta: { type: String, required: false },
    evidenciaAdjunta: [],
    // Datos de la propuesta:
    nombre: { type: String, required: true },
    genDescProg: { type: String, required: true },
    objetivosPrograma: { type: String, required: false },
    propuestaInicialTemario: { type: String, required: false },
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
