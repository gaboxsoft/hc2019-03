const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');


// Schema de consentimiento Informado

let consentimientoInformadoSchema = new Schema({
  // paciente
  paciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente'
  },

  lugarFirma: {
    type: String,
    uppercase: true,
  },

  fechaFirma: {
    type: Date
  },
  
  esUrgente: {
    type: String,
    uppercase: true,
  },

  diagnosticoEgreso: {
    type: String,
    uppercase: true,
  },

  preoperatorio: {
    type: String,
    uppercase: true,
  },
  procedimientoQuirurgico: {
    type: String,
    uppercase: true,
  },

  medicoAnestesiologo: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario'
  },
  nombrePaciente: {
    type: String,
    uppercase: true,
  },
  firmaBase64Paciente: {
    type: String,
  },

  firmaBase64Anestesiologo: {
    type: String,
  },

  nombreRepresentanteLegal: {
    type: String,
    uppercase: true,
  },
  firmaBase64RepresentanteLegal: {
    type: String,
  },

  nombreTestigo1: {
    type: String,
    uppercase: true,
  },
  firmaBase64Testigo1: {
    type: String,
  },

  nombreTestigo2: {
    type: String,
    uppercase: true,
  },
  firmaBase64Testigo2: {
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


module.exports = mongoose.model('ConsentimientoInformado', consentimientoInformadoSchema);

