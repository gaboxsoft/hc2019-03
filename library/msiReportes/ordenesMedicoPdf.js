//const Usuario = require('../models/usuario');

const pdf = require('pdfkit');
const pdfTools = require('../pdfkit/gxPdf');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment/locale/es');  // without this line it didn't work
moment.locale('es')

const ordenesMedicoPdf = (paciente, ordenesMedicos) => {
  const hojaCartaPort = [612, 792];
  const hojaCartaLan = [792, 612];

  var doc = new pdf({
    size: 'letter',
    layout: 'portrait',
    //size: hojaCartaPort,
    margin: 0,
    info: {
      Title: 'Ordenes Médico: msi-13 v1.0',
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

  console.log('ordenes: ', ordenesMedicos);
  //console.log('evoluciones: ',evoluciones);

  let imgFormato = path.resolve(__dirname, '../../msiformatos/msi13.jpg');

  doc.image(imgFormato, {
    fit: [anchoHoja, altoHoja]
  });
  const vacio = '';

  let pathCfg = path.join(__dirname, './ordenesMedicoFields.cfg');

  let pages = JSON.parse(fs.readFileSync(pathCfg, 'utf-8').toString().replace(/\n|\r/g, "").trim());

  //////////////
  // Registrar fuente de letra
  // Register a font
  doc.registerFont('arialnarrow', 'fonts/arial-narrow.ttf');
  
  // Colocr renglón en cero para saber que hay que imprimir los encabezados.
  doc.y = 0;

  linesByPage = 3;
  page = 0;
  col = 1.2;
  row = 6.3;
  rowIni = row;
  colIni = col;
  console.log('==============INICIANDO REPORTE ORDENES MEDICO==============================')
  //console.log(doc);
  //console.log('=============================================')
  let n = 0;
  writeOrdenesMedicos(doc, paciente, ordenesMedicos, pages, anchoHoja, altoHoja, n++, imgFormato, rowIni, colIni);

  // Stream contents to a file
  const fileName = 'MSI13-' + Date.now() + '.pdf';
  const filePath = path.join(__dirname, '../../public/pdfs/' + fileName);


  doc.pipe(fs.createWriteStream(filePath)).on('finish', function () {
    console.log('Archivo creado satisfactoriamente ....');
    //return filePath;
  });



  doc.end();
  return filePath;
  //var buffer = encoding.convert(data, "Latin_1") 
}

function writeOrdenesMedicos(doc, paciente,  ordenesMedicos, pages, anchoHoja, altoHoja, n, imgFormato, rowIni, colIni) {
  margenInf = 100;
  interlineado = 5;
  let i = 1;
  ordenesMedicos.forEach(function (ordenMedico) {
    let text = ordenMedico.ordenes + '\n' + 'Médico: ' + ordenMedico.usuarioSe.nombre + ' cédula: ' + ordenMedico.usuarioSe.cedula;
    //console.log(i,'.- ordenMedio', ordenMedico);
    opcionesParrafo = {
      align: 'justify',
      width: pdfTools.cmToPt(14.8),
      //indent: 2,
      ellipsis: true
    };
    altoParrafo = doc.heightOfString(text, opcionesParrafo);

    // Verifica si todavia alcanza el espacio restante de la hoja para imprimir
    // si no agrega una página más
    if (doc.y + altoParrafo + interlineado  > doc.page.height-margenInf) {
      let i = 1;
      while (doc.y< doc.page.height-margenInf) {
        writeLine(doc, '----------------------------------'.repeat(i++));
      };

      console.log(`${n} => agregando pág`);
      doc.addPage({
        size: 'letter',
        layout: 'portrait',
        margin: 0
      });
      doc.image(imgFormato, {
        fit: [anchoHoja, altoHoja]
      });
      doc.y = 0;
      row = rowIni;
    };

    // Si el reglón es cero debe
    // Escribir encabezados
    if (doc.y == 0) {
      pages[0].forEach(function (field) {
        //console.log('field.name:', field.name);
        writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color, field.width);
      });
    };

    writeLine(doc, moment(ordenMedico.fechaOrdenes).format('YYYY-MM-DD HH:mm'), row, col, 'left', 8, 'black');
    writeLine(doc, text, row, col + 3.0, 'justify', 8, 'black', 12.8); //14.8-ancho

    var dataImgDecodeFromBase64 = new Buffer.from(ordenMedico.firmaBase64, 'base64');
    doc.image(dataImgDecodeFromBase64, pdfTools.cmToPt(col+15 ), pdfTools.cmToPt(row ), { width: 75 })
    
    //writeLine(doc, 'Médico: '+paciente.nombreMT+' cédula: '+ paciente.cedulaMT, doc.y, col + 3.7, 'justify', 8, 'black', 14.8);
      //console.log(`${n}=>2 doc.y=`, doc.y);
      row = pdfTools.ptToCm(doc.y + interlineado);
    //console.log(`${n}=>3 row now=`, row);


    // si el próximo párrafo no cabe en la hoja.. agrega otra hoja
    //console.log(`==== FIN  ${n} =======`)
  });


}

function writeLine(doc, text, row, col, align, fontSize, color, width) {
  const vacio = '';
  //console.log('---- ');
  //console.log('in writeLine-> text: [', text, '] typeOf', typeof (text));
  //console.log('in writeLine-> align: [', align, '] typeOf', typeof (align));
  //console.log('in writeLine-> fontSize: [', fontSize, '] typeOf', typeof (fontSize));
  //console.log('in writeLine-> color: [', color, '] typeOf', typeof (color));
  //console.log('in writeLine-> row: [', row, '] typeOf', typeof (row));
  //console.log('in writeLine-> col: [', col, '] typeOf', typeof (col));
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

module.exports = ordenesMedicoPdf;



/////////////////


