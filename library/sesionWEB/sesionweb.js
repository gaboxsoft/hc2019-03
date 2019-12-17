//////////////////////
//// Guarda, recuperay limpia los datos de la sesion WEB
//// Mantiene los estados de cada petición al servidor.
//////////////////////

let sesionWeb = {};

sesionWeb.usuarioVacio = { nombres: '', paterno: '', materno: '', email: '', password: '' };
//sesionWeb.token = '';
//sesionWeb.usuarioLogin = sesionWeb.usuarioVacio;

//sesionWeb.logout = () => {
//  this.token = '';
//  this.userLogin = sesionWeb.userVacio;
//  sessionStorage.setItem('token', '');
//  sessionStorage.setItem('usuario', sesionWeb.usuarioVacio);
//};


sesionWeb.load = (sessionStorage) => {
  let a = sessionStorage.getItem('token');
  console.log('getItem(token)=', sessionStorage.getItem('token'));
  sesionWeb.token = sessionStorage.getItem('token') || '';
  sesionWeb.userLogin = sessionStorage['usuarioLogin'] || sesionWeb.usuarioVacio;
  };

//sesionWeb.save = () => {
//  sessionStorage['token'] = sesionWeb.token||'';
//  sessionStorage['usuarioLogin'] = sesionWeb.usuarioLogin||sesionWeb.usuarioVacio;
//  };

//sesionWeb.clear = () => {
//  sessionStorage['token'] = '';
//  sessionStorage['usuarioLogin'] = sesionWeb.usuarioVacio;
//};


module.exports = sesionWeb;
