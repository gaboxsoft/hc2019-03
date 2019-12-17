const express = require('express');

const app = express();


app.use(require('./login'));
app.use(require('./usuario'));
app.use(require('./server'));
app.use(require('./paciente'));
app.use(require('./reportes'));
app.use(require('./hojaInicialExpediente'));
app.use(require('./historiaClinica'));
app.use(require('./notaUrgencias'));
app.use(require('./evolucion'));
app.use(require('./receta'));
app.use(require('./ordenesMedico'));
app.use(require('./contratoServicios'));
app.use(require('./consentimientoInformado'));
app.use(require('./cartaConsent'));
app.use(require('./altoRiesgo'));
app.use(require('./altaVoluntaria'));
app.use(require('./responsivaRN'));
app.use(require('./progQuirurgica'));
app.use(require('./otrosFormatos'));



module.exports = app;
