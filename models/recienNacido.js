


/////////////////////////////////
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const generoValido = require('../models/generoValido');
//const situacionValida = require('../models/situacionValida');
// const Domicilio = require('../models/domicilio');
//const Sello = require('../models/sello');
//const HojaInicialExpediente = require('../models/hojaInicialExpediente');
//const NotaUrgencia = require('../models/notaUrgencias');
//const HojaEvolucion = require('../models/hojaEvolucion');

const situacionValida = require('./situacionValida');



// Schema de recienNacido

let recienNacidoSchema = new Schema({
  // Nombre de recienNacido

  nombre: {
    type: String,
    minlength: 2,
    uppercase: true,
    required: [true, 'El NOMBRE es necesario.']
  },
  genero: {
    type: String,
    enum: generoValido,
    maxlength: 1,
    uppercase: true,
    required: [true, 'Se requiere especificar el género del recienNacido.']
  },
  fechaNacimiento: {
    type: Date,
    required: [true, 'La fecha de nacimiento del recienNacido es necesaria.']
  },

  edad: {
    type: Number
  },
  habitacion: {
    type: Number
  },
  nombreResponsable: {
    type: String,
    uppercase: true,
  },
  telefonosResponsable: {
    type: String,
    uppercase: true
  },


  //////////////////////////
  //// Domicilio
  calle: {
    type: String,
    uppercase: true
    //required: [true, 'El nombre de la calle es necesiaria.']
  },
  numExterior: {
    type: String,
    uppercase: true
    //required: [true, 'El número exterior es necesario.']
  },
  numInterior: {
    type: String,
    uppercase: true
    //required: [false, 'El número interior es opcional.']
  },
  colonia: {
    type: String,
    uppercase: true
    //required: [true, 'El nombre de la colonia es necesaria.']
  },
  municipio: {
    type: String,
    uppercase: true
    //required: [true, 'El nombre del municipio es necesario.']
  },
  entidad: {
    type: String,
    uppercase: true
    //required: [true, 'El nombre de la entidad es necesaria.']
  },
  pais: {
    type: String,
    uppercase: true
  },
  CP: {
    type: String,
    maxlength: 5,
    uppercase: true
    //required: [false, 'El nCódigo Postal es opcional.']
  },
  telefonos: {
    type: String,
    uppercase: true
    //required: [true, 'Almenos un teléfono es necesiario.']
  },
  /////////////////////////

  /////////////////////////
  // Médicos tratantes

  medicos: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }],


  ////medicoTratante: {
  ////  type: Schema.Types.ObjectId,
  ////  ref: 'Usuario'
  ////},

  tituloMT: {
    type: String,
    uppercase: true
  },
  tituloAbrMT: {
    type: String,
    uppercase: true
  },
  nombreMT: {
    type: String,
    uppercase: true
  },
  cedulaMT: {
    type: String,
    uppercase: true
  },
  institucionMT: {
    type: String,
    uppercase: true
  },
  especialidadMT: {
    type: String,
    uppercase: true
  },

  //////////////////////////

  //////////////////////////
  //// HojaInicialExpediente

  fechaIngreso: {
    type: Date,
    //required: [true, 'La fecha de ingreso es necesaria.'],
    default: () => { new Date().toLocaleString() }
  },
  alergias: {
    type: String,
    uppercase: true
    //required: [true, 'El número exterior es necesario.']
  },
  diagnosticoIngreso: {
    type: String,
    uppercase: true
    //required: [false, 'El número interior es opcional.']
  },
  otrosDiagnosticos: {
    type: String,
    uppercase: true
    //required: [true, 'El nombre de la colonia es necesaria.']
  },

  //////////////////////////
  //// Nota de urgencias
  fechaNota: {
    type: Date,
    //required: [true, 'La fecha de ingreso es necesaria.'],
    default: () => { new Date().toLocaleString() }
  },
  seguro: {
    type: String,
    uppercase: true
  },
  diagnosticoEgreso: {
    type: String,
    uppercase: true
  },
  ocupacion: { type: String },
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
  antecedentesImportancia: {
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

  /////////////////////////
  // Historia Clínica
  /////////////////////////
  edoCivil: {
    type: String,
    uppercase: true
  },
  lugarOrigen: {
    type: String,
    uppercase: true
  },
  antHeredoFam: {
    type: String,
    uppercase: true
  },
  personalesPato: {
    type: String,
    uppercase: true
  },
  personalesNoPato: {
    type: String,
    uppercase: true
  },
  menarca: {
    type: String,
    uppercase: true
  },
  tensionMens: {
    type: String,
    uppercase: true
  },
  ritmo: {
    type: String,
    uppercase: true
  },
  inicioVidaSexual: {
    type: String,
    uppercase: true
  },
  gestados: {
    type: String,
    uppercase: true
  },
  partos: {
    type: String,
    uppercase: true
  },
  abortos: {
    type: String,
    uppercase: true
  },
  cesareas: {
    type: String,
    uppercase: true
  },
  fechaUltimpoParto: {
    type: String,
    uppercase: true
  },
  fechaUltimoAborto: {
    type: String,
    uppercase: true
  },
  pesoProductos: {
    type: String,
    uppercase: true
  },
  fechaUltimaRegla: {
    type: String,
    uppercase: true
  },
  fechaUltimaCitoCervix: {
    type: String,
    uppercase: true
  },
  circuncision: {
    type: String,
    uppercase: true
  },
  proteccionMenstrual: {
    type: String,
    uppercase: true
  },
  otrosHistoriaClinica: {
    type: String,
    uppercase: true
  },
  padecimientoActual: {
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
  temperatura: {
    type: String,
    uppercase: true
  },
  tensionArterial: {
    type: String,
    uppercase: true
  },
  craneo: {
    type: String,
    uppercase: true
  },
  cara: {
    type: String,
    uppercase: true
  },
  fondoOcular: {
    type: String,
    uppercase: true
  },
  cuello: {
    type: String,
    uppercase: true
  },
  cardioPulmunar: {
    type: String,
    uppercase: true
  },
  abdomen: {
    type: String,
    uppercase: true
  },
  mamas: {
    type: String,
    uppercase: true
  },
  tactoVaginal: {
    type: String,
    uppercase: true
  },
  tactoRectal: {
    type: String,
    uppercase: true
  },
  miembros: {
    type: String,
    uppercase: true
  },
  ID: {
    type: String,
    uppercase: true
  },
  TX: {
    type: String,
    uppercase: true
  },
  LAB: {
    type: String,
    uppercase: true
  },
  USG: {
    type: String,
    uppercase: true
  },
  RX: {
    type: String,
    uppercase: true
  },
  /////////////////////////

  ////  //////////////////////////
  ////  // Notas de Urgencias
  ////  /////////////////////////
  ////  notasEvolucion: [{
  ////    type: Schema.Types.ObjectId,
  ////    ref: 'NotaUrgencias'
  ////  }],
  /////////////////////////////
  ////  //////////////////////////
  ////  // Hoja de Evolución
  ////  /////////////////////////
  ////  hojaEvolucion: [{
  ////    type: Schema.Types.ObjectId,
  ////    ref: 'HojaEvolucion'
  ////  }],
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

recienNacidoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único. ' })





module.exports = mongoose.model('Paciente', recienNacidoSchema);









// // Nombre de recienNacido
// nombres:
// paterno:
// materno: 
// genero: 
// fechaNacimiento: 
// //Domicilio
// calle:
// numExterior: 
// numInterior: 
// colonia: 
// municipio: 
// entidad: 
// CP: 
// telefonos: 
// pais:
