//===========================
// Verifica Token
//===========================

const Usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');


const bcrypt = require('bcryptjs');



let verificaToken = (req, res, next) => {
  //let request = req;
  let token = req.get('token');
  //if (token === 'NONE') {
  //console.log('verificaTOKEN->El token es.......', token);
  //};
  //console.log('0> En VerificaToken, req -->', req.data);
  //console.log('0-> En VerificaToken, req -->', req.headers);
  //console.log('1> En VerificaToken, token -->', new Date(Date.now()), token);
  //console.log('1.1> En VerificaToken, req -->', req.get('token'));

  jwt.verify(token, process.env.SEED, (err, decode) => {
    //console.log('2>> En VerificaToken, token -->', token);
    //const hoy = new Date(Date.now());
    if (err) {
      //console.log('2.1>> En VerificaToken, token -->error:', token);
      return res.status(401).json({
        ok: false,
         mensaje: 'Token no válido. 1' 
      });
    }

    // coloca en el requerimiento HTTP
    //  el usuario de la sesión válida.
    req.usuario = decode.usuario;
    
    let id = req.usuario._id;
    ///////////////////
    Usuario.findById(id, (err, usuarioBD) => {
      if (err) {
        return res.status(401).json({
          ok: false,mensaje: 'Usuario no válido. 2' 
        });
      };
      if (!usuarioBD) {
        return res.status(401).json({
          ok: false,
           mensaje: 'Usuario no válido. 3'
        });
      };

      // Verifica que el usuario este activo.
      if (usuarioBD.situacion != 1) {
        //console.log('4.- situación NO  paso:', usuarioBD.situacion);
        return res.status(401).
          json({ ok: false, mensaje:  'Usuario no válido. 4' });
      };
      req.usuario = usuarioBD;
      next();
    });
    //////////////////
    // Si no pasa las verificaciones, ya no hace nada.
  });
};




let checkRol = (roles, usuario) => {

  // console.log('VERIFICANDO ROL (checkRol())=>');
  //console.log('Usuario.rol=> ?', usuario.rol);
  //console.log('roles=>?', roles);
  //console.log('verificaAdminRol, req.usuario.rol!="ENFERMERIA_ROL"?', req.usuario.rol != "ENFERMERIA_ROL");
  let ok = false;
  for (var i = 0; i < roles.length; i++) {
    if (usuario.rol == roles[i]) {
      ok = true;
    };
  };
  return ok;
};

let rolADE = (req, res, next) => {

  if (!checkRol(["ADMIN_ROL", "DOCTOR_ROL", "ENFERMERIA_ROL"], req.usuario)) {
    return res.status(500).json({
      ok: false,
      error: { message: 'NO tienes permitido realizar esta acción.' }
    });
  }

  next();
};
let rolAD = (req, res, next) => {

  if (!checkRol(["ADMIN_ROL", "DOCTOR_ROL"], req.usuario)) {
    return res.status(500).json({
      ok: false,
      error: { message: 'NO tienes permitido realizar esta acción.' }
    });
  }

  next();
};
let rolA = (req, res, next) => {

  if (!checkRol(["ADMIN_ROL"], req.usuario)) {
    return res.status(500).json({
      ok: false,
      error: { message: 'NO tienes permitido realizar esta acción.' }
    });
  }

  next();
};
let rolD = (req, res, next) => {

  if (!checkRol(["DOCTOR_ROL"], req.usuario)) {
    return res.status(500).json({
      ok: false,
      error: { message: 'NO tienes permitido realizar esta acción.' }
    });
  }

  next();
};
let rolE = (req, res, next) => {

  if (!checkRol(["ENFERMERIA_ROL"], req.usuario)) {
    return res.status(500).json({
      ok: false,
      error: { message: 'NO tienes permitido realizar esta acción.' }
    });
  }

  next();
};


