const express = require('express');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const util = require('util')
const path = require('path');

const app = express();

const Usuario = require('../models/usuario');
const OtrosFormatos = require('../models/otrosFormatos');

let { verificaToken, verificaAdminRol, rolADE } = require('../middleware/autenticacion');



app.get('/otrosFormatos/:id', [verificaToken, rolADE], function (req, res) {

  const id = req.params.id; // Id del paciente
  
  OtrosFormatos.findOne({ paciente: id }, (err, otrosFormatosBD) => {
    if (err) {
      return res.status(400).
        json({ ok: false, error: err, mensaje: 'hubo en error' });
    };

    if (!otrosFormatosBD) {
      return res.status(401).json({ ok: false, mensaje: 'No existe este prog. Quirurgica' });
    }

    return res.json({ ok: true, otrosFormatos: otrosFormatosBD });

  })
    .populate('paciente');

});

{
  //app.post('/OtrosFormatos/:id', [verificaToken, rolADE], function (req, res) {


  //  const id = req.params.id; // Id del paciente

  //  let body = req.body;



  //  //console.log('2.- POST body= ', body);

  //  // Busca paciente
  //  Paciente.findById(id, (err, pacienteBD) => {
  //    if (err) {
  //      return res.status(400).json({ ok: false, error: err });

  //    };
  //    if (!pacienteBD) {
  //      return res.status(401).json({ ok: false, error: 'NO ENCONTRÉ AL PACIENTE' });
  //    };

  //    let otrosFormatos = new OtrosFormatos({

  //      paciente: id,
  //      msi21: body.msi21,
  //      msi21FechaSubido: body.msi21FechaSubido,
  //      msi30: body.msi30,
  //      msi30FechaSubido: body.msi30FechaSubido,
  //      msi31: body.msi31,
  //      msi31FechaSubido: body.msi31FechaSubido,
  //      msi32: body.msi32,
  //      msi32FechaSubido: body.msi32FechaSubido,
  //      msi33: body.msi33,
  //      msi33FechaSubido: body.msi33FechaSubido,
  //      msi40: body.msi40,
  //      msi40FechaSubido: body.msi40FechaSubido,
  //      msi41: body.msi41,
  //      msi41FechaSubido: body.msi41FechaSubido,

  //      /////////////////////////
  //      //Sello
  //      fechaCreacionSe: new Date(),
  //      fechaModificacionSe: new Date(),
  //      situacionSe: 1, //1-activo
  //      //fechaBorrado: default nada
  //      usuarioSe: req.usuario._id
  //    });

  //    otrosFormatos.save((err, otrosFormatosBD) => {
  //      if (err) {
  //        return res.status(400).json({ ok: false, error: err, body: otrosFormatos });
  //      };
  //      return res.status(200).json({ ok: true, otrosFormatos: otrosFormatosBD });
  //    });
  //  });

  //});

  //app.put('/OtrosFormatos/:id', [verificaToken, rolADE], function (req, res) {
  //  const id = req.params.id; // Id del paciente

  //  let body = req.body;

  //  body.usuario = req.usuario._id;
  //  body.fechaModificacion = Date.now();
  //  //console.log('========== PUT ========');
  //  //console.log('3.- PUT = ', body);
  //  //console.log('=======================');
  //  //console.log('3.1.- PUT = ', req.body);

  //  //Paciente.findByIdAndUpdate(id, { diagnosticoEgreso: body.diagnosticoEgreso }, (err, pacienteBD) => {
  //  Paciente.findById(id, (err, pacienteBD) => {
  //    if (err) {
  //      return res.status(400).json({ ok: false, error: err });

  //    };
  //    if (!pacienteBD) {
  //      return res.status(401).json({ ok: false, error: 'NO ENCONTRÉ AL PACIENTE' });
  //    };



  //    OtrosFormatos.findOneAndUpdate({ paciente: id, 'situacionSe': { $eq: 1 } }, body, { new: true, runValidators: true, context: 'query' }, (err, otrosFormatosBD) => {
  //      if (err) {
  //        return res.status(400).
  //          json({ ok: false, error: { mensaje: err } });
  //      }
  //      if (!otrosFormatosBD) {
  //        return res.status(401).
  //          json({ ok: false, error: { mensaje: 'No existen otros formatos.' } });
  //      }
  //      return res.json({ ok: true, otrosFormatos: otrosFormatosBD });
  //    }).populate('paciente');
  //  });

  //});

}




app.put('/otrosFormatos/:formato/:id', verificaToken, function (req, res) {
  // id: es paciente
  // formato: es ['msi21','msi30','msi31','msi31','msi32','msi33','msi40','msi41','']
  const formato = req.params.formato;
  const id = req.params.id;

  console.log('formato: ', formato, ' id: ', id);
  console.log('xfiles: ', req.files);
  

  //console.log(util.inspect(myObject, { showHidden: false, depth: null }))

  // alternative shortcut
  //console.log(util.inspect(myObject, false, null, true /* enable colors */))
  fs.writeFile('req.json', util.inspect(req, false, null, true /* enable colors */), function (err) {
    if (err) {
      console.log('error: no pude escribir imagen ->', err);
    };
  });
  // Tipos permitidas
  const formatosValidos = ['msi21', 'msi30', 'msi31', 'msi31', 'msi32', 'msi33', 'msi40', 'msi41'];
  if (formatosValidos.indexOf(formato) < 0) {
    return res.status(400).json({ ok: false, mensaje: 'Los formatos válidos son: ' + formatosValidos.join(', ') });
  }
  if (!req.files) {
    return res.status(401).json({ ok: false, mensaje: 'No se especificó el archivo a subir.' })
  }


  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  
  //const file = req.files.archivo;
  const file = req.files[0];
  const fileNameArray = file.name.toLowerCase().split('.');
  const fileExt = fileNameArray[fileNameArray.length - 1];

  // Extensiones de archivo permitidas
  const extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];
  if (extensionesValidas.indexOf(fileExt) < 0) {
    return res.status(401).json({ ok: false, mensaje: 'La extensiones válidas son ' + extensionesValidas.join(', ') });
  }

  // if (fs.exists(`uploads/${tipo}/${file.name}`)) {

  // }
  //file.name = `${formato}-${id}-${new Date().getMilliseconds()}.${fileExt}`;
  file.name = `${formato}-${id}.${fileExt}`;
  let path = `../uploads/${file.name}`;

  // si existe borra el archivo
  borraArchivo(file.name);

  // Use the mv() method to place the file somewhere on your server
  file.mv(path, function (err) {
    if (err) {
      return res.status(500).json({ ok: true, mensaje: err });
    };

    // Aquí ya sé que la imagen se subió
    guardarImagenEnOtrosFormatos(id, formato, file.name);
  });
});

