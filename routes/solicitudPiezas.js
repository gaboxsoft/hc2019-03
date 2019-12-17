const SolicitudPiezas = require('../models/solicitudPiezas');

const Paciente = require('../models/paciente');

const express = require('express');
const app = express();

const _ = require('underscore');

let { verificaToken, verificaAdminRol, rolADE, rolAD } = require('../middleware/autenticacion');



//app.get('/paciente/:id', verificaToken, function (req, res) {
app.get('/SolicitudPiezas/:id', function (req, res) {
  const id = req.params.id; // Id del paciente
  let token = req.get('token');

  SolicitudPiezas.findOne({ paciente: id }, (err, solicitudPiezasBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: err, mensaje: 'hubo en error' });
    };

    if (!solicitudPiezasBD) {
      return res.status(401).json({ ok: false, mensaje: 'No existe este solicitud de estudio' });
    }



    return res.json({ ok: true, solicitudPiezas: solicitudPiezasBD });
    //}).populate('paciente').populate('medicoAnestesiologo');
  })
    .populate('paciente');
    
});

app.post('/SolicitudPiezas/:id', [verificaToken, rolAD], function (req, res) {


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
    
    let solicitudPiezas = new SolicitudPiezas({

      paciente: id,

      folio: body.folio,
      sala: body.sala,
      fechaSolicitud: body.fechaSolicitud,

      estudio: body.estudio,
      RPBI: body.RPBI,
      quien: body.quien,

      diagnostico: body.diagnostico,
      piezaAnatomica: body.piezaAnatomica,
      tipoIntervencion: body.tipoIntervencion,
      sitioObtencion: body.sitioObtencion,
      observaciones: body.observaciones,

      firmaBase64MedicoTratante: body.firmaBase64MedicoTratante,

      nombreEnfermera: body.nombreEnfermera,
      firmaBase64Enfermera: body.firmaBase64Enfermera,

      nombreER: body.nombreER,
      firmaBase64ER: body.firmaBase64ER,

      

      /////////////////////////
      //Sello
      fechaCreacionSe: new Date(),
      fechaModificacionSe: new Date(),
      situacionSe: 1, //1-activo
      //fechaBorrado: default nada
      usuarioSe: req.usuario._id
    });

    solicitudPiezas.save((err, solicitudPiezasBD) => {
      if (err) {
        return res.status(400).json({ ok: false, error: err, body: solicitudPiezas });
      };
      return res.status(200).json({ ok: true, solicitudPiezas: solicitudPiezasBD });
    });
  });

});

app.put('/SolicitudPiezas/:id', [verificaToken, rolADE], function (req, res) {
  const id = req.params.id; // Id del paciente

  let body = req.body;
  body.usuario = req.usuario._id;
  body.fechaModificacion = Date.now();

  //console.log('3.- PUT this.ci= ', body);


  //Paciente.findByIdAndUpdate(id, { diagnosticoEgreso: body.diagnosticoEgreso }, (err, pacienteBD) => {
  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err });

    };
    if (!pacienteBD) {
      return res.status(401).json({ ok: false, error: 'NO ENCONTRÉ AL PACIENTE' });
    };

    

    SolicitudPiezas.findOneAndUpdate({ paciente: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, solicitudPiezasBD) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: { mensaje: err } });
      }
      if (!solicitudPiezasBD) {
        return res.status(401).
          json({ ok: false, error: { mensaje: 'No existe  alta voluntaria.' } });
      }
      return res.json({ ok: true, solicitudPiezas: solicitudPiezasBD });
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
