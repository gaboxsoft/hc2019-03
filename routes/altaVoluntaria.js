const AltaVoluntaria = require('../models/altaVoluntaria');
const Paciente = require('../models/paciente');

const express = require('express');
const app = express();

const _ = require('underscore');

let { verificaToken, verificaAdminRol, rolADE, rolAD } = require('../middleware/autenticacion');
//app.get('/paciente/:id', verificaToken, function (req, res) {
app.get('/AltaVoluntaria/:id', function (req, res) {
  const id = req.params.id; // Id del paciente
  let token = req.get('token');

  AltaVoluntaria.findOne({ paciente: id }, (err, altaVoluntariaBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: err, mensaje: 'hubo en error' });
    };

    if (!altaVoluntariaBD) {
      return res.status(401).json({ ok: false, mensaje: 'No existe este alta voluntaria' });
    }

    return res.json({ ok: true, altaVoluntaria: altaVoluntariaBD });
  //}).populate('paciente').populate('medicoAnestesiologo');
  }).populate('paciente');
});

app.post('/AltaVoluntaria/:id', [verificaToken, rolAD], function (req, res) {


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
    
    let altaVoluntaria = new AltaVoluntaria({
      paciente: id,
      lugarFirma: 'METEPEC, ESTADO DE MÉXICO',
      fechaFirma: body.fechaFirma,

      nombreAutoriza: body.nombreAutoriza,
      edadAutoriza: body.edadAutoriza,
      parentescoAutoriza: body.parentescoAutoriza,
      domicilioAutoriza: body.domicilioAutoriza,
      firmaBase64Autoriza: body.firmaBase64Autoriza,

      nombreTestigo1: body.nombreTestigo1,
      edadTestigo1: body.edadTestigo1,
      parentescoTestigo1: body.parentescoTestigo1,
      domicilioTestigo1: body.domicilioTestigo1,
      firmaBase64Testigo1: body.firmaBase64Testigo1,

      nombreTestigo2: body.nombreTestigo2,
      edadTestigo2: body.edadTestigo2,
      parentescoTestigo2: body.parentescoTestigo2,
      domicilioTestigo2: body.domicilioTestigo2,
      firmaBase64Testigo2: body.firmaBase64Testigo2,

      

      /////////////////////////
      //Sello
      fechaCreacionSe: new Date(),
      fechaModificacionSe: new Date(),
      situacionSe: 1, //1-activo
      //fechaBorrado: default nada
      usuarioSe: req.usuario._id
    });

    altaVoluntaria.save((err, altaVoluntariaBD) => {
      if (err) {
        return res.status(400).json({ ok: false, error: err, body: altaVoluntaria });
      };
      return res.status(200).json({ ok: true, altaVoluntaria: altaVoluntariaBD });
    });
  });

});

app.put('/AltaVoluntaria/:id', [verificaToken, rolADE], function (req, res) {
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

    

    AltaVoluntaria.findOneAndUpdate({ paciente: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, altaVoluntariaBD) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: { mensaje: err } });
      }
      if (!altaVoluntariaBD) {
        return res.status(401).
          json({ ok: false, error: { mensaje: 'No existe  alta voluntaria.' } });
      }
      return res.json({ ok: true, altaVoluntaria: altaVoluntariaBD });
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
