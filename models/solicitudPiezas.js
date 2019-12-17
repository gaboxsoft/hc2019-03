const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');


// Schema de consentimiento Informado

let solicitudPiezasSchema = new Schema({

  // paciente
  paciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente'
  },

  folio: {
    type: String,
    uppercase: true,
  },
  sala: {
    type: String,
    uppercase: true,
  },

  fechaSolicitud: {
    type: Date
  },  
  
  estudio: {
    type: String,
    uppercase: true,
  },

  RPBI: {
    type: String,
    uppercase: true,
  },
  
  quien: {
    type: String,
    uppercase: true,
  },

  diagnostico: {
    type: String,
    uppercase: true,
  },

  piezaAnatomica: {
    type: String,
    uppercase: true,
  },

  tipoIntervencion: {
    type: String,
    uppercase: true,
  },

  sitioObtencion: {
    type: String,
  },

  observaciones: {
    type: String,
    uppercase: true,
  },

  firmaBase64MedicoTratante: {
    type: String,
  },

  nombreEnfermera: {
    type: String,
    uppercase: true,
  },
  firmaBase64Enfermera: {
    type: String,
  },

  nombreER: {
    type: String,
    uppercase: true,
  },
  firmaBase64ER: {
    type: String,
  },
  /////////////////////////
  // Sello
  fechaCreacionSe: {
    type: Date,
    required: [true, 'La fecha de creación es necesaria.'],
    default: () => { new Date().toLocaleString() }
  },
  fechaModificacionSe: {
    type: Date
  },
  situacionSe: {
    type: Number,
    required: [true, 'La situación deldocumento es necesaria.'],
    enum: situacionValida,
    default: 1 // 0-borrardo,  1-activo
  },
  fechaBorradoSe: {
    type: Date
  },
  usuarioSe: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
  /////////////////////////
});

//try {
module.exports = mongoose.model('SolicitudPiezas', solicitudPiezasSchema);
//} catch (e) {
//  // DO Nothing
//}
