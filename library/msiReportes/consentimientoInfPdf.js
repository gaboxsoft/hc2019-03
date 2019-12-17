//const Usuario = require('../models/usuario');

const pdf = require('pdfkit');
const pdfTools = require('../pdfkit/gxPdf');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment/locale/es');  // without this line it didn't work
moment.locale('es')
const consentimientoInfPdf = (consentimientoInformadoBD) => {
  console.log('1.- EN CONSENT INFO->', consentimientoInformadoBD);

  let ci = consentimientoInformadoBD;
  //console.log('EN CONSENT INFO->',ci);
  let paciente = ci.paciente;

  const hojaCartaPort = [612, 792];
  const hojaCartaLan = [792, 612];

  var doc = new pdf({
    size: 'letter',
    layout: 'portrait',
    //size: hojaCartaPort,
    margin: 0,
    info: {
      Title: 'CONSENTIMIENTO INFORMADO: msi-00 v1.0',
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


  let imgFormato = path.resolve(__dirname, '../../msiformatos/msi02-1.jpg');

  doc.image(imgFormato, {
    fit: [anchoHoja, altoHoja]
  });
  const vacio = '';

  let pathCfg = path.join(__dirname, './consentimientoInfFields.cfg');

  let pages = JSON.parse(fs.readFileSync(pathCfg, 'utf-8').toString().replace(/\n|\r/g, "").trim());


  //pages.forEach(function (field) {
  //  console.log('\r\n sfield->', field.name);
  //  writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color);
  //});


  pages[0].forEach(function (field) {
    console.log('field-->', field, 'type->', field.type);
    writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color, field.width, field.type);
  });

  /// Agrega otra hoja

  doc.addPage({
    size: 'letter',
    layout: 'portrait',
    margin: 0
  });

  imgFormato = path.resolve(__dirname, '../../msiformatos/msi02-2.jpg');

  doc.image(imgFormato, {
    fit: [anchoHoja, altoHoja]
  });
  pages[1].forEach(function (field) {
    console.log(' hoja 2 field-->', field, 'type->', field.type);
    writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color, field.width, field.type);
  });

  ////if (ci.firmaBase64Paciente) {

  ////  var dataImgDecodeFromBase64 = new Buffer.from(ci.firmaBase64Paciente , 'base64');
  ////  doc.image(dataImgDecodeFromBase64,  pdfTools.cmToPt(1), pdfTools.cmToPt(20), { width: 200 })
  ////}
  ////if (ci.firmaBase64Testigo1) {

  ////  var dataImgDecodeFromBase64 = new Buffer.from(ci.firmaBase64Testigo1, 'base64');
  ////  doc.image(dataImgDecodeFromBase64,  pdfTools.cmToPt(1), pdfTools.cmToPt(25), { width: 100 })
  ////}
  ////if (ci.firmaBase64Testigo2) {

  ////  var dataImgDecodeFromBase64 = new Buffer.from(ci.firmaBase64Testigo2, 'base64');
  ////  doc.image(dataImgDecodeFromBase64, 1, doc.y + 20, { width: 100 })
  ////}
  //doc.image(dataImgDecodeFromBase64, pdfTools.cmToPt(col + 15), pdfTools.cmToPt(row), { width: 75 })




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



function writeLine(doc, text, row, col, align, fontSize, color, width, type) {
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
        //indent: 2,
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
        //indent: 2,
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

module.exports = consentimientoInfPdf;
