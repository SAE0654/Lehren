import { Schema, model, models } from 'mongoose';

const productoSchema = new Schema({
    // Datos generales
    nombre: { type: String, required: true },
    tipo: { type: String, required: true },
    modalidad: { type: String, required: true },
    areaV: { type: String, required: true },
    quienPropone: { type: String, required: true },
    // Análisis académico
    razon: { type: String, required: true },
    poblacionObj: { type: String, required: true },
    descripcion: { type: String, required: true },
    RVOE: { type: String, required: true },
    institucion: { type: String, required: true },
    creadoPor: { type: String, required: true },
    lastUpdate: { type: String, default: 'Sin actualizaciones' },
    status: { type: String, default: 'Revisión'},
    etapa: {type: String, default: 'Propuesta'},
    aprobadoPor: { type: String, default: 'No ha sido aprobado' },
    objetivo: [],
    temas: { type: String, default: null},
    titulacion: { type: String, default: null},
    experto: { type: String, default: null },
    requerimientos: { type: String, default: null },
    // Análisis de mercado
    instrumentoValidacion: [],
    datosSustentan: { type: String, default: null },
    competencia: { type: String, default: null },
    mercado: { type: String, default: null },
    // Análisis financiero
    ROI: { type: String, default: null },
    comentarios: [],
    archivosETP1: [],
    archivosETP2: [],
    // Agregados después
    prioridad: { type: String, default: "baja" },
    generalComments: { type: String },
    fechaEjecucion: { type: String},
    fechaEntrega: { type: String },
    responsable: { type: String },
    // Likes y dislikes
    likes: [],
    dislikes: []
})

const Producto = models.Producto || model('Producto', productoSchema);

export default Producto;
