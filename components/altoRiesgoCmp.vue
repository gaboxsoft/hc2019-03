
<template>
  <div>
    <!--<div>
      <h2 class="text-primary">{{tituloPagina}}</h2>
    </div>-->
    <notifyCmp ref="notify" />
    <b-btn class="bg-success button-right " v-on:click="guardar">GUARDAR</b-btn>
    <b-btn class="bg-success button-right " v-on:click="imprimir">IMPRIMIR</b-btn>

    <!--

    ?fechaFirma=&preoperatorio=&procedimientoQuirurgico=&testigo1=&testigo2=&SignBtn=#


    -->
    <!--<form action="#">-->
    <table class="table table-sm table-info">
      <tbody>
        <tr>
          <td style="width:20%;">Fecha y hora:</td>
          <td>
            <input type="datetime-local" v-model="ar.fechaFirma" name="fechaFirma">
          </td>
        </tr>
        <tr>
          <td>Médico quien envía al paciente a realizar el estudio:</td>

          <td>
            <select v-model="ar.medico">
              <option v-for="mm in paciente.medicos" v-bind:value="mm._id">
                {{ mm.nombre }} - {{mm.especialidad}}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>Estudio:</td>
          <td><input class="input-text" v-model="ar.estudio" name="estudio" size="80"></td>
        </tr>
        <tr>
          <td>Paciente indentificación:</td>
          <td><input type="text" class="input-text" v-model="ar.identificacionPaciente" name="identificacionPaciente" size="30"></td>
        </tr>
        <tr>
          <td>Familiar responsable:</td>
          <td><input type="text" class="input-text" v-model="ar.nombreResponsable" name="nombreResponsable" size="60"></td>
        </tr>
        <tr>
          <td>Representante Legal:</td>
          <td>Nombre:<br><input type="text" class="input-text" v-model="ar.nombreRepresentanteLegal" name="nombreRepresentanteLegal" size="60"></td>
          <td>indentificación:<br><input type="text" class="input-text" v-model="ar.identificacionRepresentanteLegal" name="identificacionRepresentanteLegal" size="30"></td>
        </tr>
        <tr>
        <tr>
          <td>Testigo 1:</td>
          <td>Nombre:<br><input type="text" class="input-text" v-model="ar.nombreTestigo1" name="nombreTestigo1" size="60"></td>
          <td>indentificación:<br><input type="text" class="input-text" v-model="ar.identificacionTestigo1" name="identificacionTestigo1" size="30"></td>
        </tr>
        <tr>
          <td>Testigo 2:</td>
          <td>Nombre:<br><input type="text" class="input-text" v-model="ar.nombreTestigo2" name="nombreTestigo2" size="60"></td>
          <td>indentificación:<br><input type="text" class="input-text" v-model="ar.identificacionTestigo2" name="identificacionTestigo2" size="30"></td>
        </tr>



      </tbody>
    </table>

    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaAutoriza">FIRMA AUTORIZA</b-btn>
            </td>
            <td id="firmaAutoriza">
              <firmaCmp id="firmaX" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              <p><img v-bind:src="firma(ar.firmaBase64Autoriza)" width="300" height="60" /></p>
            </td>
          </tr>

          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaTestigo1">FIRMA TESTIGO 1</b-btn>
            </td>
            <td id="firmaTestigo1">
              <p><img v-bind:src="firma(ar.firmaBase64Testigo1)" width="300" height="60" /></p>
            </td>
          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaTestigo2">FIRMA TESTIGO 2</b-btn>
            </td>
            <td id="firmaTestigo2">
              <p><img v-bind:src="firma(ar.firmaBase64Testigo2)" width="300" height="60" /></p>
            </td>
          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaMedico">FIRMA MÉDICO</b-btn>
            </td>
            <td id="firmaMedico">              
              <p><img v-bind:src="firma(ar.firmaBase64Medico)" width="300" height="60" /></p>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!--</form>-->
    <!--<b-btn class="bg-success" v-on:click="guardar">GUARDAR</b-btn>-->

  </div>
