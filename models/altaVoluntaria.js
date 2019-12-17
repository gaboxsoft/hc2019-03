const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');


// Schema de consentimiento Informado

let altaVoluntariaSchema = new Schema({
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
  
  
  
  nombreAutoriza: {
    type: String,
    uppercase: true,
  },
  edadAutoriza: {
    type: String,
    uppercase: true,
  },
  parentescoAutoriza: {
    type: String,
    uppercase: true,
  },
  domicilioAutoriza: {
    type: String,
    uppercase: true,
  },
  firmaBase64Autoriza: {
    type: String,
  },


  nombreTestigo1: {
    type: String,
    uppercase: true,
  },
  edadTestigo1: {
    type: String,
    uppercase: true,
  },
  parentescoTestigo1: {
    type: String,
    uppercase: true,
  },
  domicilioTestigo1: {
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
  edadTestigo2: {
    type: String,
    uppercase: true,
  },
  parentescoTestigo2: {
    type: String,
    uppercase: true,
  },
  domicilioTestigo2: {
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


module.exports = mongoose.model('AltaVoluntaria', altaVoluntariaSchema);

