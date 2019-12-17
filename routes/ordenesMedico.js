const OrdenesMedico = require('../models/ordenesMedico');

const express = require('express');
const app = express();

const _ = require('underscore');


let { verificaToken, verificaAdminRol, rolD } = require('../middleware/autenticacion');



app.get('/OrdenesMedicos/:id', verificaToken, function (req, res) {

  let limite = Number(req.query.limite || 0);
  let desde = Number(req.query.desde || 0);
  // id es del Paciente
  let id = req.params.id;

  OrdenesMedico.find({ 'situacionSe': { $eq: 1 }, 'paciente': { $eq: id } })
    .populate('usuarioSe', 'nombre cedula especialidad institucion')
    .limit(limite)
    .skip(desde)
    .sort({ fechaOrdenes: 'desc' })
    .exec((err, ordenesMedicosBD) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: err });
      };
      if (!ordenesMedicosBD) {

        return res.json({ ok: true, conteo: 0, ordenesMedicos: {}, mensaje: 'No hay ordenes de Medicos.' });
      };
      //for (var i in ordenesMedicosBD) {
      //  //console.log('firma: ', ordenesMedicosBD[i]);
      //  if (ordenesMedicosBD[i].ordenes === 'F') {
      //    console.log('escribiendo firma: ', ordenesMedicosBD[i].ordenes);
      //    var dataImgDecodeFromBase64 = new Buffer.from(ordenesMedicosBD[i].firmaBase64, 'base64');
      //    require('fs').writeFile('firmita.png', dataImgDecodeFromBase64, (err) => {
      //      if (err) {
      //        console.log('\r\n\r\n====>> error al escribir archivo: ', err);
      //      }
      //    });
      //  }
      //}
      return res.json({ ok: true, conteo: ordenesMedicosBD.length, ordenesMedicos: ordenesMedicosBD });
    });
  //});
});


app.get('/OrdenesMedico/:id', function (req, res) {
  // id es de la ordenesMedico
  const id = req.params.id;
  
  if (!id || id === 'NONE') {
    return res.status(400).
      json({ ok: false, mensaje: 'NO existe ordenes del Medico' });
  };

  OrdenesMedico.findById(id, (err, ordenesMedicoBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: err, mensaje: 'No puede leer ordenes del Medico' });
    };
    if (!ordenesMedicoBD) {
      return res.status(400).
        json({ ok: false, mensaje: 'NO existe ordenes del Medico' });
    }
    return res.json({ ok: true, ordenesMedico: ordenesMedicoBD });
  });
});
//////////////////////////////////////////////////

app.post('/OrdenesMedico/:id', [verificaToken, rolD], function (req, res) {
  // id es del paciente
  let id = req.params.id;

  let body = req.body;
  //console.log('body antes de guardar ordenesMedico:', body);
  let ordenesMedico = new OrdenesMedico();
  ordenesMedico.fechaOrdenes = body.fechaOrdenes;
  ordenesMedico.ordenes = body.ordenes;
  ordenesMedico.paciente = id;
  ordenesMedico.firmaBase64 = body.firmaBase64;

  // que doctor lo modificó
  ordenesMedico.usuarioSe = req.usuario._id;

  ordenesMedico.fechaModificacionSe = new Date();
  ordenesMedico.fechaCreacionSe = new Date();
  //console.log('ordenesMedico antes de guardar ordenesMedico:', ordenesMedico);
  ordenesMedico.save((err, ordenesMedicoBD) => {
    if (err) {
      res.status(400).json({ ok: false, error: err });
    } else {
      return res.status(200).json({ok:true, ordenesMedico: ordenesMedicoBD });
    }
  });
});

app.put('/OrdenesMedico/:id', [verificaToken, rolD], function (req, res) {
  //console.log('--  ordenesMedico --');
  let body = req.body;
  
  

  // El id es de la ordenesMedico, no es necesario el pacienteId
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

  OrdenesMedico.findOneAndUpdate({ _id: id, 'situacionSe': { $eq: 1 }, usuarioSe: req.usuario._id }, body, (err, ordenesMedicoBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: { mensaje: err } });
    }
    if (!ordenesMedicoBD) {
      return res.status(401).
        json({ ok: false, error: { mensaje: 'No existe ordenesMedico.' } });
    }
    return res.status(200).json({ ok: true, ordenesMedico: ordenesMedicoBD });    
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
