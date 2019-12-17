//const Usuario = require('../models/usuario');

const pdf = require('pdfkit');
const pdfTools = require('../pdfkit/gxPdf');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
require('moment/locale/es');  // without this line it didn't work
moment.locale('es')

const hojaInicialExpedientePdf  = (paciente) => {
  const hojaCartaPort = [612, 792];
  const hojaCartaLan = [792, 612];

  var doc = new pdf({
    size: 'letter',
    layout: 'portrait',
    //size: hojaCartaPort,
    margin: 0,
    info: {
      Title: 'Hoja Inicial de Expediente: msi-10 v1.0',
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

  //////////////
  // Registrar fuente de letra
  // Register a font
  doc.registerFont('arial-narrow', 'fonts/arial-narrow.ttf');

  //
  //console.log('paciente: ', paciente);
  console.log('Im in hojainicial: ');

  const imgFormato = path.resolve(__dirname, '../../msiformatos/msi10.jpg');

  doc.image(imgFormato, {
    fit: [anchoHoja, altoHoja]
  });
  const vacio = '';
  // Nombre
  doc.moveDown()
    .fillColor('black')
    .fontSize(9)
    .text(paciente.nombre || vacio, pdfTools.cmToPt(3), pdfTools.cmToPt(5.2), {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });
  // feecha nacimiento
  let nacimiento = paciente.fechaNacimiento || vacio;
  if (!(nacimiento == vacio)) {
    nacimiento = moment(nacimiento).format('DD MMM YYYY');
    console.log('nacimiento: ', nacimiento)
  }
  doc.moveDown()
    .fillColor('black')
    .fontSize(9)
    .text(nacimiento, pdfTools.cmToPt(16.7), pdfTools.cmToPt(5.2), {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });
  // Médico Tratante
  doc.moveDown()
    .fillColor('black')
    .fontSize(9)
    .text(paciente.nombreMT || vacio, pdfTools.cmToPt(4.5), pdfTools.cmToPt(6), {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });
  // fecha ingreso
  let ingreso = paciente.fechaIngreso || vacio;
  if (!(ingreso == vacio)) {
    ingreso = moment(ingreso).format('DD MMM YYYY, h:mm:ss a');
    //console.log('ingreso: ', ingreso, '--', moment(ingreso), '--', paciente.fechaIngreso);
    console.log('ingreso: ', ingreso, '--', paciente.fechaIngreso);
  }
  
  doc.moveDown()
    .fillColor('black')
    .fontSize(9)
    .text(ingreso, pdfTools.cmToPt(16.7), pdfTools.cmToPt(6), {
      align: 'left',
      indent: 2,
      height: 2,
      ellipsis: true
    });

  // alergias
  doc.moveDown()
    .fillColor('black')
    .fontSize(9)
    .text(paciente.alergias || vacio, pdfTools.cmToPt(3.5), pdfTools.cmToPt(8.35), {
      align: 'left',
      indent: 2,
      width: 450,
      height: 2,
      ellipsis: true
    });
  // diagnóstico de ingreso
  doc.moveDown()
    .fillColor('black')
    .fontSize(9)
    .text(paciente.diagnosticoIngreso || vacio, pdfTools.cmToPt(5.5), pdfTools.cmToPt(9), {
      align: 'left',
      indent: 2,
      width: 450,
      //height: 2,
      ellipsis: true
    });
  // Municipio
  doc.moveDown()
    .fillColor('black')
    .fontSize(9)  
    .text(paciente.otrosDiagnosticos || vacio, pdfTools.cmToPt(1.5), pdfTools.cmToPt(11.3), {
      align: 'left',
      indent: 2,
      width:500,
      //height: 2,
      ellipsis: true
    });

  //// Teléfono
  //doc.moveDown()
  //  .fillColor('black')
  //  .fontSize(12)
  //  .text(paciente.domiclio, pdfTools.cmToPt(3.5), pdfTools.cmToPt(12), {
  //    align: 'left',
  //    indent: 2,
  //    height: 2,
  //    ellipsis: true
  //  });




  //doc.moveDown()
  //  .fillColor('black')
  //  .fontSize(4)
  //  .text(encabezado, {
  //    align: 'justify'
  //  });
  //doc.moveDown()
  //  .fillColor('black')
  //  .fontSize(4)
  //  .text('CLAÚSULAS', {
  //    align: 'center',
  //    indent: 2,
  //    height: 2,
  //    ellipsis: true
  //  });


  //for (var i = 0; i < clausulas.length;  i++) {
  //  line = `${clausulas[i].numero}${clausulas[i].texto}`;
  //  doc.moveDown();
  //  doc.moveDown()
  //    .fillColor('black')
  //    .fontSize(4)
  //    .text(line, {
  //      align: 'justify'
  //    });
  //};
  //doc.moveDown();
  //doc.moveDown()
  //  .fillColor('black')
  //  .fontSize(12)
  //  .text('HelloäöüßÄÖÜ©µ®', {
  //    align: 'justify',
  //    indent: 2,
  //    height: 2,
  //    ellipsis: true
  //  });
  
  // Stream contents to a file
  const fileName = 'MSI10-' + Date.now() + '.pdf';
  const filePath = path.join(__dirname, '../../public/pdfs/' + fileName);
  console.log('filePath: ',filePath);
  

  doc.pipe(fs.createWriteStream(filePath)).on('finish', function () {
    console.log('Archivo creado satisfactoriamente ....');
    return filePath;
  });



  doc.end();
  return filePath;
  //var buffer = encoding.convert(data, "Latin_1") 
}


//module.export = msiFormatos;

////function convierteSVG2PDF() {
////  var fs = require('fs');


////  var doc = new pdf();
////  stream = fs.createWriteStream('file.pdf');
////  const pathSvgFile = path.normalize('C:/Users/Isecuriti/Desktop/node/MSI Formatos para digitalización/CMSI-00-Contrato-de-prestacion-servicios.svg');

////  const svg = fs.readFileSync(pathSvgFile);

////  SVGtoPDF(doc, svg, 0, 0);

////  stream.on('finish', function () {
////    console.log(fs.readFileSync('file.pdf'))
////  });

////  doc.pipe(stream);
////  doc.end();

////}
////ejemploPdf = () => {

////  nombre = 'gabriel';
////  apellidoPaterno = 'zuáres';
////  apellidoMaterno = 'valdez';

////  var doc = new pdf({
////    //size: 'LETTER',
////    layout: 'portrain',
////    size: [210, 277],
////    margin: 5,
////    info: {
////      Title: 'Contrato de Prestación de Servicios',
////      Author: 'Clínica Médica San Isidro',
////    }
////  });

////  // Write stuff into PDF
////  doc.moveDown()
////    .fillColor('black')
////    .fontSize(4)
////    .text('EJEMPLO DE DOCUMENTO PDF', {
////      align: 'center',
////      indent: 2,
////      height: 2,
////      ellipsis: true
////    });


////  doc.moveDown()
////    .fillColor('black')
////    .fontSize(4)
////    .text('NOMBRE DE PERSONAS DESDE FORMULARIO', {
////      align: 'center',
////      indent: 2,
////      height: 2,
////      ellipsis: true
////    });



////  doc.moveDown()
////    .fillColor('black')
////    .fontSize(8)
////    .text('NOMBRE: ' + nombre + ' ' + apellidoPaterno + ' ' + apellidoMaterno, {
////      align: 'left',
////      indent: 2,
////      height: 2,
////      ellipsis: true
////    });

////  lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.'

////  doc.fontSize(8);
////  doc.text('This text is left aligned. ' + lorem, {
////    width: 410,
////    align: 'left'
////  });

////  doc.moveDown()
////  doc.text('This text is centered. ' + lorem, {
////    width: 410,
////    align: 'center'
////  });
////  doc.moveDown()
////  doc.text('This text is right aligned. ' + lorem, {
////    width: 410,
////    align: 'right'
////  });

////  doc.moveDown()
////  doc.text('This text is justified. ' + lorem, {
////    width: 410,
////    align: 'justify'
////  });

////  // draw bounding rectangle
////  doc.rect(doc.x, 0, 410, doc.y).stroke()


////  // Stream contents to a file
////  doc.pipe(fs.createWriteStream('ejemplePDF-' + Date.now() + '.pdf')).on('finish', function () {
////    console.log('Archivo creado satisfactoriamente ....');
////  });

////  doc.end();
////};


module.exports = hojaInicialExpedientePdf;
