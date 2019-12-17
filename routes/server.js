
const express = require('express');
const app = express();

const moment = require('moment');

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');

app.get('/fechaHora', verificaToken, function(req, res) {

  const fechaHora = moment().format('YYYY-MM-DDTHH:mm:ss');
  console.log('fechaHora en Server:', fechaHora);
  return res.json({ ok: true, fechaHora  });
  
});



module.exports = app;
