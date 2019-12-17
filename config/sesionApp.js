
///////////////////////
// Variables y constantes de medio ambiante de la app globales.
///////////////////////

///// propiedades de la Sesion
process.sesion = {};
process.sesion.CENTRO_MEDICO = {
  nombre: 'MÉDICA SAN ISIDRO',
  licenciaSanitaria: '17-AM-15-054-0003',
  domicilio: {
    calle: 'JOSEFA ORTIZ DE DOMÍNGUEZ',
    nueroExterior: '444',
    numeroInterior: '',
    colonia: 'BARRIO COAXUSTENCO',
    municipio: 'METEPEC',
    entidad: 'ESTADO DE MÉXICO',
    pais: 'MÉXICO',
    cp: '52140',
    TELEFONOS: '(01722) 235-01-75 / 235-02-12 / 902-03-90 '
  },
  representanteLegal: {
    titulo: 'M.C.',
    nombres: 'Eva María',
    paterno: 'Ortiz',
    materno: 'Ramírez',
    especialidad: 'Anestesiología y Algología',
    rfp: '3081665',
    ce: '4860451',
    institucion: 'Universidad Nacional Autónoma de México',
    nombreCompleto: function () {
      return titulo + ' ' + nombre + ' ' + paterno + ' ' + materno;
    }
  },
  lugarExpedicion: 'METEPEC, ESTADO DE MÉXICO.'
};

process.sesion.TOKEN = {};
process.sesion.USUARIO_LOGIN = {};



