const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');


// Schema de consentimiento Informado

let altoRiesgoSchema = new Schema({
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
  
  identificacionPaciente: {
    type: String,
    uppercase: true,
  },

  numeroExpediente: {
    type: String,
    uppercase: true,
  },

 
  identificacionRepresentanteLegal: {
    type: String,
    uppercase: true,
  },
  nombreRepresentanteLegal: {
    type: String,
    uppercase: true,
  },
  
  estudio: {
    type: String,
    uppercase: true,
  },
  
  nombreResponsable: {
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
  identificacionTestigo1: {
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
  identificacionTestigo2: {
    type: String,
    uppercase: true,
  },
  firmaBase64Testigo2: {
    type: String,
  },
  medico: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  firmaBase64Medico: {
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


module.exports = mongoose.model('AltoRiesgo', altoRiesgoSchema);

