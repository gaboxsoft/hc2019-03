const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');
const generoValido = require('../models/generoValido');

// Schema de consentimiento Informado

let responsivaRNSchema = new Schema({
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

  nombreRN: {
    type: String,
    uppercase: true,
  },

  sexoRN: {
    type: String,
    enum: generoValido,
    maxlength: 1,
    uppercase: true,
  },
  fechaNacimientoRN: {
    type: Date
  },

  nombreMadre: {
    type: String,
    uppercase: true,
  },
  firmaBase64Madre: {
    type: String,
  },


  nombreAutoriza: {
    type: String,
    uppercase: true,
  },
  parentescoAutoriza: {
    type: String,
    uppercase: true,
  },
  firmaBase64Autoriza: {
    type: String,
  },

  nombreQuienEntregaRN: {
    type: String,
    uppercase: true,
  },
  cargoQuienEntregaRN: {
    type: String,
    uppercase: true,
  },
  firmaBase64QuienEntregaRN: {
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


module.exports = mongoose.model('ResponsivaRN', responsivaRNSchema);

