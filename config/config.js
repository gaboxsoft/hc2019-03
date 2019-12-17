/*
 * Configuraciones Públicas Globales
 */


///////////////////
// Servidor Host

/*
process.env.HOST = process.env.HOST || 'http://localhost'//'http://127.0.0.1'

// puerto default del servidor
process.env.PORT = process.env.PORT || 3000;


//////////
// Entorno de ejecución
//////////

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/// Determina la base de datos de prueba o producción
if (process.env.NODE_ENV === 'development') {
    process.env.URLDB = 'mongodb://localhost:27017/medica';
  process.env.HOST = 'kloudbrokers.southcentralus.cloudapp.azure.com';//'http://localhost';//'http://127.0.0.1';
} else {
  process.env.HOST = 'https://hc2019.herokuapp.com';
  process.env.URLDB = process.env.MONGO_URI;
  process.env.URLDB = 'mongodb://gabox:Gabox123@ds054288.mlab.com:54288/cafe';
  process.env.URLDB = 'mongodb://<dbuser>:<dbpassword>@ds030829.mlab.com:30829/medica';
}                       
*/

// Determina el HostPort
process.env.URL_SERVER = process.env.HOST + ':' + process.env.PORT;


// seed
process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";


// caducidad seed
process.env.CADUCIDAD = process.env.CADUCIDAD || 1000 * 60 * 60 * 24 * 30; //1000 milisegundos*60segs*60mins*24horas*30dias
//process.env.CADUCIDAD = process.env.CADUCIDAD || 1000 * 5; //1000 milisegundos=1seg => 1hra = 1000*60segs*60mins

/*
// Client_Id de google
process.env.CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'none';


/////////////////////////
//// Agrega las variables de sesion
require('./sesionApp');
*/
