//const Usuario = require('../models/usuario');

const pdf = require('pdfkit');
const pdfTools = require('../pdfkit/gxPdf');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment/locale/es');  // without this line it didn't work
moment.locale('es');


const cartaConsentPdf = (cartaConsentBD) => {
  //console.log('1.- EN CARTA CONSENT INFO->', cartaConsentBD);

  let cc = cartaConsentBD;
  //console.log('EN CARTA CONSENT INFO->', cc);
  let paciente = cc.paciente;

  const hojaCartaPort = [612, 792];
  const hojaCartaLan = [792, 612];

  var doc = new pdf({
    size: 'letter',
    layout: 'portrait',
    //size: hojaCartaPort,
    margin: 0,
    info: {
      Title: 'CARTA CONSENTIMIENTO INFORMADO: msi-01 v1.0',
      Author: 'Clínica Médica San Isidro',
    }
  });
  //doc.lineWidth(3);
  //doc.lineJoin('round')
  //  .rect(5, 5, 600, 750)
  //  .stroke();


  const anchoHoja = pdfTools.mmToPt(210.02); // ptos: 612;
  const altoHoja = pdfTools.mmToPt(297.01);  // Ptos: 792;
  const margenIzq = 10;
  const margenDer = 10;
  const maxAncho = anchoHoja - margenDer - margenIzq;
  const margenSup = 10;
  const margenInf = 10;
  const maxAlto = altoHoja - margenInf - margenSup;
  const sizePaperLetter = '210.02x297.01';
  const centroMedico = 'Médica San Isidro';


  let imgFormato = path.resolve(__dirname, '../../msiformatos/msi01.jpg');

  doc.image(imgFormato, {
    fit: [anchoHoja, altoHoja]
  });
  const vacio = '';

  let pathCfg = path.join(__dirname, './cartaConsentFields.cfg');

  let pages = JSON.parse(fs.readFileSync(pathCfg, 'utf-8').toString().replace(/\n|\r/g, "").trim());

  doc.registerFont('arialnarrow', 'fonts/arial-narrow.ttf');

  //pages.forEach(function (field) {
  //  console.log('\r\n sfield->', field.name);
  //  writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color);
  //});


  pages[0].forEach(function (field) {
    console.log('field-->', field, 'type->', field.type);

    let domicilio = (cc.calle ? cc.calle + ' ' + (cc.numExterior || '') + ' ' + (cc.numInterior || '') + ', ' : '') +
      (cc.colonia ? cc.colonia + ',' : '') + (cc.municipio ? cc.municipio + ' ' : '') +
      (cc.entidad ? cc.entidad + ' ' : '') + (cc.CP ? ' CP' + cc.CP : '');

    writeLine(doc, eval(field.name), field.row, field.col, field.align, field.indent, field.fontSize, field.color, field.width, field.type);
  });

  /// Agrega otra hoja

  //doc.addPage({
  //  size: 'letter',
  //  layout: 'portrait',
  //  margin: 0
  //});

  //imgFormato = path.resolve(__dirname, '../../msiformatos/msi02-2.jpg');

  //doc.image(imgFormato, {
  //  fit: [anchoHoja, altoHoja]
  //});
  //pages[1].forEach(function (field) {
  //  console.log(' hoja 2 field-->', field, 'type->', field.type);
  //  writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color, field.width, field.type);
  //});





  // Stream contents to a file
  const fileName = 'MSI02-' + Date.now() + '.pdf';
  const filePath = path.join(__dirname, '../../public/pdfs/' + fileName);


  doc.pipe(fs.createWriteStream(filePath)).on('finish', function () {
    console.log('Archivo creado satisfactoriamente ....');
    //return filePath;
  });



  doc.end();
  return filePath;
  //var buffer = encoding.convert(data, "Latin_1") 
}



function writeLine(doc, text, row, col, align, indent, fontSize, color, width, type) {
  const vacio = '';
  //console.log('---- ');
  //console.log('in writeLine-> text: [', text, '] typeOf', typeof (text));
  //console.log('in writeLine-> align: [', align, '] typeOf', typeof (align));
  //console.log('in writeLine-> fontSize: [', fontSize, '] typeOf', typeof (fontSize));
  //console.log('in writeLine-> color: [', color, '] typeOf', typeof (color));
  //console.log('in writeLine-> row: [', row, '] typeOf', typeof (row));
  //console.log('in writeLine-> col: [', col, '] typeOf', typeof (col));


  // Es una imagen base64
  console.log('ES IMAGEN-->?', type);
  if (type == 'img') {
    if (text) {
      var dataImgDecodeFromBase64 = new Buffer.from(text, 'base64');
      doc.image(dataImgDecodeFromBase64, pdfTools.cmToPt(col), pdfTools.cmToPt(row), { width: width });
    };
    return;
  };

  // Es un texto normal
  if (!col || !row) {
    doc.moveDown()
      .fillColor(color || 'black')
      .fontSize(fontSize || 10)
      .text(text || vacio, {
        align: align || 'left',
        width: pdfTools.cmToPt(width),
        indent: (pdfTools.cmToPt(indent) || 0),
        ellipsis: true
      });
  }
  else {
    doc.moveDown()
      .fillColor(color || 'black')
      .fontSize(fontSize || 10)
      .text(text || vacio, pdfTools.cmToPt(col || 1), pdfTools.cmToPt(row || 1), {
        align: align || 'left',
        width: pdfTools.cmToPt(width),
        indent: (pdfTools.cmToPt(indent) || 0),
        ellipsis: true
      });
  };
}

////function writeLine(doc, text, row, col, align, fontSize, color) {
////  const vacio = '';
////  //console.log('---- ');
////  //console.log('in writeLine-> text: [', text, '] typeOf', typeof (text));
////  //console.log('in writeLine-> align: [', align, '] typeOf', typeof (align));
////  //console.log('in writeLine-> fontSize: [', fontSize, '] typeOf', typeof (fontSize));
////  //console.log('in writeLine-> color: [', color, '] typeOf', typeof (color));
////  //console.log('in writeLine-> row: [', row, '] typeOf', typeof (row));
////  //console.log('in writeLine-> col: [', col, '] typeOf', typeof (col));
////doc.moveDown()
////  .fillColor(color||'black')
////  .fontSize(fontSize||10)
////  .text(text||vacio, pdfTools.cmToPt(col||1), pdfTools.cmToPt(row||1), {
////    align: align||'left',
////    //indent: 2,
////    ellipsis: true
////  });
////}

module.exports = cartaConsentPdf;
