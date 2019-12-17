var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');

var notaUrgenciasSchema = new Schema({

  fechaNota: {
    type: Date,
    //required: [true, 'La fecha de ingreso es necesaria.'],
    default: () => { new Date().toLocaleString() }
  },
  firmaBase64: {
    type: String
  },
  //lugarNacimiento: {
  //  type: String
  //},
  //ocupacion: {
  //  type: String
  //},
  //estadoCivil: {
  //  type: String,
  //  enum: edoCivilValido
  //},
  seguro: {
    type: String,
    uppercase: true
  },
  diagnosticoEgreso: {
    type: String,
    uppercase: true
  },
  FC: {
    type: String,
    uppercase: true
  },
  FR: {
    type: String,
    uppercase: true
  },
  TA: {
    type: String,
    uppercase: true
  },
  T: {
    type: String,
    uppercase: true
  },
  peso: {
    type: String,
    uppercase: true
  },
  talla: {
    type: String,
    uppercase: true
  },
  antecedentes: {
    type: String,
    uppercase: true
  },
  resumenClinico: {
    type: String,
    uppercase: true
  },
  indicaciones: {
    type: String,
    uppercase: true
  },

  paciente: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },

  //situacionSe: {
  //  type: Number,
  //  default:1
  //},

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

module.exports = mongoose.model('NotaUrgencias', notaUrgenciasSchema);
