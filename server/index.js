// Habilita las variables de entorno
require('dotenv').config();

// Configura variables de entorno
require('../config/config.js');

const fs = require('fs');

console.log('/////////////////////////////////////////////');
console.log('>> process.env.HOST=', process.env.HOST);
console.log('>> process.env.PORT=', process.env.PORT);
console.log('>> process.env.NODE_ENV =', process.env.NODE_ENV);
console.log('>> process.env.MONGO_URI = ', process.env.MONGO_URI);
console.log('>> process.env.URLDB = ', process.env.URLDB);
console.log('>> process.env.URL_SERVER = ', process.env.URL_SERVER);
console.log('/////////////////////////////////////////////');

// Habilita https
var https = require('https')

// Habilita express-fileUpload
const fileUpload = require('express-fileupload');

//const cors = require('cors');

// Habilita servidor 
const express = require('express')
const app = express()

// Habilita express-fileUpload with defaults
app.use(fileUpload())

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});



const { Nuxt, Builder } = require('nuxt')

const consola = require('consola')

const mongoose = require('mongoose');

const path = require('path');

const bodyParser = require('body-parser');


// FIX- Payload Too Large ERROR: limite de transferencia en body

//app.use(bodyParser.json({ limit: '1000mb', extended: true }))
//app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '500mb' , extended: true }));
// parse application/json
app.use(bodyParser.json({ limit: '500mb' }));


//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


// Define el puerto default para escuhcar peticiones de express
app.set('port', process.env.PORT);



// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

///////////////////////////////

// Implementa CORS
//
////const cors = require('cors')
////app.use(cors());


//////app.use(function(req, res, next){
//////  res.setHeader("Access-control-Allow-Origin", "http://kloudbrokers.southcentralus.cloudapp.azure.com");
//////  res.setHeader("Access-control-Allow-Headers", "Content-Type");
//////  res.setHeader("Access-control-Allow-Methods", 
//////  "GET, PUT, POST, DELETE, OPTIONS");
//////  next();
//////});



// Crea servidor https
https.createServer({
  key: fs.readFileSync('hc.key'),
  cert: fs.readFileSync('hc.cert')
}, app).listen(process.env.PORT, () => {
  console.log(`Nodejs ${process.env.NODE_ENV} Atendiendo peticiones  en el puerto ${process.env.PORT}`);
})

// Carga las rutas api
app.use(require('../routes/index'));

// Configura Nuxt
setupNuxt();

//// Arranca el servidor Express HTTP
//app.listen(process.env.PORT, () => {
//  console.log(`Nodejs ${process.env.NODE_ENV} Atendiendo peticiones  en el puerto ${process.env.PORT}`);
//})


////// Force for secure request
////app.use(function (req, res, next) {
////  if (req.secure) {
////    next();
////  } else {
////    res.redirect('https://' + req.headers.host + req.url);
////  }
////});

// Arranca elservidor MongoDB
console.log('HOST--------------> ' + process.env.URLDB);

mongoose.connect(process.env.URLDB, (err, resp) => {
  if (err) {
    return console.log('Hubo error al coenctar con MongoDB: ', err);
  };
  console.log(`Base de datos en la URL ${process.env.URLDB} esta ONLINE.`);
});

///////////////////////////////

// Configura el servidor nuxt para estar listo para arrancarlo.
async function setupNuxt() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // // // Listen the server
  // // app.listen(port, host)
  // // consola.ready({
  // //   message: `Server listening on http://${host}:${port}`,
  // //   badge: true
  // // })
}
