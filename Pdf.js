const pdf = require('pdfkit');
const pdfTools = require('./library/pdfkit/gxPdf');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment/locale/es');  // without this line it didn't work
moment.locale('es')
hojaEvolucionPdf();
return

function hojaEvolucionPdf() {
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


  doc.y = 0;

  console.log('inicial doc.y ', doc.y);
  page = 1;
  linesByPage = 3;
  line = 0;
  col = 50;
  row = 200;
  sep = 50;
  ancho = 10;


  let text = "ESTE ES UN TEXTO MUY PERO MUY LARGO, QUE TAL VEZ TE DE FLOJERA LEERLO. PERO TE ANIMO A QUE LO HAGAS YA QUE SI LO HACES ESTARAS AYUDANDOME A PROBAR QUE ESTO TIENE SENTIDO PAL MENOS PARA ALGUIEN.";
  text += text;
  text += text;
  doc.moveDown()
    .fontSize(10)
    .text('PRIMERITO', col, row, {
      align: 'justify',
      ellipsis: true,
      width: pdfTools.cmToPt(ancho)
    });
  doc.moveDown()
    .fontSize(10)
    .text('PRIMERITO TEXTO: ' + text, col + sep, row, {
      align: 'justify',
      ellipsis: true,
      indent: 100,
      width: pdfTools.cmToPt(ancho)
    });
  row = doc.y + 10;


  //////////////
  // Registrar fuente de letra
  // Register a font
  doc.registerFont('arialnarrow', '~/library/msiReportes/fonts/arial-narrow.ttf');
  //////////////
  //for (var f = 1; f<=12; f++) {
  //  doc
  //  .fontSize(f)
  //  .text('Fuente de letra Arial Narrow tamaño '+f)
  //  .moveDown(0.5);

  //}
  console.log('===================================');
  console.log('page.PDFPage ', doc.page.height);
  console.log('===================================');

  
  doc.moveDown()
    .fontSize(10)
    .text('PRIMERO', col, row, {
      align: 'justify',
      ellipsis: true,
      width: pdfTools.cmToPt(ancho)
    });
  doc.moveDown()
    .fontSize(8)
    .text('PRIMER TEXTO: ' + text, col + sep,row,{
      align: 'justify',
      ellipsis: true,
      width: pdfTools.cmToPt(ancho)
    });

  console.log(doc.x, doc.y);
  row = doc.y+10;
  doc.moveDown()
    .fontSize(8)
    .text('SEGUNDO', col, row, {
      align: 'justify',
      ellipsis: true,
      width: pdfTools.cmToPt(ancho)
    });
  
  doc.moveDown()
    .fontSize(8)
    .text('SEGUNDO TEXTO: ' + text, col + sep, row,  {
      align: 'justify',
      ellipsis: true,
      width: pdfTools.cmToPt(ancho)
    });

  ////writeLine(doc, new Date().toISOString().replace(/T/, '   ').replace(/\..+/, '')
  ////  , row, col, 'left', 8, 'black');
  ////writeLine(doc, e.descripcion, row, col + 4, 'left', 8, 'black');
  doc.
    row += .5;
  line++;
  //// agrega otra hoja
  //if (line % linesByPage == 0) {
  //  doc.image(imgFormato, {
  //    fit: [anchoHoja, altoHoja]
  //  });
  //  line = 0;
  //}





  // Stream contents to a file
  const fileName = 'pdf-' + Date.now() + '.pdf';
  const filePath = path.join(__dirname, '' + fileName);


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
        //indent: 2,
        ellipsis: true
      });
  };
}
