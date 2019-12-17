const ResponsivaRN = require('../models/responsivaRN');
const Paciente = require('../models/paciente');

const express = require('express');
const app = express();

const _ = require('underscore');

let { verificaToken, verificaAdminRol, rolADE, rolAD } = require('../middleware/autenticacion');
//app.get('/paciente/:id', verificaToken, function (req, res) {
app.get('/ResponsivaRN/:id', function (req, res) {
  const id = req.params.id; // Id del paciente
  let token = req.get('token');

  ResponsivaRN.findOne({ paciente: id }, (err, responsivaRNBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: err, mensaje: 'hubo en error' });
    };

    if (!responsivaRNBD) {
      return res.status(401).json({ ok: false, mensaje: 'No existe este responsiva Recién Nacido' });
    }

    return res.json({ ok: true, responsivaRN: responsivaRNBD });
  //}).populate('paciente').populate('medicoAnestesiologo');
  }).populate('paciente');
});

app.post('/ResponsivaRN/:id', [verificaToken, rolAD], function (req, res) {


  const id = req.params.id; // Id del paciente

  let body = req.body;


  console.log('2.- POST body= ', body);

  // Busca paciente
  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err });

    };
    if (!pacienteBD) {
      return res.status(401).json({ ok: false, error: 'NO ENCONTRÉ AL PACIENTE' });
    };
    // SOLO SI EL SEXO DEL PACIENTE ES FEMENINO
    if (pacienteBD.genero!='M' || pacienteBD.edad<11) {
      return res.status(401).json({ ok: false, error: 'EL PACIENTE NO TIENE GENERO FEMENINO O TIENE MENOS DE 10 AÑOS!' });
    };

    let responsivaRN = new ResponsivaRN({
      
      //////////////
      paciente: id,
      lugarFirma: 'METEPEC, ESTADO DE MÉXICO',
      fechaFirma: body.fechaFirma,

      nombreRN: body.nombreRN,
      sexoRN: body.sexoRN,
      fechaNacimientoRN: body.fechaNacimientoRN,

      nombreMadre: body.nombreMadre,
      firmaBase64Madre: body.firmaBase64Madre,

      nombreAutoriza: body.nombreAutoriza,
      parentescoAutoriza: body.parentescoAutoriza,
      firmaBase64Autoriza: body.firmaBase64Autoriza,

      nombreQuienEntregaRN: body.nombreQuienEntregaRN,
      cargoQuienEntregaRN: body.cargoQuienEntregaRN,
      firmaBase64QuienEntregaRN: body.firmaBase64QuienEntregaRN,

      /////////////////////////
      //Sello
      fechaCreacionSe: new Date(),
      fechaModificacionSe: new Date(),
      situacionSe: 1, //1-activo
      //fechaBorrado: default nada
      usuarioSe: req.usuario._id
    });

    responsivaRN.save((err, responsivaRNBD) => {
      if (err) {
        return res.status(400).json({ ok: false, error: err, body: responsivaRN });
      };
      return res.status(200).json({ ok: true, responsivaRN: responsivaRNBD });
    });
  });

});

app.put('/ResponsivaRN/:id', [verificaToken, rolADE], function (req, res) {
  const id = req.params.id; // Id del paciente

  let body = req.body;
  body.usuario = req.usuario._id;
  body.fechaModificacion = Date.now();

  console.log('3.- PUT this.ci= ', body);


  //Paciente.findByIdAndUpdate(id, { diagnosticoEgreso: body.diagnosticoEgreso }, (err, pacienteBD) => {
  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err });

    };
    if (!pacienteBD) {
      return res.status(401).json({ ok: false, error: 'NO ENCONTRÉ AL PACIENTE' });
    };

    // SOLO SI EL SEXO DEL PACIENTE ES FEMENINO
    if (pacienteBD.genero != 'M' || pacienteBD.edad < 11) {
      return res.status(401).json({ ok: false, error: 'EL PACIENTE NO TIENE GENERO FEMENINO O TIENE MENOS DE 10 AÑOS!' });
    };

    ResponsivaRN.findOneAndUpdate({ paciente: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, responsivaRNBD) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: { mensaje: err } });
      }
      if (!responsivaRNBD) {
        return res.status(401).
          json({ ok: false, error: { mensaje: 'No existe  responsiva Recién Nacido.' } });
      }
      return res.json({ ok: true, responsivaRN: responsivaRNBD });
    }).populate('paciente');
  });

});

//app.delete('/paciente/:id', [verificaToken, verificaAdminRol], function (req, res) {

//  let id = req.params.id;

//  let modificarEstado = { 'situacionSe': 0 /* borrado*/, 'fechaBorradoSe': new Date().toLocaleString() };

//  Paciente.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, personaBorrado) => {
//    if (err) {
//      return res.status(400).json({ ok: false, error: { mensaje: err } });
//    };
//    if (!personaBorrado) {
//      return res.status(401).
//        json({ ok: false, error: { mensaje: 'No existe paciente.' } });
//    };
//    res.json({ ok: true, personaBorrado });
//  });

//});

//app.put('/paciente/AgregaMedico/:id', [verificaToken, rolADE], function (req, res) {

//  let body = _.pick(req.body, [
//    'medicoId'
//  ]);
//  let id = req.params.id;
//  body.fechaModificacion = Date.now();

//  Paciente.findOne({ _id: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, pacienteBD) => {
//    if (err) {
//      return res.status(400).
//        json({ ok: false, mensaje: err });
//    };
//    if (!pacienteBD) {
//      return res.status(401).
//        json({ ok: false, mensaje: 'No existe paciente.' });
//    };

//    /// si existe paciente
//    // verifica que no exista en medicos
//    if (pacienteBD.medicos.indexOf(medicoId) === -1) {
//      pacienteBD.medicos.push(medicoId);
//      // actualiza
//      Paciente.findOneAndUpdate({ _id: id, 'situacionSe': { $eq: 1 } }, pacienteBD, { new: true, runValidators: true, context: 'query' }, (err, pacienteBD) => {
//        if (err) {
//          return res.status(400).
//            json({ ok: false, error: { mensaje: err } });
//        }
//        if (!pacienteBD) {
//          return res.status(401).
//            json({ ok: false, error: { mensaje: 'No existe paciente para actualizar.' } });
//        }
//        return res.status(200).json({ ok: true, paciente: pacienteBD });
//      })
//      // fin actualiza
//    };
//    ///
//    return res.status(400).json({ ok: false, mensaje: 'Ya existe médico tratante.' });
//  })




//});


module.exports = app;
