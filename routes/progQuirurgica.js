const ProgQuirurgica = require('../models/progQuirurgica');

const Paciente = require('../models/paciente');

const express = require('express');
const app = express();

const _ = require('underscore');

let { verificaToken, verificaAdminRol, rolADE, rolAD } = require('../middleware/autenticacion');



//app.get('/paciente/:id', verificaToken, function (req, res) {
app.get('/ProgQuirurgica/:id', function (req, res) {
  const id = req.params.id; // Id del paciente
  let token = req.get('token');

  ProgQuirurgica.findOne({ paciente: id }, (err, progQuirurgicaBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: err, mensaje: 'hubo en error' });
    };

    if (!progQuirurgicaBD) {
      return res.status(401).json({ ok: false, mensaje: 'No existe este prog. Quirurgica' });
    }

    return res.json({ ok: true, progQuirurgica: progQuirurgicaBD });

  })
    .populate('paciente');

});

app.post('/ProgQuirurgica/:id', [verificaToken, rolAD], function (req, res) {


  const id = req.params.id; // Id del paciente

  let body = req.body;



  //console.log('2.- POST body= ', body);

  // Busca paciente
  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err });

    };
    if (!pacienteBD) {
      return res.status(401).json({ ok: false, error: 'NO ENCONTRÉ AL PACIENTE' });
    };

    let progQuirurgica = new ProgQuirurgica({

      paciente: id,



      esUrgente: body.esUrgente,
      fechaProgramada: body.fechaProgramada,
      nombreResponsableProgramacion: body.nombreResponsableProgramacion,

      hb: body.hb,
      ht: body.ht,
      gpoRH: body.gpoRH,
           
      tiempoQuirurgico: body.tiempoQuirurgico,
      materialYEquipo: body.materialYEquipo,
      operacionProyectada: body.operacionProyectada,

      estudiosTransoperatorios: body.estudiosTransoperatorios,
      diagnosticoPreoperatorio: body.diagnosticoPreoperatorio,
      diagnosticoPostoperatorio: body.diagnosticoPostoperatorio,
      operacionRealizada: body.operacionRealizada,
      tipoAnestesia: body.tipoAnestesia,

      incidentesYHallazgos: body.incidentesYHallazgos,

      descripcionTecnica: body.descripcionTecnica,
      complicaciones: body.complicaciones,

      piezaQuirurgica: body.piezaQuirurgica,

      medicoCirujano: body.medicoCirujano,

      firmaBase64MedicoCirujano: body.firmaBase64MedicoCirujano,
      medicoAyudante1: body.medicoAyudante1,
      medicoAyudante2: body.medicoAyudante2,
      medicoAnestesiologo: body.medicoAnestesiologo,
      firmaBase64Autorizo: body.firmaBase64Autorizo,

      /////////////////////////
      //Sello
      fechaCreacionSe: new Date(),
      fechaModificacionSe: new Date(),
      situacionSe: 1, //1-activo
      //fechaBorrado: default nada
      usuarioSe: req.usuario._id
    });

    progQuirurgica.save((err, progQuirurgicaBD) => {
      if (err) {
        return res.status(400).json({ ok: false, error: err, body: progQuirurgica });
      };
      return res.status(200).json({ ok: true, progQuirurgica: progQuirurgicaBD });
    });
  });

});

app.put('/ProgQuirurgica/:id', [verificaToken, rolADE], function (req, res) {
  const id = req.params.id; // Id del paciente

  let body = req.body;

  body.usuario = req.usuario._id;
  body.fechaModificacion = Date.now();
  //console.log('========== PUT ========');
  //console.log('3.- PUT = ', body);
  //console.log('=======================');
  //console.log('3.1.- PUT = ', req.body);

  //Paciente.findByIdAndUpdate(id, { diagnosticoEgreso: body.diagnosticoEgreso }, (err, pacienteBD) => {
  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err });

    };
    if (!pacienteBD) {
      return res.status(401).json({ ok: false, error: 'NO ENCONTRÉ AL PACIENTE' });
    };



    ProgQuirurgica.findOneAndUpdate({ paciente: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, progQuirurgicaBD) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: { mensaje: err } });
      }
      if (!progQuirurgicaBD) {
        return res.status(401).
          json({ ok: false, error: { mensaje: 'No existe  alta voluntaria.' } });
      }
      return res.json({ ok: true, progQuirurgica: progQuirurgicaBD });
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
