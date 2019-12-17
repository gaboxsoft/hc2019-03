var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');

var ordenesMedicoSchema = new Schema({

  fechaOrdenes: {
    type: Date,
    //required: [true, 'La fecha de ingreso es necesaria.'],
    default: () => { new Date().toLocaleString() }
  },
  ordenes: {
    type: String,
    uppercase: true
  },
  paciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente'
  },
  firmaBase64: {
    type: String
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

});

module.exports = mongoose.model('OrdenesMedico', ordenesMedicoSchema);
