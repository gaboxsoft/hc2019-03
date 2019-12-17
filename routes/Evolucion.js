const Evolucion = require('../models/evolucion');

const express = require('express');
const app = express();

const _ = require('underscore');


let { verificaToken, verificaAdminRol, rolD } = require('../middleware/autenticacion');



app.get('/Evoluciones/:id', verificaToken, function (req, res) {

  let limite = Number(req.query.limite || 0);
  let desde = Number(req.query.desde || 0);
  // id es del Paciente
  let id = req.params.id;

  Evolucion.find({ 'situacionSe': { $eq: 1 }, 'paciente': { $eq: id } })
    .populate('usuarioSe', 'nombre cedula')
    .limit(limite)
    .skip(desde)
    .sort({ fecha: 'desc' })
    .exec((err, evolucionesBD) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: err });
      };
      if (!evolucionesBD) {
        return res.json({ ok: true, conteo: 0, evoluciones: {}, mensaje: 'No hay hoja de evolución.' });
      };
      //NotaUrgencias.countDocuments({ 'situacionSe': { $eq: 1 }, 'paciente': { $eq: id } }, (err, conteo) => {
      //      if (err) {
      //          return res.status(400).
      //          json({ ok: false, error: err });
      //      }
      //console.log(notasUrgenciasBD);

      return res.json({ ok: true, conteo: evolucionesBD.length, evoluciones: evolucionesBD });
    });
  //});
});

////////////////////////////////////////
//app.get('/paciente/:id', verificaToken, function (req, res) {
app.get('/Evolucion/:id', function (req, res) {
  // id es de la anotacion del a evolución
  const id = req.params.id;
  //let token = req.get('token');
  console.log('En API/get/notaUrgencia/:notaId/req', (req ? 'existe REQ' : '  NO existe REQ'));
  console.log('En API/get/notaUrgencia/:notaId/', id);
  if (!id || id === 'NONE') {
    return res.status(400).
      json({ ok: false, mensaje: 'NO existe anotación de evolución' });
  };

  Evolucion.findById(id, (err, evolucionBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: err, mensaje: 'No puede leer nota de evolución' });
    };
    if (!evolucionBD) {
      return res.status(400).
        json({ ok: false, mensaje: 'NO existe nota de evolución' });
    }
    return res.json({ ok: true, evolucion: evolucionBD });
  });
});
//////////////////////////////////////////////////

app.post('/Evolucion/:id', [verificaToken, rolD], function (req, res) {
  // id es del paciente
  let id = req.params.id;

  let body = req.body;
  let evolucion = new Evolucion();
  evolucion.fecha = body.fecha;
  evolucion.descripcion = body.descripcion;
  evolucion.paciente = id;
  evolucion.firmaBase64 = body.firmaBase64;

  // que doctor lo modificó
  evolucion.usuarioSe = req.usuario._id;

  evolucion.fechaModificacionSe = new Date();
  evolucion.fechaCreacionSe = new Date();

  evolucion.save((err, evolucionBD) => {
    if (err) {
      res.status(400).json({ ok: false, error: err });
    } else {
      res.json({ evolucion: evolucionBD });
    }
  });
});

app.put('/Evolucion/:id', [verificaToken, rolD], function (req, res) {
  console.log('--  Evolución --');
  let body = req.body;
  console.log('body de API/Evolucion: ', req.body);
  console.log('paciente._id: ', `[${req.params.id}]`);
  //console.log('notaEvolucion._id: ', `[${req.params.id}]`);

  // El id es de la nota de evolucion, no es necesario el pacienteId
  let id = req.params.id;

  //body.usuario = req.usuario._id;
  body.fechaModificacion = new Date().toLocaleString();

  //body = _.pick(req.body, ['fechaIngreso',
  //  'nombreMT', 'tituloMT', 'tituloAbrMT', 'cedulaMT', 'institucionMT', 'especialidadMT', 'alergias',
  //  'diagnosticoIngreso', 'otrosDiagnosticos'
  //]);


  //console.log('body para modificar:', body);

  // Para modificar: El usuario de la sesión debe ser el mismo usuario que lo escribió

  //////////
  Evolucion.findOneAndUpdate({ _id: id, 'situacionSe': { $eq: 1 }, usuarioSe: req.usuario._id }, body, (err, evolucionBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: { mensaje: err } });
    }
    if (!evolucionBD) {
      return res.status(401).
        json({ ok: false, error: { mensaje: 'No existe nota de Evolución.' } });
    }
    //// checa que sea el mismo usuario para poder modificar
    //console.log('evolucionBD............->', evolucionBD);
    //console.log('req.usuario._id........->', req.usuario._id);
    //if (evolucionBD.usuarioSe === req.usuario._id) {
    Evolucion.findOneAndUpdate({ _id: id, 'situacionSe': { $eq: 1 }, usuarioSe: req.usuario._id }, body, { new: true, runValidators: true, context: 'query' }, (err, evolucionBD) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: err });
      }
      if (!evolucionBD) {
        return res.status(401).
          json({ ok: false, error: { mensaje: 'No existe nota de Evolución.' } });
      }
      return res.status(200).json({ ok: true, evolucion: evolucionBD });
    });
    //}
    //else {
    //  return res.status(401).
    //    json({ ok: false, mensaje: 'No tienes permiso de modificar.' });
    //}
  });

});

///////////


////app.delete('/notaUrgencias/:id', [verificaToken, verificaAdminRol], function(req, res) {

////    let id = req.params.id;

////    let modificarEstado = { 'situacionSe': 0  , 'fechaBorradoSe': new Date().toLocaleString() };

////    NotaUrgencias.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, notaUrgenciasBorrado) => {
////        if (err) {
////            return res.status(400).json({ ok: false, error: { mensaje: err } });
////        };
////      if (!notaUrgenciasBorrado) {
////            return res.status(401).
////            json({ ok: false, error: { mensaje: 'No existe nota urgencias.' } });
////        };
////      res.json({ ok: true, notaUrgenciasBorrado });
////    });

////});



module.exports = app;
