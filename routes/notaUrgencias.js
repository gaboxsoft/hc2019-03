const NotaUrgencias = require('../models/notaUrgencias');
const Paciente = require('../models/paciente');

const express = require('express');
const app = express();

const _ = require('underscore');


let { verificaToken, verificaAdminRol, rolADE } = require('../middleware/autenticacion');



app.get('/notasUrgencias/:id', verificaToken, function (req, res) {

  let limite = Number(req.query.limite || 0);
  let desde = Number(req.query.desde || 0);
  let id = req.params.id;

  NotaUrgencias.find({ 'situacionSe': { $eq: 1 }, 'paciente': { $eq: id } })
    .limit(limite)
    .skip(desde)
    .sort({ fechaNota: 'desc' })
    .exec((err, notasUrgenciasBD) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: err });
      };
      if (!notasUrgenciasBD) {
        return res.json({ ok: true, conteo: 0, notasUrgencias: {}, mensaje: 'No hay notas de urgencias.' });
      };
      //NotaUrgencias.countDocuments({ 'situacionSe': { $eq: 1 }, 'paciente': { $eq: id } }, (err, conteo) => {
      //      if (err) {
      //          return res.status(400).
      //          json({ ok: false, error: err });
      //      }
      //console.log(notasUrgenciasBD);

      return res.json({ ok: true, conteo: notasUrgenciasBD.length, notasUrgencias: notasUrgenciasBD });
    });
  //});
});

////////////////////////////////////////
//app.get('/paciente/:id', verificaToken, function (req, res) {
app.get('/notaUrgencias/:id', function (req, res) {
  const id = req.params.id;
  //let token = req.get('token');
  console.log('En API/get/notaUrgencia/:notaId/req', (req ? 'existe REQ' : '  NO existe REQ'));
  console.log('En API/get/notaUrgencia/:notaId/', id);
  if (!id || id === 'NONE') {
    return res.status(400).
      json({ ok: false, mensaje: 'existe nota de urgencias' });
  };

  NotaUrgencias.findById(id, (err, notaUrgenciasBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: err, mensaje: 'No puede leer nota urgencias' });
    };
    if (!notaUrgenciasBD) {
      return res.status(400).
        json({ ok: false, mensaje: 'existe nota de urgencias' });
    }
    return res.json({ ok: true, notaUrgencias: notaUrgenciasBD });
  });
});
//////////////////////////////////////////////////

app.post('/notaUrgencias/:id', [verificaToken, rolADE], function (req, res) {



  let id = req.params.id;
  let body = req.body;
  //console.log('en POST/notaUrgencias/body:', body);

  let notaUrgencias = new NotaUrgencias();
  notaUrgencias.fechaNota = body.fechaNota;
  notaUrgencias.seguro = body.seguro;
  notaUrgencias.diagnosticoEgreso = body.diagnosticoEgreso;
  notaUrgencias.FC = body.FC;
  notaUrgencias.FR = body.FR;
  notaUrgencias.TA = body.TA;
  notaUrgencias.T = body.T;
  notaUrgencias.peso = body.FR;
  notaUrgencias.talla = body.talla;
  notaUrgencias.antecedentes = body.antecedentes;
  notaUrgencias.resumenClinico = body.resumenClinico;
  notaUrgencias.indicaciones = body.indicaciones;
  notaUrgencias.paciente = id;

  notaUrgencias.usuarioSe = req.usuario._id;
  notaUrgencias.fechaModificacionSe = new Date();
  notaUrgencias.fechaCreacionSe = new Date();
  notaUrgencias.firmaBase64 = body.firmaBase64;

  notaUrgencias.save((err, notaUrgenciasBD) => {
    if (err) {
      res.status(400).json({ ok: false, error: err, body: body });
    } else {
      Paciente.findByIdAndUpdate(id, { diagnosticoEgreso: body.diagnosticoEgreso }, (err, pacienteBD) => {
        if (err) {
          console.log('error en guardar diagnóstico egresos', err)
        };
        if (!pacienteBD) {
          console.log('no encontré paciente en diagnóst. egreso')
        }
        res.status(200).json({ok:true, notaUrgencias: notaUrgenciasBD });
      });
      
    }
  });
});

app.put('/NotaUrgencias/:id', [verificaToken, rolADE], function (req, res) {

  console.log('--  Nota Urgencias --');
  let body = req.body;
  console.log('body de route-nota urgencias: ', req.body);
  console.log('paciente._id: ', `[${req.params.id}]`);
  let id = req.params.id;
  //body.usuario = req.usuario._id;
  body.fechaModificacion = new Date().toLocaleString();

  //body = _.pick(req.body, ['fechaIngreso',
  //  'nombreMT', 'tituloMT', 'tituloAbrMT', 'cedulaMT', 'institucionMT', 'especialidadMT', 'alergias',
  //  'diagnosticoIngreso', 'otrosDiagnosticos'
  //]);


  //console.log('body para modificar:', body);


  NotaUrgencias.findOneAndUpdate({ _id: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, notaUrgenciasBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: { mensaje: err } });
    }
    if (!notaUrgenciasBD) {
      return res.status(401).
        json({ ok: false, error: { mensaje: 'No existe nota de Urgencias.' } });
    }

    /////////////
    Paciente.findByIdAndUpdate(notaUrgenciasBD.paciente, { diagnosticoEgreso: body.diagnosticoEgreso }, (err, pacienteBD) => {
      if (err) {
        console.log('error en guardar diagnóstico egresos', err)
      };
      if (!pacienteBD) {
        console.log('no encontré paciente en diagnóst. egreso')
      }
      res.status(200).json({ ok: true, notaUrgencias: notaUrgenciasBD });
    });
    ///////////////
    //res.json({ ok: true, notaUrgenciasBD: notaUrgenciasBD });
  })

});

app.delete('/notaUrgencias/:id', [verificaToken, verificaAdminRol], function (req, res) {

  let id = req.params.id;

  let modificarEstado = { 'situacionSe': 0, 'fechaBorradoSe': new Date().toLocaleString() };

  NotaUrgencias.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, notaUrgenciasBorrado) => {
    if (err) {
      return res.status(400).json({ ok: false, error: { mensaje: err } });
    };
    if (!notaUrgenciasBorrado) {
      return res.status(401).
        json({ ok: false, error: { mensaje: 'No existe nota urgencias.' } });
    };
    res.json({ ok: true, notaUrgenciasBorrado });
  });

});



module.exports = app;
