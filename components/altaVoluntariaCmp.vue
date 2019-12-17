
<template>
  <div>
    
    <notifyCmp ref="notify" />
    <b-btn class="bg-success button-right " v-on:click="guardar">GUARDAR</b-btn>
    <b-btn class="bg-success button-right " v-on:click="imprimir">IMPRIMIR</b-btn>
       
    <table class="table table-sm table-info">
      <tbody>
        <tr>
          <td style="width:20%;">Fecha y hora:</td>
          <td>
            <input type="datetime-local" v-model="av.fechaFirma" name="fechaFirma">
          </td>
        </tr>

        <tr>
          <td>Nombre responsable:<input type="text" class="input-text" v-model="av.nombreAutoriza" name="nombreAutoriza" size="40"></td>
          <td style="width:15%;">Parentesco:<br /><input type="text" class="input-text" v-model="av.parentescoAutoriza" name="parentescoAutoriza" size="25"></td>
          <td style="width:10%;">Edad:<br /><input type="text" class="input-text" v-model="av.edadAutoriza" name="edadAutoriza" size="5"></tdstyle="width:15%;">
          <td>Domicilio:<br /><input type="text" class="input-text" v-model="av.domicilioAutoriza" name="domicilioAutoriza" size="40"></td>
        </tr>

        <tr>
          <td>Nombre Testigo 1:<input type="text" class="input-text" v-model="av.nombreTestigo1" name="nombreTestigo1" size="40"></td>
          <td style="width:15%;">Parentesco:<br /><input type="text" class="input-text" v-model="av.parentescoTestigo1" name="parentescoTestigo1" size="25"></td>
          <td style="width:10%;">Edad:<br /><input type="text" class="input-text" v-model="av.edadTestigo1" name="edadTestigo1" size="5"></tdstyle="width:15%;">
          <td>Domicilio:<br /><input type="text" class="input-text" v-model="av.domicilioTestigo1" name="domicilioTestigo1" size="40"></td>
        </tr>

        <tr>
          <td>Nombre Testigo 2:<input type="text" class="input-text" v-model="av.nombreTestigo2" name="nombreTestigo2" size="40"></td>
          <td style="width:15%;">Parentesco:<br /><input type="text" class="input-text" v-model="av.parentescoTestigo2" name="parentescoTestigo2" size="25"></td>
          <td style="width:10%;">Edad:<br /><input type="text" class="input-text" v-model="av.edadTestigo2" name="edadTestigo2" size="5"></tdstyle="width:15%;">
          <td>Domicilio:<br /><input type="text" class="input-text" v-model="av.domicilioTestigo2" name="domicilioTestigo2" size="40"></td>
        </tr>


      </tbody>
    </table>

    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaAutoriza">FIRMA RESPONSABLE</b-btn>
            </td>
            <td id="firmaAutoriza">
              <firmaCmp id="firmaX" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              <p><img v-bind:src="firma(av.firmaBase64Autoriza)" width="300" height="60" /></p>
            </td>
          </tr>

          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaTestigo1">FIRMA TESTIGO 1</b-btn>
            </td>
            <td id="firmaTestigo1">
              <p><img v-bind:src="firma(av.firmaBase64Testigo1)" width="300" height="60" /></p>
            </td>
          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaTestigo2">FIRMA TESTIGO 2</b-btn>
            </td>
            <td id="firmaTestigo2">
              <p><img v-bind:src="firma(av.firmaBase64Testigo2)" width="300" height="60" /></p>
            </td>
          </tr>
          
        </tbody>
      </table>
    </div>

   

  </div>
</template>
<script>

  import axios from 'axios';

  import notifyCmp from '~/components/notifyCmp';
  import firmaCmp from '~/components/firmaCmp';

  import moment from 'moment';
  //require('moment/locale/es');

  export default {
    name: 'altaVoluntariaCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: '-- CONSTANCIA ALTA VOLUNTARIA--',
        tituloFirma: '',
        quienFirma: '',
        totalPacientes: 0,
        pacientes: {},
        token: '',
        paciente: {},
        av: {},
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
            case 'AUTORIZA':
              this.av.firmaBase64Autoriza = this.firmaBase64Back;
              break;
            
            case 'TESTIGO1':
              this.av.firmaBase64Testigo1 = this.firmaBase64Back;
              break;
            case 'TESTIGO2':
              this.av.firmaBase64Testigo2 = this.firmaBase64Back;
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
      this.getAltaVoluntaria();

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

        console.log('1111111.- this.av= ', this.av);

        const req = {
          method: this.av.paciente ? 'put' : 'post',
          url: process.env.urlServer + '/altaVoluntaria/' + this.$store.state.pacienteId,
          headers: {
            token: this.$store.state.token
          },
          data: {

            //////////////////
            
            lugarFirma: 'METEPEC, ESTADO DE MÉXICO',
            fechaFirma: this.av.fechaFirma,

            nombreAutoriza: this.av.nombreAutoriza,
            edadAutoriza: this.av.edadAutoriza,
            parentescoAutoriza: this.av.parentescoAutoriza,
            domicilioAutoriza: this.av.domicilioAutoriza,
            firmaBase64Autoriza: this.av.firmaBase64Autoriza,

            nombreTestigo1: this.av.nombreTestigo1,
            edadTestigo1: this.av.edadTestigo1,
            parentescoTestigo1: this.av.parentescoTestigo1,
            domicilioTestigo1: this.av.domicilioTestigo1,
            firmaBase64Testigo1: this.av.firmaBase64Testigo1,

            nombreTestigo2: this.av.nombreTestigo2,
            edadTestigo2: this.av.edadTestigo2,
            parentescoTestigo2: this.av.parentescoTestigo2,
            domicilioTestigo2: this.av.domicilioTestigo2,
            firmaBase64Testigo2: this.av.firmaBase64Testigo2,

            //////////////////
          }
        };
        axios(req)
          .then((response) => {
            
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
        if (!this.av.paciente) {
          this.$refs.notify.showNotify("ANTES DEBES AGREGAR Y GUARDAR LOS DATOS", 4);
          return;
        }
        axios.get(process.env.urlServer + '/msi04/' + this.$store.state.pacienteId, {
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

      getAltaVoluntaria: function () {

        axios.get(process.env.urlServer + '/AltaVoluntaria/' + this.$store.state.pacienteId, {
          headers: {
            'token': this.$store.state.token
          }
        }).then((response) => {
          this.av = response.data.altaVoluntaria;
          this.av.fechaFirma = moment(this.av.fechaFirma).format('YYYY-MM-DDTHH:mm');
          //console.log(this.av.fechaFirma);
          console.log('av leido=', this.av);
        })
          .catch(err => {
            //this.av = { fechaFirma: Date() };
            this.av = {};
          });
      }
    }
  }

</script>
