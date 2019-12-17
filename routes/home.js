const Usuario = require('../models/usuario');

const express = require('express');
const app = express();
const path = require('path');




//app.get('/', function(req, res) {
//    const view = path.resolve(__dirname, '../views/login.html');
//    console.log('en home', __dirname, '../views/login.html', view);
//    return res.status(200).sendFile(view);
//    // res.json({ ok: true, mensaje: 'en home' });
//});


module.exports = app;
