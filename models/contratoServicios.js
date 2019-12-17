const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');

// Schema de paciente

let contratoServiciosSchema = new Schema({
  paciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente'
  },

  importeAnticipo: {
    type: Number,
    default: 0
  },
  ////
  // el medico tratante es el primer médico tratante del arreglo de medicos en paciente
  ////
  
  fechaFirmaContrato: {
    type: Date,
  },

  nombreRepresentanteLegalMedica: {
    type: String,
    uppercase: true,
    default: ''
  },

  nombreResponsablePaciente: {
    type: String,
    uppercase: true,
    default: ''
  },

  firmaBase64Paciente: {
    type: String,
    default: ''
  },
  firmaBase64RepresentanteLegal: {
    type: String,
    default: ''
  },
  firmaBase64ResponsablePaciente: {
    type: String,
    default: ''
  },




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


  module.exports = mongoose.model('ContratoServicios', contratoServiciosSchema);



