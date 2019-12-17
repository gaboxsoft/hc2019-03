//const Usuario = require('../models/usuario');

const pdf = require('pdfkit');
const pdfTools = require('../pdfkit/gxPdf');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment/locale/es');  // without this line it didn't work
moment.locale('es')

const historiaClinicaPdf = (paciente) => {
  const hojaCartaPort = [612, 792];
  const hojaCartaLan = [792, 612];

  var doc = new pdf({
    size: 'letter',
    layout: 'portrait',
    //size: hojaCartaPort,
    margin: 0,
    info: {
      Title: 'Historia Clínica: msi-11 v1.0',
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
  //
  //console.log('paciente: ', paciente);

  let imgFormato = path.resolve(__dirname, '../../msiformatos/msi11-1.jpg');

  doc.image(imgFormato, {
    fit: [anchoHoja, altoHoja]
  });
  const vacio = '';

  let pathCfg = path.join(__dirname, './historiaClinicaFields.cfg');
  
  let pages = JSON.parse(fs.readFileSync(pathCfg, 'utf-8').toString().replace(/\n|\r/g, "").trim());

  //fields.forEach(function (field) {
  //  console.log('\r\n sfield->', field.name);
  //  writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color);
  //});
    pages[0].forEach(function (field) {
      writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color, field.width);
    });
  if (paciente.firmaBase64HC) {
    var dataImgDecodeFromBase64 = new Buffer.from(paciente.firmaBase64HC, 'base64');
    doc.image(dataImgDecodeFromBase64, 275, doc.y + 20, { width: 300 })
  }

  doc.addPage({size: 'letter',
    layout: 'portrait',
    margin: 0
  });
  imgFormato = path.resolve(__dirname, '../../msiformatos/msi11-2.jpg');

  doc.image(imgFormato, {
    fit: [anchoHoja, altoHoja]
  });
  
  pages[1].forEach(function (field) {
    writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color, field.width);
  });


  if (paciente.firmaBase64HC) {
    var dataImgDecodeFromBase64 = new Buffer.from(paciente.firmaBase64HC, 'base64');
    doc.image(dataImgDecodeFromBase64, 275, doc.y + 20, { width: 300 })
  }

  
  // Stream contents to a file
  const fileName = 'MSI11-' + Date.now() + '.pdf';
  const filePath = path.join(__dirname, '../../public/pdfs/' + fileName);
 

  doc.pipe(fs.createWriteStream(filePath)).on('finish', function () {
    console.log('Archivo creado satisfactoriamente ....');
    //return filePath;
  });



  doc.end();
  return filePath;
  //var buffer = encoding.convert(data, "Latin_1") 
}


function writeLine(doc, text, row, col, align, fontSize, color, width) {
  const vacio = '';
  //console.log('in writeLine-> text: [', text, '] typeOf', typeof (text));
  //console.log('in writeLine-> align: [', align, '] typeOf', typeof (align));
  //console.log('in writeLine-> fontSize: [', fontSize, '] typeOf', typeof (fontSize));
  //console.log('in writeLine-> color: [', color, '] typeOf', typeof (color));
  //console.log('in writeLine-> row: [', row, '] typeOf', typeof (row));
  //console.log('in writeLine-> col: [', col, '] typeOf', typeof (col));
doc.moveDown()
  .fillColor(color||'black')
  .fontSize(fontSize || 10)  
  .text(text||vacio, pdfTools.cmToPt(col||1), pdfTools.cmToPt(row||1), {
    align: align||'left',
    width: pdfTools.cmToPt(width),
    //indent: 2,
    ellipsis: true
  });
}

module.exports = historiaClinicaPdf;
