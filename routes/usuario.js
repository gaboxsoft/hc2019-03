const Usuario = require('../models/usuario');

const express = require('express');
const app = express();

const bcrypt = require('bcryptjs');
const _ = require('underscore');



let { verificaToken, verificaAdminRol, rolD, rolA, rolAD } = require('../middleware/autenticacion');

app.get('/listausuarios', function (req, res) {

  //return res.json({ ok: true, usuarios: {}, mensaje: 'hola desde node Lista Usuarios' });

  let limite = Number(req.query.limite || 0);
  let desde = Number(req.query.desde || 0);

  Usuario.find({ situacion: { $gt: 0 } }) // Mayor que cero no esta borrado
    .limit(limite)
    .skip(desde)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: err });
      };
      Usuario.countDocuments({ situacion: { $gt: 0 } }, (err, conteo) => {
        if (err) {
          return res.status(400).
            json({ ok: false, error: err });
        }
        res.json({ ok: true, conteo: conteo, usuarios });
      });
    });
});



//app.get('/Medicos', [verificaToken, rolD, verificaAdminRol], function (req, res) {
  app.get('/Medicos', [verificaToken, rolAD], function (req, res) {

  //res.json({ ok: true, mensaje: 'hola desde node Lista Usuarios' });
  //let limite = Number(req.query.limite || 0);
  //let desde = Number(req.query.desde || 0);

  console.log('API GET Medicos');

  Usuario.find({ situacion: { $gt: 0 }, rol: 'DOCTOR_ROL' }) // Mayor que cero no esta borrado
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: err });
      };
      Usuario.countDocuments({ situacion: { $gt: 0 } }, (err, conteo) => {
        if (err) {
          return res.status(400).
            json({ ok: false, error: err });
        }

        return res.status(200).json({ ok: true, conteo: conteo, medicos: usuarios });
      });
    });
});






app.get('/usuarios', verificaToken, function (req, res) {

  //console.log('route/usuario/usuarios')

  let limite = Number(req.query.limite || 0);
  let desde = Number(req.query.desde || 0);

  Usuario.find({ situacion: { $gt: 0 } }) // Mayor que cero no esta borrado
    .limit(limite)
    .skip(desde)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).
          json({ ok: false, error: err });
      };
      Usuario.countDocuments({ situacion: { $gt: 0 } }, (err, conteo) => {
        if (err) {
          return res.status(400).
            json({ ok: false, error: err });
        }
        res.json({ ok: true, conteo: conteo, usuarios });
      });
    });
});


app.get('/usuario/:id', verificaToken, function (req, res) {
//app.get('/usuario/:id',  function (req, res) {

  let id = req.params.id;
  //console.log('1.-en route/GET/usuario/' + id);

  Usuario.findOne({ _id: id, situacion: 1 }, (err, usuarioBD) => {
    if (err) {
      //console.log('2.- error: ', err)
      return res.status(400).json({ ok: false, error: err.message });
    } else {
      //console.log('2.- no hay error');
    };
    if (!usuarioBD) {
      //console.log('3.- no hay usuarioBD ')
      return res.status(401).json({ ok: false, error: `No existe usuario. (GET/usuario/:id).` });
    } else {
      //console.log('3.- encontré usuarioBD:', usuarioBD);
      //console.log('4.- usuarioBD: ', usuarioBD)
      return res.json({ ok: true, usuario: usuarioBD });
    };
  });
  //console.log('5.- usuarioBD: ', usuarioBD)
});


app.post('/usuario',
  [verificaToken, verificaAdminRol],
  function (req, res) {


    let body = req.body;

    let usuario = new Usuario();
    usuario.email = body.email;
    usuario.password = body.password;
    usuario.rol = body.rol;
    usuario.nombre = body.nombre;
    usuario.cedula = body.cedula;
    usuario.titulo = body.titulo;
    usuario.titutloAbr = body.titutloAbr;
    usuario.institucion = body.institucion;
    usuario.especialidad = body.especialidad;
    usuario.password = bcrypt.hashSync(body.password, 10);
    usuario.usuario = req.usuario._id;

    //console.log('ADD Usuario:body ', body);
    //console.log('ADD Usuario:usuario ', usuario);
    usuario.save((err, usuarioBD) => {
      if (err) {
        res.status(400).json({ ok: false, error: err });
      } else {
        res.status(200).json({ ok: true, usuario: usuarioBD });
      }
    });

  });

app.put('/usuario/:id', [verificaToken, verificaAdminRol], function (req, res) {


  //let body = _.pick(req.body, [
  //  'email', 'rol', 'nombres', 'paterno', 'materno',
  //  'cedula', 'institucion', 'especialidad',
  //  'titulo', 'titutloAbr'
  //]);
  let body = req.body;
  //console.log('\r\n======>>>> req.body.password=', body.password);
  if (body.password) {
    body.password = bcrypt.hashSync(body.password, 10);
    //console.log('\r\n======>>>> req.body.password=', body.password);
  }
  let id = req.params.id;
  body.fechaModificacion = Date.now();
  //console.log('body en route-PUT:', body, '-->id:', id)
  // La línea abajo se modifió para que
  // los campos Unique pasen la validación cuando
  // estos no hayan sido modificados
  // mas claro: se quito el filtro situacion: { $eq: 1 } 
  //Usuario.findOneAndUpdate({ _id: id, situacion: { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
  Usuario.findOneAndUpdate({ _id: id, situacion: 1 }, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
    console.log('Hice la búsqueda... pero:')
    if (err) {
      //console.log('Hubo error:', err.message)
      return res.status(400).
        json({ ok: false, error: err.message });
    }
    if (!usuarioBD) {
      //console.log('no lo encontré:', usuarioBD)
      return res.status(401).
        json({ ok: false, error: `No existe usuario. (PUT/usuario/:id)` });;
    };
    //console.log('si lo actualizé:', usuarioBD)
    return res.json({ ok: true, usuario: usuarioBD });
  });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], function (req, res) {

  let id = req.params.id;

  let modificarEstado = { situacion: 0, fechaBorrado: Date.now() }; // Borrado

  Usuario.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({ ok: false, error: err });
    }
    res.json({ ok: true, usuario: usuarioBorrado });
  });

});


module.exports = app;
