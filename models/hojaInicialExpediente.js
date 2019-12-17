const mongoose = require('mongoose');

let Schema = mongoose.Schema;


// Schema de HOja inicial del expediente

let hojaInicialExpedienteSchema = new Schema({

  fechaIngreso: {
    type: Date,
    //required: [true, 'La fecha de ingreso es necesaria.'],
    default: () => { new Date().toLocaleString() }
  },

  ////medicoTratante: {
  ////  type: Schema.Types.ObjectId,
  ////  ref: 'Usuario'
  ////},

  medicoTratante: {
    titulo: { type: String},
    nombre: { type: String },
    cedula: { type: String },
    institucion: { type: String },
    especialidad: { type: String}
  },



  alergias: {
    type: String
    //required: [true, 'El número exterior es necesario.']
  },
  diagnosticoIngreso: {
    type: String
    //required: [false, 'El número interior es opcional.']
  },
  otrosDiagnosticos: {
    type: String
    //required: [true, 'El nombre de la colonia es necesaria.']
  }

});

//module.exports = mongoose.model('Domicilio', domicilioSchema);
//module.exports = domicilioSchema;
