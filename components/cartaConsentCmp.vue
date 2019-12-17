
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
            <!--              <input type="datetime-local" v-model="cc.fechaFirma" name="fechaFirma">-->
            <input type="datetime-local" v-model="cc.fechaFirma" name="fechaFirma">
          </td>
        </tr>
        <tr>
          <td>Diagnóstico(s) clínico(s):</td>
          <td><textarea type="text" class="input-text"  v-model="cc.diagnosticoClinico" name="diagnosticoClinico"  rows="5" cols="80"></textarea></td>
        </tr>
        <tr>
          <td>Estudios de laboratorio, gabinete e histopatológicos:</td>
          <td><textarea type="text" class="input-text" v-model="cc.estudios" name="estudios"  rows="5" cols="80"></textarea></td>
        </tr>
        <tr>
          <td>Actos anestésicos:</td>
          <td><textarea type="text" class="input-text" v-model="cc.actosAnestesicos" name="actosAnestesicos"  rows="5" cols="80"></textarea></td>
        </tr>
        <tr>
          <td>Tratamiento(s) médico(s):</td>
          <td><textarea type="text" class="input-text" v-model="cc.tratamientoMedico" name="tratamientoMedico"  rows="5" cols="80"></textarea></td>
        </tr>

        <tr>
          <td>Tratamiento(s) quirurgico(s):</td>
          <td><textarea type="text" class="input-text" v-model="cc.tratamientoQuirurgico" name="tratamientoQuirurgico"  rows="5" cols="80"></textarea></td>
        </tr>
        <tr>
          <td>Riesgos y complicaciones:</td>
          <td><textarea type="text" class="input-text" v-model="cc.riesgos" name="riesgos"  rows="5" cols="80"></textarea></td>
        </tr>
        <tr>
          <td>Autoriza:</td>
          <td><input type="text" class="input-text" v-model="cc.nombreAutoriza" name="nombreAutoriza" size="80" ></td>
        </tr>
        <tr>
          <td>Testigo 1:</td>
          <td><input type="text" class="input-text" v-model="cc.nombreTestigo1" name="nombreTestigo1" size="80"></td>
        </tr>
        <tr>
          <td>Testigo 2:</td>
          <td><input type="text" class="input-text" v-model="cc.nombreTestigo2" name="nombreTestigo2" size="80"></td>
        </tr>


      </tbody>
    </table>

    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaAutoriza">FIRMA QUIEN AUTORIZA</b-btn>
            </td>
            <td id="firmaAutoriza">
              <firmaCmp id="firmaX" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              <p><img v-bind:src="firma(cc.firmaBase64Autoriza)" width="300" height="60" /></p>
            </td>

          </tr>
          
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaTestigo1">FIRMA TESTIGO 1</b-btn>
            </td>
            <td id="firmaTestigo1">
              <p><img v-bind:src="firma(cc.firmaBase64Testigo1)" width="300" height="60" /></p>
            </td>
          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaTestigo2">FIRMA TESTIGO 2</b-btn>
            </td>
            <td id="firmaTestigo2">
              <p><img v-bind:src="firma(cc.firmaBase64Testigo2)" width="300" height="60" /></p>
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
        tituloPagina: '-- CARTA DE CONSENTIMIENTO INFORMADO --',
        tituloFirma: '',
        quienFirma: '',
        totalPacientes: 0,
        pacientes: {},
        token: '',
        paciente: {},
        cc: {},
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
          //this.guardar();
          ////alert('seFirmo--> firmado paciente!' + JSON.parse(JSON.stringify(this.firmaBase64)));
          //alert(this.quienFirma + '->' + JSON.parse(JSON.stringify(this.firmaBase64)));
          this.firmaBase64Back = JSON.parse(JSON.stringify(this.firmaBase64));

          switch (this.quienFirma) {
            case 'AUTORIZA':
              this.cc.firmaBase64Autoriza = this.firmaBase64Back;
              break;
            
            case 'TESTIGO1':
              this.cc.firmaBase64Testigo1 = this.firmaBase64Back;
              break;
            case 'TESTIGO2':
              this.cc.firmaBase64Testigo2 = this.firmaBase64Back;
              break;
            default:
            // code block
          }


          this.estaFirmando = false;
          this.tituloFirma = '';

        }
      },
      getPacienteId() {
        this.getCurrentPaciente();
      }

    },

    created() {
      this.getCurrentPaciente();
      this.getCartaConsent();
      //this.getMedicos();
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

        console.log('1.- this.cc= ', this.cc);

        const req = {
          method: this.cc.paciente ? 'put' : 'post',
          url: process.env.urlServer + '/cartaConsent/' + this.$store.state.pacienteId,
          headers: {
            token: this.$store.state.token
          },
          data: {
            //lugarFirma: this.cc.lugarFirma,
            fechaFirma: this.cc.fechaFirma,

            //diagnosticoEgreso: this.cc.diagnosticoEgreso,
            diagnosticoClinico: this.cc.diagnosticoClinico,
            estudios: this.cc.estudios,
            actosAnestesicos: this.cc.actosAnestesicos,
            tratamientoMedico: this.cc.tratamientoMedico,
            tratamientoQuirurgico: this.cc.tratamientoQuirurgico,            
            riesgos: this.cc.riesgos,

            nombreAutoriza: this.cc.nombreAutoriza,
            firmaBase64Autoriza: this.cc.firmaBase64Autoriza,

            
            nombreTestigo1: this.cc.nombreTestigo1,
            firmaBase64Testigo1: this.cc.firmaBase64Testigo1,

            nombreTestigo2: this.cc.nombreTestigo2,
            firmaBase64Testigo2: this.cc.firmaBase64Testigo2,

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
        if (!this.cc.paciente) {
          this.$refs.notify.showNotify("ANTES DEBES AGREGAR Y GUARDAR LOS DATOS", 4);
          return;
        }
        axios.get(process.env.urlServer + '/msi01/' + this.$store.state.pacienteId, {
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




      getCartaConsent: function () {

        axios.get(process.env.urlServer + '/CartaConsent/' + this.$store.state.pacienteId, {
          headers: {
            'token': this.$store.state.token
          }
        }).then((response) => {
          this.cc = response.data.cartaConsent;
          this.cc.fechaFirma = moment(this.cc.fechaFirma).format('YYYY-MM-DDTHH:mm:ss');
          //console.log(this.cc.fechaFirma);
          //console.log('cc leido=', this.cc);
        })
          .catch(err => {
            //this.cc = { fechaFirma: Date() };
            this.cc = {};
          });
      }
    }
  }

</script>
