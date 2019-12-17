const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');


// Schema de programación quirúrgica

let progQuirurgicaSchema = new Schema({

  // paciente
  paciente: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente'
  },

  esUrgente: {
    type: String,
    uppercase: true,
  },
  fechaProgramada: {
    type: Date
  },

  hb: {
    type: String,
    uppercase: true,
  },
  ht: {
    type: String,
    uppercase: true,
  },
  gpoRH: {
    type: String,
    uppercase: true,
  },

  nombreResponsableProgramacion: {
    type: String,
    uppercase: true,
  },

  tiempoQuirurgico: {
    type: String,
    uppercase: true,
  },

  materialYEquipo: {
    type: String,
    uppercase: true,
  },

  operacionProyectada: {
    type: String,
    uppercase: true,
  },

  estudiosTransoperatorios: {
    type: String,
    uppercase: true,
  },

  diagnosticoPreoperatorio: {
    type: String,
    uppercase: true,
  },

  diagnosticoPostoperatorio: {
    type: String,
    uppercase: true,
  },

  operacionRealizada: {
    type: String,
    uppercase: true,
  },


  
  tipoAnestesia: {
    type: String, // Local-Regional/General
    uppercase: true,
  },

  incidentesYHallazgos: {
    type: String,
    uppercase: true,
  },
  
  descripcionTecnica: {
    type: String,
    uppercase: true,
  },

  complicaciones: {
    type: String,
    uppercase: true,
  },

  piezaQuirurgica: {
    type: String,
    uppercase: true,
  },

  medicoCirujano: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },

  firmaBase64MedicoCirujano: {
    type: String,
  },

  medicoAyudante1: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  medicoAyudante2: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },

  medicoAnestesiologo: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  firmaBase64Autorizo: {
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

module.exports = mongoose.model('ProgQuirurgica', progQuirurgicaSchema);

