import * as dynamoose from "dynamoose";
import { makeid } from "../utils/forms";

const SchemaProduct = new dynamoose.Schema({
    "_id": {
        type: String,
        default: makeid(16)
    },
    "nombre": String,
    "tipo": String,
    "modalidad": String,
    "areaV": String,
    "quienPropone": String,
    "razon": String,
    "poblacionObj": String,
    "descripcion": String,
    "RVOE": String,
    "institucion": String,
    "creadoPor": String,
    "lastUpdate": {
        type: String,
        default: 'Jamás ha sido actualizado'
    },
    "status": {
        type: String,
        default: 'Revisión'
    },
    "etapa": {
        type: String,
        default: 'Propuesta'
    },
    "aprobadoPor": {
        type: String,
        default: 'No ha sido aprobado'
    },
    "objetivo": Array,
    "temas": {
        type: String,
        default: null
    },
    "titulacion": {
        type: String,
        default: null
    },
    "experto": {
        type: String,
        default: null
    },
    "requerimientos": {
        type: String,
        default: null
    },
    "instrumentoValidacion": {
        type: Array,
        schema: [String]
    },
    "datosSustentan": {
        type: String,
        default: null
    },
    "competencia": {
        type: String,
        default: null
    },
    "mercado": {
        type: String,
        default: null
    },
    "ROI": {
        type: String,
        default: null
    },
    "comentarios": Array,
    "archivosETP1": {
        type: Array,
        schema: [String]
    },
    "archivosETP2": {
        type: Array,
        schema: [String]
    },
    "prioridad": {
        type: String,
        default: "baja"
    },
    "generalComments": String,
    "fechaEjecucion": String,
    "fechaEntrega": String,
    "responsable": String,
    "likes": {
        type: Array,
        schema: [String]
    },
    "dislikes": {
        type: Array,
        schema: [String]
    }
});

const Product = dynamoose.model("P1_Productos", SchemaProduct);

export default Product;
