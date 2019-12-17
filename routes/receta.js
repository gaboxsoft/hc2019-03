const Receta = require('../models/receta');

const express = require('express');
const app = express();

const _ = require('underscore');


let { verificaToken, verificaAdminRol, rolD } = require('../middleware/autenticacion');



app.get('/Recetas/:id', verificaToken, function (req, res) {

  let limite = Number(req.query.limite || 0);
  let desde = Number(req.query.desde || 0);
  // id es del Paciente
  let id = req.params.id;

  Receta.find({ 'situacionSe': { $eq: 1 }, 'paciente': { $eq: id } })
    .populate('usuarioSe', 'nombre cedula especialidad institucion')
    .limit(limite)
    .skip(desde)
    .sort({ fechaReceta: 'desc' })
    .exec((err, recetasBD) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: err });
      };
      if (!recetasBD) {
        return res.json({ ok: true, conteo: 0, recetas: {}, mensaje: 'No hay recetas.' });
      };
      return res.json({ ok: true, conteo: recetasBD.length, recetas: recetasBD });
    });
  //});
});


app.get('/Receta/:id', function (req, res) {
  // id es de la receta
  const id = req.params.id;
  
  if (!id || id === 'NONE') {
    return res.status(400).
      json({ ok: false, mensaje: 'NO existe receta' });
  };

  Receta.findById(id, (err, recetaBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: err, mensaje: 'No puede leer receta' });
    };
    if (!recetaBD) {
      return res.status(400).
        json({ ok: false, mensaje: 'NO existe receta' });
    }
    return res.json({ ok: true, receta: recetaBD });
  });
});
//////////////////////////////////////////////////

app.post('/Receta/:id', [verificaToken, rolD], function (req, res) {
  // id es del paciente
  let id = req.params.id;

  let body = req.body;
  console.log('body antes de guardar receta:', body);
  let receta = new Receta();
  receta.fechaReceta = body.fechaReceta;
  receta.prescripcion = body.prescripcion;
  receta.paciente = id;
  receta.firmaBase64 = body.firmaBase64;

  // que doctor lo modificó
  receta.usuarioSe = req.usuario._id;

  receta.fechaModificacionSe = new Date();
  receta.fechaCreacionSe = new Date();
  receta.firmaBase64 = body.firmaBase64;

  console.log('receta antes de guardar receta:', receta);
  receta.save((err, recetaBD) => {
    if (err) {
      res.status(400).json({ ok: false, error: err });
    } else {
      return res.status(200).json({ok:true, receta: recetaBD });
    }
  });
});

app.put('/Receta/:id', [verificaToken, rolD], function (req, res) {
  //console.log('--  receta --');
  let body = req.body;
  
  

  // El id es de la receta, no es necesario el pacienteId
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

  Receta.findOneAndUpdate({ _id: id, 'situacionSe': { $eq: 1 }, usuarioSe: req.usuario._id }, body, (err, recetaBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: { mensaje: err } });
    }
    if (!recetaBD) {
      return res.status(401).
        json({ ok: false, error: { mensaje: 'No existe receta.' } });
    }
    return res.status(200).json({ ok: true, receta: recetaBD });    
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
