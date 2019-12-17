//const Usuario = require('../models/usuario');

const pdf = require('pdfkit');
const pdfTools = require('../pdfkit/gxPdf');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment/locale/es');  // without this line it didn't work
moment.locale('es')

const hojaEvolucionPdf = (paciente, evoluciones, notaUrgencias) => {
  const hojaCartaPort = [612, 792];
  const hojaCartaLan = [792, 612];

  var doc = new pdf({
    size: 'letter',
    layout: 'portrait',
    //size: hojaCartaPort,
    margin: 0,
    info: {
      Title: 'Hoja de Evolución: msi-14 v1.0',
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

  console.log('paciente: ', paciente);
  //console.log('evoluciones: ',evoluciones);

  let imgFormato = path.resolve(__dirname, '../../msiformatos/msi14.jpg');

  doc.image(imgFormato, {
    fit: [anchoHoja, altoHoja]
  });
  const vacio = '';

  let pathCfg = path.join(__dirname, './hojaEvolucionFields.cfg');

  let pages = JSON.parse(fs.readFileSync(pathCfg, 'utf-8').toString().replace(/\n|\r/g, "").trim());

  //////////////
  // Registrar fuente de letra
  // Register a font
  doc.registerFont('arialnarrow', 'fonts/arial-narrow.ttf');
  //////////////
  //for (var f = 1; f<=12; f++) {
  //  doc
  //  .fontSize(f)
  //  .text('Fuente de letra Arial Narrow tamaño '+f)
  //  .moveDown(0.5);

  //}

  // Colocr renglón en cero para saber que hay que imprimir los encabezados.
  doc.y = 0;

  linesByPage = 3;
  page = 0;
  col = 1.5;
  row = 7.4;
  rowIni = row;
  colIni = col;
  //console.log('=============================================')
  //console.log(doc);
  //console.log('=============================================')
  let n = 0;
  writeEvolucion(doc, paciente, evoluciones, pages, anchoHoja, altoHoja, n++, imgFormato, rowIni, colIni);

  // Stream contents to a file
  const fileName = 'MSI14-' + Date.now() + '.pdf';
  const filePath = path.join(__dirname, '../../public/pdfs/' + fileName);


  doc.pipe(fs.createWriteStream(filePath)).on('finish', function () {
    console.log('Archivo creado satisfactoriamente ....');
    //return filePath;
  });



  doc.end();
  return filePath;
  //var buffer = encoding.convert(data, "Latin_1") 
}

function writeEvolucion(doc, paciente, evoluciones, pages, anchoHoja, altoHoja, n, imgFormato, rowIni, colIni) {
  margenInf = 40;
  interlineado = 5;

  evoluciones.forEach(function (e) {
    //console.log('evolución:', e);
    //let text = e.descripcion + '\n' + 'Médico: ' + paciente.nombreMT + ' cédula: ' + paciente.cedulaMT;
    let text = e.descripcion + '\n' + 'Médico: ' + e.usuarioSe.nombre + ' cédula: ' + e.usuarioSe.cedula;

    opcionesParrafo = {
      align: 'justify',
      width: pdfTools.cmToPt(14.8),
      //indent: 2,
      ellipsis: true
    };
    altoParrafo = doc.heightOfString(text, opcionesParrafo);

    //console.log(`==== INICIA  ${n} =======`);
    //console.log(`${n} =>[${e.descripcion}]=`);
    //console.log(`${n} => alto Página = ${doc.page.height}`);
    //console.log(`${n} =>       doc.y = ${doc.y}`);
    //console.log(`${n} =>alto Parrafo = ${altoParrafo}`);
    //console.log(`${n} => ren llega a = ${doc.y + altoParrafo + interlineado}`);
    //console.log(`${n} =>    alcanza? = ${doc.page.height} - ${doc.y} - ${altoParrafo} - ${margenInf}=${doc.page.height - doc.y - altoParrafo -margenInf}`);
    //console.log(`${n} =>    row, col = ${row}, ${col}`);

   

    //
    //console.log(`${n}=>1 widthOfString=`, doc.widthOfString(e.descripcion, {
    //  align: 'justify',
    //  width: pdfTools.cmToPt(14.8),
    //  //indent: 2,
    //  ellipsis: true
    //}));
    //console.log(`${n}=>1.1 heightOfString=`, altoParrafo);
    if (doc.y + altoParrafo + interlineado + margenInf > doc.page.height) {
      let i = 1;

      while (doc.y< doc.page.height-margenInf) {
        writeLine(doc, '===='.repeat(i++));
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
    // Escribe encabezados
    if (doc.y == 0) {
      pages[0].forEach(function (field) {
        console.log('field.name:', field.name);
        writeLine(doc, eval(field.name), field.row, field.col, field.align, field.fontSize, field.color, field.width);
      });
    };
    writeLine(doc, moment(e.fecha).format('YYYY-MM-DD HH:mm'), row, col, 'left', 8, 'black');
    writeLine(doc, text, row, col + 3.7, 'justify', 8, 'black', 14);
    if (e.firmaBase64) {
      var dataImgDecodeFromBase64 = new Buffer.from(e.firmaBase64, 'base64');
      console.log('row=', row);
      doc.image(dataImgDecodeFromBase64, pdfTools.cmToPt(col + 18), pdfTools.cmToPt(row), { width: 75 })
    }
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

module.exports = hojaEvolucionPdf;



/////////////////


