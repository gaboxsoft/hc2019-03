const ContratoServicios = require('../models/contratoServicios');

const express = require('express');
const app = express();

const _ = require('underscore');

let { verificaToken, verificaAdminRol, rolADE } = require('../middleware/autenticacion');

/////////
// Sólo hay contrato por paciente
/////////
{ //app.get('/pacientes', verificaToken, function (req, res) {

  //  //console.log((req ? 'REQ si' : 'REQ no'));
  //  //console.log((req.query ? 'REQ.query si' : 'REQ.query no'));
  //  //console.log((req.query.limite ? 'REQ.query.limite si' : 'REQ.query.limite no'));
  //  //console.log((req.query.desde ? 'REQ.query.desde si' : 'REQ.query.desde no'));
  //  let limite = Number(req.query.limite || 0);
  //  let desde = Number(req.query.desde || 0);
  //  // medico/enfermero(a)/admin usuario
  //  let usuarioId = req.get('usuarioId');
  //  let usuario = req.usuario;

  //  let query = {};
  //  if (usuario.rol === 'ADMIN_ROL' || usuario.rol === 'ENFERMERIA_ROL') {
  //    query = { 'situacionSe': { $eq: 1 } };
  //  }
  //  else {
  //    query = {
  //      'situacionSe': { $eq: 1 }, medicos: {$all: [usuarioId]} };
  //  }

//  ContratoServicios.find(query)
//    .limit(limite)
//    //.populate('usuario', 'nombre email')
//    .populate('medicos', 'nombre')

//    .skip(desde)
//    //.populate('usuario', 'nombre')
//    .exec((err, pacientes) => {
//      if (err) {
//        return res.status(400).
//          json({ ok: false, error: err });
//      };
//      ContratoServicios.countDocuments(query, (err, conteo) => {
//        if (err) {
//          return res.status(400).
//            json({ ok: false, error: err });
//        }
//        //console.log('PACIENTES:', pacientes.medicos);
//        return res.status(200).json({ ok: true, conteo: conteo, pacientes });
//      });
//    });
//});
}

app.get('/contratoServicios/:id', [verificaToken, verificaAdminRol], function (req, res) {
//app.get('/contratoServicios/:id', function (req, res) {

  // Este es el id de paciente
  const id = req.params.id;
  let token = req.get('token');
  //console.log('En /contratoServicio/', id, ' con token:', token);
  // Encuentra un contrato por Id de paciente
  ContratoServicios.findOne({ paciente:id }, (err, contratoServiciosBD) => {
    if (err) {
      return res.status(401).
        json({ ok: false, error: err });
    };
    if (!contratoServiciosBD) {
      
      //// si no hay contrato, crea y envía un contrato en blanco
      //let contrato = new ContratoServicios();
      //console.log('contrato vacio=', contrato);
      //contrato._id = 'NUEVO'; // PARA SABER QUE ES NUEVO

      //contrato.save((err, contratoServiciosBD) => {
      //  if (err) {
      //    console.log('error primera vez escribi contrato', err);
      //    return res.status(400).json({ ok: false, error: err });
      //  };
      //  if (!contratoServiciosBD) {
      //    console.log('primera escribi contrato no pude');
      //    return res.status(401).json({ ok: false, error: 'no pude crear contrato....' });
      //  };
      //  console.log('primera si escribi contrato', contratoServiciosBD);
      //  return res.status(200).json({ ok: true, contratoServicios: contratoServiciosBD });
     
      //});
      return res.status(400).json({ ok: false, error: 'no hay contrato' });
    }
    //contratoServicioBD.populate('medicos', 'nombre');
    //console.log('contratoServicioBD -->', contratoServicioBD);
    return res.json({ ok: true, contratoServicios: contratoServiciosBD });
  }).populate('paciente');
});

