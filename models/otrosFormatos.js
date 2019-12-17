const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');


// Schema de programación quirúrgica

let otrosFormatosSchema = new Schema({

  // paciente
  paciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente'
  },

  msi21: {
    type: String,
  },
  msi21FechaSubido: {
    type: Date,
  },
  
  msi30: {
    type: String,
  },
  msi30FechaSubido: {
    type: Date,
  },

  msi31: {
    type: String,
  },
  msi31FechaSubido: {
    type: Date,
  },

  msi32: {
    type: String,
  },
  msi32FechaSubido: {
    type: Date,
  },

  msi33: {
    type: String,
  },
  msi33FechaSubido: {
    type: Date,
  },

  msi40: {
    type: String,
  },
  msi40FechaSubido: {
    type: Date,
  },

  msi41: {
    type: String,
  },
  msi41FechaSubido: {
    type: Date,
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

module.exports = mongoose.model('OtrosFormatos', otrosFormatosSchema);

