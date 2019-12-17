
////////////////////////////////
//
// Repositorio para generar archivos PDF
// Dependencias--> npm i pdfkit --save 
//
////////////////////////////////

let pdfTools = {};

///////////////////////////////
// Calcula las nuevas coordenadas para escribir un texto en angulo dado.
// Sólo lo usa la funcion drawTexts.
//////////////////////////////
pdfTools.doTransform = (x, y, angle) => {
    var rads = angle / 180 * Math.PI;
    var newX = x * Math.cos(rads) + y * Math.sin(rads);
    var newY = y * Math.cos(rads) - x * Math.sin(rads);

    return {
      x: newX,
      y: newY,
      rads: rads,
      angle: angle
    };

    ///////////////////////////////
    // Escribe un párrafo en un ángulo dado.
    // doc    --> pdfkit
    // texts  --> es un párrafo.
    //////////////////////////////
  pdfTools.drawTexts =  (doc, texts) => {
      _.each(texts, t => {
        doc.save();
        doc.fontSize(t.size);
        var loc = doTransform(t.x, t.y, t.rotation);
        doc.rotate(t.rotation);
        doc.text(t.text, loc.x, loc.y);
        doc.restore();
      });
    };
  };

  ///////////////////////////
  // Funciones de conversión entre milímetros y puntos y viceversa
  // Utiles para cambiar la unidades de media en pdfkit
  ///////////////////////////

pdfTools.mmToPt = (mm) => {
  return mm * 2.83465;
};

pdfTools.cmToPt = (cm) => {

  return cm?cm * 28.3465:undefined;
};

pdfTools.ptToCm = (pts) => {

  return pts ? pts / 28.3465 : undefined;
};

pdfTools.inchToPt = (inch) => {
  return inch * 72;
};

module.exports = pdfTools;