function guardarImagenUsuario(res, id, nombreArchivo) {
  const tipo = "usuarios";
  // const tipoImagen = tipo === 'usuario' ? Usuario : Producto;
  Usuario.findById(id, (err, usuarioBD) => {
    if (err) {
      borraArchivoSubido(tipo, nombreArchivo);
      return res.status(500).json({ ok: false, mensaje: err });
    };
    if (!usuarioBD) {
      borraArchivoSubido(tipo, nombreArchivo);
      return res.status(400).json({ ok: false, mensaje: 'El usuario no existe' });
    };
    // Verifica que el nombre del archivo almacenado en Usuario.img no exista y si existe hay que borrárla
    borraArchivoSubido(tipo, usuarioBD.img)

    usuarioBD.img = nombreArchivo;
    usuarioBD.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(500).json({ ok: false, mensaje: err });
      };
      return res.status(200).json({ ok: true, mensaje: 'Imagen guardada en: ' + usuarioGuardado.nombre });
    });

  })
}

function guardarImagenEnOtrosFormatos(id, formato, nombreArchivo) {

  // const tipoImagen = tipo === 'usuario' ? Usuario : Producto;
  OtrosFormatos.findById({ paciente: id }, (err, otroFormatoBD) => {
    if (err) {
      borraArchivo(nombreArchivo);
      return res.status(500).json({ ok: false, mensaje: err });
    };
    if (!otroFormatoBD) {
      borraArchivo(nombreArchivo);
      return res.status(400).json({ ok: false, mensaje: 'otros formatos no existe' });
    };

    let imgeInBase64 = getImgBase64FromFile(nombreArchivo);
    formato = formato.toLowerCase();

    switch (formato) {
      case 'msi21':
        otroFormatoBD.msi21 = imgeInBase64;
        otroFormatoBD.msi21FechaSubido = Date.now();
        break;
      case 'msi30':
        otroFormatoBD.msi30 = imgeInBase64;
        otroFormatoBD.msi30FechaSubido = Date.now();
        break;
      case 'msi31':
        otroFormatoBD.msi31 = imgeInBase64;
        otroFormatoBD.msi31FechaSubido = Date.now();
        break;
      case 'msi32':
        otroFormatoBD.msi32 = imgeInBase64;
        otroFormatoBD.msi32FechaSubido = Date.now();
        break;
      case 'msi33':
        otroFormatoBD.msi33 = imgeInBase64;
        otroFormatoBD.msi33FechaSubido = Date.now();
        break;
      case 'msi40':
        otroFormatoBD.msi40 = imgeInBase64;
        otroFormatoBD.msi40FechaSubido = Date.now();
        break;
      case 'msi41':
        otroFormatoBD.msi41 = imgeInBase64;
        otroFormatoBD.msi41FechaSubido = Date.now();
        break;
      default:
      // code block
    };
    //borraArchivo(nombreArchivo);

    otroFormatoBD.save((err, otroFormatoGuardado) => {
      if (err) {
        return res.status(500).json({ ok: false, mensaje: err });
      };
      return res.status(200).json({ ok: true, mensaje: 'Imagen guardada en: ' });
    });

  })
}

function getImgBase64FromFile(imgFile) {
  fs.readFile(imgFile, function (err, dataFromImgFile) {
    if (err) {
      return null;
    };
    if (!dataFromImgFile) {
      return null;
    };
    return dataFromImgFile.toString('base64');
  });
}

function guardarImagenProducto(res, id, nombreArchivo) {
  const tipo = "productos";
  // const tipoImagen = tipo === 'usuario' ? Usuario : Producto;
  Producto.findById(id, (err, otroFormatoBD) => {
    if (err) {
      borraArchivoSubido(tipo, nombreArchivo);
      return res.status(500).json({ ok: false, mensaje: err });
    };
    if (!otroFormatoBD) {
      borraArchivoSubido(tipo, nombreArchivo);
      return res.status(400).json({ ok: false, mensaje: 'El producto no existe' });
    };
    // Verifica que el nombre del archivo almacenado en Usuario.img no exista y si existe hay que borrárla
    borraArchivoSubido(tipo, otroFormatoBD.img)

    otroFormatoBD.img = nombreArchivo;
    otroFormatoBD.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({ ok: false, mensaje: err });
      };
      return res.status(200).json({ ok: true, mensaje: 'Imagen guardada en: ' + productoGuardado.nombre });
    });

  })
}

function borraArchivo(nombreArchivo) {
  archivoSubido = path.resolve(__dirname, `../uploads/${nombreArchivo}`);
  if (fs.existsSync(archivoSubido)) {
    fs.unlinkSync(archivoSubido);
  };
}


module.exports = app;