app.post('/contratoServicios/:id', [verificaToken, verificaAdminRol], function (req, res) {
  // Id del paciente
  let id = req.params.id;

  let body = req.body;
  let contratoServicio = new ContratoServicios({
    paciente: id,
    nombreResponsablePaciente: body.nombreResponsablePaciente,
    nombreRepresentanteLegalMedica: body.nombreRepresentanteLegalMedica,
    importeAnticipo: body.importeAnticipo,
    fechaFirmaContrato: body.fechaFirmaContrato,      

    firmaBase64Paciente: body.firmaBase64Paciente,
    firmaBase64RepresentanteLegal: body.firmaBase64RepresentanteLegal,
    firmaBase64ResponsablePaciente: body.firmaBase64ResponsablePaciente,

    
     /////////////////////////
      //Sello
      fechaCreacionSe: new Date(),
    fechaModificacionSe: new Date(),
    situacionSe: 1, //1-activo
    //fechaBorrado: default nada
    usuarioSe: req.usuario._id

  });

  contratoServicio.save((err, contratoServicioBD) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err });
    };
    if (!contratoServicioBD) {
      return res.status(401).json({ ok: false, error: 'No pude guardar el contrato de servicios' });
    }
    res.status(200).json({ ok: true, contratoServicio: contratoServicioBD });
  });
});

app.put('/contratoServicios/:id', [verificaToken, rolADE], function (req, res) {

  //let body = _.pick(req.body, [
  //  //'folioCuenta',
  //  'nombre', 'fechaNacimiento', 'genero',
  //  'edoCivil', 'edad', 'habitacion',
  //  'nombreResponsable', 'telefonosResponsable',
  //  'ocupacion',
  //  'calle', 'numInterior', 'numExterior',
  //  'colonia', 'municipio',
  //  'entidad', 'pais', 'telefonos', 'CP',
  //  'nombreMT', 'cedulaMT', 'institucionMT',
  //  'usuarioSe', 'medicos'
  //]);
  let body = req.body;
  //console.log('body: ', body);
  //console.log('contratoServicio._id: ', req.params.id);

  let id = req.params.id;
  body.usuarioSe = req.usuario._id;
  body.fechaModificacion = Date.now();
  //fechaNacimiento: new Date(body.fechaNacimiento),

  //console.log('body para modificar:', body);


  ContratoServicios.findOneAndUpdate({ paciente: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, contratoServicioBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: { mensaje: err } });
    }
    if (!contratoServicioBD) {
      return res.status(401).
        json({ ok: false, error: { mensaje: 'No existe contratoServicio.' } });
    }
    res.json({ ok: true, contratoServicio: contratoServicioBD });
  }).populate('medicos', 'cedula nombre especialidad')
  .populate('paciente');

});

app.delete('/contratoServicios/:id', [verificaToken, verificaAdminRol], function (req, res) {

  let id = req.params.id;

  let modificarEstado = { 'situacionSe': 0 /* borrado*/, 'fechaBorradoSe': new Date().toLocaleString() };

  ContratoServicios.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, personaBorrado) => {
    if (err) {
      return res.status(400).json({ ok: false, error: { mensaje: err } });
    };
    if (!personaBorrado) {
      return res.status(401).
        json({ ok: false, error: { mensaje: 'No existe contratoServicio.' } });
    };
    res.json({ ok: true, personaBorrado });
  });

});

//app.put('/contratoServicio/AgregaMedico/:id', [verificaToken, rolADE], function (req, res) {

//  let body = _.pick(req.body, [
//    'medicoId'
//  ]);
//  let id = req.params.id;
//  body.fechaModificacion = Date.now();

//  ContratoServicios.findOne({ _id: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, contratoServicioBD) => {
//    if (err) {
//      return res.status(400).
//        json({ ok: false, mensaje: err });
//    };
//    if (!contratoServicioBD) {
//      return res.status(401).
//        json({ ok: false, mensaje: 'No existe contratoServicio.' });
//    };

//    /// si existe contratoServicio
//    // verifica que no exista en medicos
//    if (contratoServicioBD.medicos.indexOf(medicoId) === -1) {
//      contratoServicioBD.medicos.push(medicoId);
//      // actualiza
//      ContratoServicios.findOneAndUpdate({ _id: id, 'situacionSe': { $eq: 1 } }, contratoServicioBD, { new: true, runValidators: true, context: 'query' }, (err, contratoServicioBD) => {
//        if (err) {
//          return res.status(400).
//            json({ ok: false, error: { mensaje: err } });
//        }
//        if (!contratoServicioBD) {
//          return res.status(401).
//            json({ ok: false, error: { mensaje: 'No existe contratoServicio para actualizar.' } });
//        }
//        return res.status(200).json({ ok: true, contratoServicio: contratoServicioBD });
//      })
//      // fin actualiza
//    };
//    ///
//    return res.status(400).json({ ok: false, mensaje: 'Ya existe médico tratante.' });
//  })




//});


module.exports = app;