let verificaAdminRol = (req, res, next) => {
  //const desde = req.get('desde');

  //console.log('verificaAdminRol, req.usuario.rol!="ADMIN_ROL"?', req.usuario.rol != "ADMIN_ROL");
  //console.log('verificaAdminRol, req.usuario.rol!="DOCTOR_ROL"?', req.usuario.rol != "DOCTOR_ROL");
  //console.log('verificaAdminRol, req.usuario.rol!="ENFERMERIA_ROL"?', req.usuario.rol != "ENFERMERIA_ROL");

    if (req.usuario.rol != "ADMIN_ROL") {
    return res.status(500).json({
      ok: false,
      error: { message: 'NO tienes permiso de ADMINISTRADOR.' }
    });
  }

  next();
};

let verificaOperadorRol = (req, res, next) => {


  if (req.usuario.rol != "OPERADOR_ROL") {
    return res.status(500).json({
      ok: false,
      error: { message: 'NO tienes permiso de OPERADOR.' }
    });

  }

  next();
};

let verificaDoctorRol = (req, res, next) => {


  if (req.usuario.rol != "DOCTOR_ROL") {
    return res.status(500).json({
      ok: false,
      error: { message: 'NO tienes permiso de DOCTOR.' }
    });

  }

  next();
};

let verificaEnfermeriaRol = (req, res, next) => {


  if (req.usuario.rol != "ENFERMERIA_ROL") {
    return res.status(500).json({
      ok: false,
      error: { message: 'NO tienes permiso de ENFERMERIA.' }
    });

  }

  next();
};

//////////////////////////
//// Crea el primer Usuario ADMIN del sistema, si no hay ningún usuario.
//////////////////////////

let verificaPrimerUsuarioAdmin = (req, res, next) => {

  //console.log('en primer usuario...')
  Usuario.countDocuments({ situacion: { $gt: 0 } }, (err, conteo) => {

    if (conteo == 0) {
      let usu = new Usuario();
      usu.email = 'gabox@msn.com';
      usu.password = '12345';
      usu.rol = 'ADMIN_ROL';
      usu.nombre = 'ADMIN';
      usu.titulo = '';
      usu.tituloAbr = '';
      usu.cedula = '00000';
      usu.institucion = '';
      usu.especialidad = '';
      usu.password = bcrypt.hashSync(usu.password, 10);
      console.log('antes de guardar primerusuario');
      usu.save((err, usuarioBD) => {
        if (err) {
          console.log('error al guardar primer usuario', err);
          return res.status(400).json({ ok: false, error: 'No pude crear el primer usuario ADMIN: ' + err });
        };
        console.log('se guardo OK el primer usuario', usuarioBD);

        /// aquí genera un error al tratar de respunder status(200)!!??? sin resolver pero no es crìtico 
        return res.status(200).json({ ok: true, usuario: usuarioBD, mensaje: 'Se creo el usuario ADMIN' });
      });
    };
  });
  next();
};




//let verificaToken = (req, res, next) => {
//  next();
//}
//let verificaAdminRol = (req, res, next) => {
//  next();
//}
//let verificaOperadorRol = (req, res, next) => {
//  next();
//}
//let verificaDoctorRol = (req, res, next) => {
//  next();
//}
//let verificaEnfermeriaRol = (req, res, next) => {
//  next();
//}
//let verificaPrimerUsuarioAdmin = (req, res, next) => {
//  next();
//}

module.exports = {
  verificaToken, verificaAdminRol,
  verificaOperadorRol, verificaDoctorRol,
  verificaEnfermeriaRol, verificaPrimerUsuarioAdmin,
  rolADE, rolD, rolE, rolAD
};


           //////////////////
            ///// Como llamar un api desde aquí.
            //////////////////
            //// Requiere: const http = require('http');
            //////////////////
            // let url = 'localhost'
            // let options = {
            //     host: url,
            //     port: 3000,
            //     path: '/usuario',
            //     method: 'POST',
            //     body: usu
            // };
            // http.request(options, function(res) {
            //     console.log('STATUS: ' + res.statusCode);
            //     console.log('HEADERS: ' + JSON.stringify(res.headers));
            //     res.setEncoding('utf8');
            //     res.on('data', function(chunk) {
            //         console.log('BODY: ' + chunk);
            //     });
            // }).end();
