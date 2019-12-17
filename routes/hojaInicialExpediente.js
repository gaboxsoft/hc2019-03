const Paciente = require('../models/paciente');

const express = require('express');
const app = express();

const _ = require('underscore');

let { verificaToken, verificaAdminRol, rolADE } = require('../middleware/autenticacion');

//app.get('/pacientes', verificaToken, function(req, res) {

//    let limite = Number(req.query.limite || 0);
//    let desde = Number(req.query.desde || 0);

//    Paciente.find({ 'sello.situacion': { $eq: 1 } })
//        .limit(limite)
//        .skip(desde)
//        .exec((err, pacientes) => {
//            if (err) {
//                return res.status(400).
//                json({ ok: false, error: err });
//            };
//            Paciente.countDocuments({ 'sello.situacion': { $eq: 1 } }, (err, conteo) => {
//                if (err) {
//                    return res.status(400).
//                    json({ ok: false, error: err });
//                }
//                res.json({ ok: true, conteo: conteo, pacientes });
//            });
//        });
//});

////app.get('/paciente/:id', verificaToken, function (req, res) {
//  app.get('/paciente/:id',  function (req, res) {
//    const id = req.params.id;
//    let token = req.get('token');
//    console.log('En /paciente/', id, ' con token:', token);
//    Paciente.findById(id, (err, pacienteBD) => {
//        if (err) {
//            return res.status(400).
//            json({ ok: false, error: err, msg: 'Y esta esta chingadera....s' });
//        };
//        return res.json({ ok: true, paciente: pacienteBD });
//    });
//});

//app.post('/HojaInicialExpediente', [verificaToken, verificaAdminRol], function (req, res) {

//  let body = req.body;
//  let hojaInicialExpediente = {
//    hojaInicialExpediente: {
//      fechaIngreso: new Date().toLocaleDateString(),
//      alergias: '',
//      diagnosticoIngreso: '',
//      otrosDiagnosticos:''
//    },
//    sello: {
//      fechaModificacion: new Date().toLocaleString(),      
//      usuario: req.usuario._id
//    }
//  };

//    paciente.save((err, pacienteBD) => {
//        if (err) {
//            res.status(400).json({ ok: false, error: err, body: body });
//        } else {
//            res.json({ pacienteBD: pacienteBD });
//        }
//    });
//});
          
app.put('/HojaInicialExpediente/:id', [verificaToken, rolADE], function (req, res) {
 
  console.log('--  HojaInicialExpediente --');
  let body = req.body;
  console.log('body de route-HIE: ', req.body);
  console.log('paciente._id: ', `[${req.params.id}]`);
    let id = req.params.id;
    body.usuario = req.usuario._id;
    body.fechaModificacion = new Date().toLocaleString();

    body = _.pick(req.body, ['fechaIngreso',
      'nombreMT', 'tituloMT', 'tituloAbrMT', 'cedulaMT', 'institucionMT', 'especialidadMT', 'alergias',
      'diagnosticoIngreso', 'otrosDiagnosticos'
    ]);
   
  
    //console.log('body para modificar:', body);


    Paciente.findOneAndUpdate({ _id: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, pacienteBD) => {
        if (err) {
            return res.status(400).
            json({ ok: false, error: { mensaje: err } });
        }
        if (!pacienteBD) {
            return res.status(401).
            json({ ok: false, error: { mensaje: 'No existe paciente.' } });
        }
        res.json({ ok: true, pacienteBD: pacienteBD });
    })

});

//app.delete('/paciente/:id', [verificaToken, verificaAdminRol], function(req, res) {

//    let id = req.params.id;

//    let modificarEstado = { 'sello.situacion': 0 /* borrado*/ , 'sello.fechaBorrado': new Date().toLocaleString() };

//    Paciente.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, personaBorrado) => {
//        if (err) {
//            return res.status(400).json({ ok: false, error: { mensaje: err } });
//        };
//        if (!personaBorrado) {
//            return res.status(401).
//            json({ ok: false, error: { mensaje: 'No existe paciente.' } });
//        };
//        res.json({ ok: true, personaBorrado });
//    });

//});


module.exports = app;