</template>
<script>

  import axios from 'axios';

  import notifyCmp from '~/components/notifyCmp';
  import firmaCmp from '~/components/firmaCmp';

  import moment from 'moment';
  //require('moment/locale/es');

  export default {
    name: 'cartaConsentCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: '-- CONSENTIMIENTO INFORMADO ALTO RIESGO--',
        tituloFirma: '',
        quienFirma: '',
        totalPacientes: 0,
        pacientes: {},
        token: '',
        paciente: {},
        ar: {},
        firmaBase64: '',
        firmaBase64Back: '',
        firmaBase64Autoriza: '',
        firmaBase64Testigo1: '',
        firmaBase64Testigo2: '',
        estaFirmando: false,
        medicos: {},
      }
    },
    computed: {

      seFirmo: function () {
        console.log('seFirmo()?->' + this.firmaBase64);
        return !(this.firmaBase64 === '');
      }
    },

    watch: {
      seFirmo: function () {

        if (this.seFirmo) {
         
          this.firmaBase64Back = JSON.parse(JSON.stringify(this.firmaBase64));

          switch (this.quienFirma) {
            case 'MEDICO':
              this.ar.firmaBase64Medico = this.firmaBase64Back;
              break;
            case 'AUTORIZA':
              this.ar.firmaBase64Autoriza = this.firmaBase64Back;
              break;
            
            case 'TESTIGO1':
              this.ar.firmaBase64Testigo1 = this.firmaBase64Back;
              break;
            case 'TESTIGO2':
              this.ar.firmaBase64Testigo2 = this.firmaBase64Back;
              break;
            default:
            // code block
          }


          this.estaFirmando = false;
          this.tituloFirma = '';

        }
      }, 
    },

    created() {
      this.getCurrentPaciente();
      this.getAltoRiesgo();

    },

    methods: {
      firma: function (firmaBase64) {
        if (firmaBase64) {
          return "data: image/png;base64," + firmaBase64
        };
        return "no-image.jpg"
      },
      firmaAutoriza: function () {
        this.tituloFirma = 'FIRMA AUTORIZA'
        this.quienFirma = 'AUTORIZA';
        document.getElementById('firmaAutoriza').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      firmaMedico: function () {
        this.tituloFirma = 'FIRMA MÉDICO'
        this.quienFirma = 'MEDICO';
        document.getElementById('firmaMedico').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      
      firmaTestigo1: function () {
        this.tituloFirma = 'FIRMA DE TESTIGO 1'
        this.quienFirma = 'TESTIGO1';
        document.getElementById('firmaTestigo1').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      firmaTestigo2: function () {
        this.tituloFirma = 'FIRMA DE TESTIGO 2'
        this.quienFirma = 'TESTIGO2';
        document.getElementById('firmaTestigo2').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      firmar: function () {
        this.estaFirmando = true;
        this.firmaBase64 = '';
        document.getElementById('btnIniciarFirma').click();
      },

      getMedicos: function () {
        console.log('AQUI EN GETmÉDICOS-->')
        axios.get(process.env.urlServer + '/Medicos', {
          headers: {
            'token': this.$store.state.token,
          }
        }).then((response) => {
          console.log('medicosTratantesCmp.getMedicos-> ok->', response.data.medicos)
          this.medicos = response.data.medicos;
          this.medicosBak = JSON.parse(JSON.stringify(this.medicos));
          this.totalMedicos = this.medicos.length;
        })
          .catch(err => {
            this.totalMedicos = 0;
            this.medicos = {};

            let aviso = JSON.parse(JSON.stringify(err));
            //console.log(' err getMEDICOS ->>', aviso);
            //let aviso = JSON.parse(JSON.stringify(err)).response.data.error.message;
            //console.log('ERR ->', aviso.response.data.error.message);
            this.$refs.notify.showNotify("AVISO:" + aviso.response.data.error.message, 10);


          });
      },

      guardar: function () {

        console.log('1111111.- this.ar= ', this.ar);

        const req = {
          method: this.ar.paciente ? 'put' : 'post',
          url: process.env.urlServer + '/altoRiesgo/' + this.$store.state.pacienteId,
          headers: {
            token: this.$store.state.token
          },
          data: {

            //////////////////
            
            lugarFirma: 'METEPEC, ESTADO DE MÉXICO',
            fechaFirma: this.ar.fechaFirma,

            identificacionPaciente: this.ar.identificacionPaciente,
            numeroExpediente: this.ar.numeroExpediente,

            identificacionRepresentanteLegal: this.ar.identificacionRepresentanteLegal,
            nombreRepresentanteLegal: this.ar.nombreRepresentanteLegal,

            estudio: this.ar.estudio,

            nombreResponsable: this.ar.nombreResponsable,
            firmaBase64Autoriza: this.ar.firmaBase64Autoriza,


            nombreTestigo1: this.ar.nombreTestigo1,
            identificacionTestigo2: this.ar.identificacionTestigo2,
            firmaBase64Testigo1: this.ar.firmaBase64Testigo1,

            nombreTestigo2: this.ar.nombreTestigo2,
            identificacionTestigo1: this.ar.identificacionTestigo1,
            firmaBase64Testigo2: this.ar.firmaBase64Testigo2,

            medico: this.ar.medico,
            firmaBase64Medico: this.ar.firmaBase64Medico,
            //////////////////
          }
        };
        axios(req)
          .then((response) => {
            //console.log('En guardar hie-- success---->>> pasé ', response.data);
            this.$refs.notify.showNotify("DOCUMENTO GUARDADO", 2.5);
            this.$store.commit('setSocketDatosGenerales');

          })
          .catch(err => {
            //console.log('ERROR  al guardar HIE-- fail---->>> pasé ', err.response);
            this.$refs.notify.showNotify("ERROR AL GUARDAR: " + err.response, 2.5);
          });
      },

      getCurrentPaciente: function () {
        console.log('getPaciente');
        axios.get(process.env.urlServer + '/Paciente/' + this.$store.state.pacienteId, {
          token: this.$store.state.token
        })
          .then((response) => {

            this.paciente = response.data.paciente;
            console.log('getPaciente->', this.paciente);
          },
            (error) => {
              this.paciente = {};
              let p = {
                folioCuenta: '',
                nombre: '',
                genero: '',
                fechaNacimiento: '',
                calle: '',
                numeroInterior: '',
                numeroExterior: '',
                colonia: '',
                municipio: '',
                entidad: '',
                pais: '',
                cp: '',
                telefonos: '',
                ////////////////
                // Hoja inicial expediente
                fechaIngreso: '',
                alergias: '',
                diagnosticoIngreso: '',
                otrosDiagnosticos: '',
                tituloMT: '',
                tituloAbrMT: '',
                nombreMT: '',
                cedulaMT: '',
                institucionMT: '',
                especialidadMT: '',

                //////////////////////////
                //// Nota de urgencias
                fecha1: '',
                seguro: '',
                ocupacion: '',
                diagnosticoEgreso: '',
                FC: '',
                FR: '',
                TA: '',
                T: '',
                peso1: '',
                talla1: '',
                antecedentesImportancia1: '',
                resumenClinico1: '',
                indicaciones1: '',

                /////////////////////////
                // Historia clínica
                lugarOrigen: '',
                antHeredoFam: '',
                personalesPato: '',
                personalesNoPato: '',
                ago: '',
                tensionMens: '',
                ritmo: '',
                inicioVidaSexual: '',
                gestados: '',
                partos: '',
                abortos: '',
                cesareas: '',
                fechaUltimpoParto: '',
                fechaUltimoAborto: '',
                pesoProductos: '',
                fechaUltimaRegla: '',
                fechaUltimaCitoCervix: '',
                circuncision: '',
                protecciónMenstrual: '',
                otrosHistoriaClinica: '',
                padecimientoActual: '',
                peso: '',
                talla: '',
                temperatura: '',
                tensionArterial: '',
                craneo: '',
                cara: '',
                fondoOcular: '',
                cuello: '',
                cardioPulmunar: '',
                abdomen: '',
                mamas: '',
                tactoVaginal: '',
                tactoRectal: '',
                miembros: '',
                ID: '',
                TX: '',
                LAB: '',
                USG: '',
                RX: '',
                /////////////////////////
                //Sello
                fechaCreacionSe: '',
                fechaModificacionSe: '',
                situacionSe: 1, //1-activo
                //fechaBorrado: default nada
                usuarioSe: ''//req.usuario._id
              };
            });
      },

      imprimir: function () {
        if (!this.ar.paciente) {
          this.$refs.notify.showNotify("ANTES DEBES AGREGAR Y GUARDAR LOS DATOS", 4);
          return;
        }
        axios.get(process.env.urlServer + '/msi03/' + this.$store.state.pacienteId, {
          headers: {
            token: this.getToken,
            Accept: 'application/pdf',
            responseType: 'blob'
          }
        })
          .then((response) => {
            console.log('aaquí en imprimir consentiInfo axios y regresó: ', response.data.pdfFile);
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER EL FORMATO", 4, response.data.pdfFile, true);
          },
            (error) => {
              this.err = error.response.data.error;
              //console.log('Error en imprimir Nota Urgencias: ', this.err);
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
            });
      },

      getAltoRiesgo: function () {

        axios.get(process.env.urlServer + '/AltoRiesgo/' + this.$store.state.pacienteId, {
          headers: {
            'token': this.$store.state.token
          }
        }).then((response) => {
          this.ar = response.data.altoRiesgo;
          this.ar.fechaFirma = moment(this.ar.fechaFirma).format('YYYY-MM-DDTHH:mm');
          //console.log(this.ar.fechaFirma);
          console.log('ar leido=', this.ar);
        })
          .catch(err => {
            //this.ar = { fechaFirma: Date() };
            this.ar = {};
          });
      }
    }
  }

</script>
