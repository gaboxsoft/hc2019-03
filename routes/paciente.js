const Paciente = require('../models/paciente');

const express = require('express');
const app = express();

const _ = require('underscore');

let { verificaToken, verificaAdminRol, rolADE } = require('../middleware/autenticacion');

app.get('/pacientes', verificaToken, function (req, res) {

  //console.log((req ? 'REQ si' : 'REQ no'));
  //console.log((req.query ? 'REQ.query si' : 'REQ.query no'));
  //console.log((req.query.limite ? 'REQ.query.limite si' : 'REQ.query.limite no'));
  //console.log((req.query.desde ? 'REQ.query.desde si' : 'REQ.query.desde no'));
  let limite = Number(req.query.limite || 0);
  let desde = Number(req.query.desde || 0);
  // medico/enfermero(a)/admin usuario
  let usuarioId = req.get('usuarioId');
  let usuario = req.usuario;

  let query = {};
  if (usuario.rol === 'ADMIN_ROL' || usuario.rol === 'ENFERMERIA_ROL') {
    query = { 'situacionSe': { $eq: 1 } };
  }
  else {
    query = {
      'situacionSe': { $eq: 1 }, medicos: {$all: [usuarioId]} };
  }

  Paciente.find(query)
    .limit(limite)
    //.populate('usuario', 'nombre email')
    .populate('medicos', 'nombre')

    .skip(desde)
    //.populate('usuario', 'nombre')
    .exec((err, pacientes) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: err });
      };
      Paciente.countDocuments(query, (err, conteo) => {
        if (err) {
          return res.status(400).
            json({ ok: false, error: err });
        }
        //console.log('PACIENTES:', pacientes.medicos);
        return res.status(200).json({ ok: true, conteo: conteo, pacientes });
      });
    });
});

//app.get('/paciente/:id', verificaToken, function (req, res) {
app.get('/paciente/:id', function (req, res) {
  const id = req.params.id;
  let token = req.get('token');
  //console.log('En /paciente/', id, ' con token:', token);
  Paciente.findById(id, (err, pacienteBD) => {
    if (err) {
      return res.status(401).
        json({ ok: false, error: err, mensaje: 'hubo en error' });
    };
    if (!pacienteBD) {
      return res.status(401).json({ ok: false, mensaje: 'No existe este paciente' });
    }
    //pacienteBD.populate('medicos', 'nombre');
    //console.log('pacienteBD -->', pacienteBD);
    return res.json({ ok: true, paciente: pacienteBD });
  }).populate('medicos', 'nombre cedula especialidad');
});

app.post('/paciente', [verificaToken, verificaAdminRol], function (req, res) {

  let body = req.body;
  let paciente = new Paciente({
    folioCuenta: body.folioCuenta,
    nombre: body.nombre,
    genero: body.genero,
    fechaNacimiento: new Date(body.fechaNacimiento),

    edad: body.edad,
    habitacion: body.habitacion,
    nombreResponsable: body.nombreResponsable,
    telefonosResponsable: body.telefonosResponsable,

    calle: body.calle,
    numeroInterior: body.numeroInterior,
    numeroExterior: body.numeroExterior,
    colonia: body.colonia,
    municipio: body.municipio,
    entidad: body.entidad,
    pais: body.pais,
    cp: body.cp,
    telefonos: body.telefonos,
    ////////////////
    // Hoja inicial expediente
    fechaIngreso: new Date().toLocaleDateString(),
    alergias: '',
    diagnosticoIngreso: '',
    otrosDiagnosticos: '',
    tituloMT: '',
    tituloAbrMT: '',
    nombreMT: '',
    cedulaMT: '',
    institucionMT: '',
    especialidadMT: '',

    //////////////////////////
    //// Nota de urgencias
    fecha1: '',
    seguro: '',
    ocupacion: '',
    diagnosticoEgreso: '',
    FC: '',
    FR: '',
    TA: '',
    T: '',
    peso1: '',
    talla1: '',
    antecedentesImportancia1: '',
    resumenClinico1: '',
    indicaciones1: '',

    /////////////////////////
    // Historia clínica
    lugarOrigen: '',
    antHeredoFam: '',
    personalesPato: '',
    personalesNoPato: '',
    ago: '',
    tensionMens: '',
    ritmo: '',
    inicioVidaSexual: '',
    gestados: '',
    partos: '',
    abortos: '',
    cesareas: '',
    fechaUltimpoParto: '',
    fechaUltimoAborto: '',
    pesoProductos: '',
    fechaUltimaRegla: '',
    fechaUltimaCitoCervix: '',
    circuncision: '',
    protecciónMenstrual: '',
    otrosHistoriaClinica: '',
    padecimientoActual: '',
    peso: '',
    talla: '',
    temperatura: '',
    tensionArterial: '',
    craneo: '',
    cara: '',
    fondoOcular: '',
    cuello: '',
    cardioPulmunar: '',
    abdomen: '',
    mamas: '',
    tactoVaginal: '',
    tactoRectal: '',
    miembros: '',
    ID: '',
    TX: '',
    LAB: '',
    USG: '',
    RX: '',
    /////////////////////////
    //Sello
    fechaCreacionSe: new Date(),
    fechaModificacionSe: new Date(),
    situacionSe: 1, //1-activo
    //fechaBorrado: default nada
    usuarioSe: req.usuario._id
  });

  paciente.save((err, pacienteBD) => {
    if (err) {
      res.status(400).json({ ok: false, error: err, body: paciente });
    } else {
      res.json({ paciente: pacienteBD });
    }
  });
});

app.put('/paciente/:id', [verificaToken, rolADE], function (req, res) {

  let body = _.pick(req.body, [
    //'folioCuenta',
    'nombre', 'fechaNacimiento', 'genero',
    'edoCivil', 'edad', 'habitacion',
    'nombreResponsable', 'telefonosResponsable',
    'ocupacion',
    'calle', 'numInterior', 'numExterior',
    'colonia', 'municipio',
    'entidad', 'pais', 'telefonos', 'CP',
    'nombreMT', 'cedulaMT', 'institucionMT',
    'usuarioSe', 'medicos'
  ]);

  //console.log('body: ', body);
  //console.log('paciente._id: ', req.params.id);

  let id = req.params.id;
  body.usuario = req.usuario._id;
  body.fechaModificacion = Date.now();
  //fechaNacimiento: new Date(body.fechaNacimiento),

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
    res.json({ ok: true, paciente: pacienteBD });
  }).populate('medicos', 'cedula nombre especialidad');

});

app.delete('/paciente/:id', [verificaToken, verificaAdminRol], function (req, res) {

  let id = req.params.id;

  let modificarEstado = { 'situacionSe': 0 /* borrado*/, 'fechaBorradoSe': new Date().toLocaleString() };

  Paciente.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, personaBorrado) => {
    if (err) {
      return res.status(400).json({ ok: false, error: { mensaje: err } });
    };
    if (!personaBorrado) {
      return res.status(401).
        json({ ok: false, error: { mensaje: 'No existe paciente.' } });
    };
    res.json({ ok: true, personaBorrado });
  });

});

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
