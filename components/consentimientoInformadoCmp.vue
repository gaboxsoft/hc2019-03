
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
          <td>
            <!--              <input type="datetime-local" v-model="ci.fechaFirma" name="fechaFirma">-->
            <input type="date" v-model="ci.fechaFirma" name="fechaFirma">
          </td>
        </tr>
        <tr>
          <td>Caracter de la cirugía o procedimiento:</td>
          <td>
            <div>
              <input type="radio" id="electivo" value="N" v-model="ci.esUrgente">Electivo
              <input type="radio" id="Urgente" value="S" v-model="ci.esUrgente">Urgente
            </div>
          </td>
        </tr>
        <tr>
          <td style="width:25%;">Diagnóstico:</td>
          <td>{{paciente.diagnosticoEgreso}}</td>
        </tr>
        <tr>
          <td>Preoperatorio:</td>
          <td><input type="text" class="input-text" v-model="ci.preoperatorio" name="preoperatorio" size="80"></td>
        </tr>

        <tr>
          <td>Procedimiento:</td>
          <td><input type="text" class="input-text" v-model="ci.procedimientoQuirurgico" name="procedimientoQuirurgico" size="80"></td>
        </tr>
        <tr>
          <td>Médico Anestesiólogo:</td>
        
          <td>
            <select v-model="ci.medicoAnestesiologo">
              <option v-for="mm in paciente.medicos" v-bind:value="mm._id">
                {{ mm.nombre }} - {{mm.especialidad}}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td>Testigo 1:</td>
          <td><input type="text" class="input-text" v-model="ci.nombreTestigo1" name="nombreTestigo1" size="80"></td>
        </tr>
        <tr>
          <td>Testigo 2:</td>
          <td><input type="text" class="input-text" v-model="ci.nombreTestigo2" name="nombreTestigo2" size="80"></td>
        </tr>


      </tbody>
    </table>

    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaPaciente">FIRMA PACIENTE</b-btn>
            </td>
            <td id="firmaPaciente">
              <firmaCmp id="firmaX" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              <p><img v-bind:src="firma(ci.firmaBase64Paciente)" width="300" height="60" /></p>
            </td>

          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaAnestesiologo">FIRMA ANESTECIOLOGO</b-btn>
            </td>
            <td id="firmaAnestesiologo">
              <firmaCmp id="firmaX" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              <p><img v-bind:src="firma(ci.firmaBase64Anestesiologo)" width="300" height="60" /></p>
            </td>

          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaTestigo1">FIRMA TESTIGO 1</b-btn>
            </td>
            <td id="firmaTestigo1">
              <p><img v-bind:src="firma(ci.firmaBase64Testigo1)" width="300" height="60" /></p>
            </td>
          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaTestigo2">FIRMA TESTIGO 2</b-btn>
            </td>
            <td id="firmaTestigo2">
              <p><img v-bind:src="firma(ci.firmaBase64Testigo2)" width="300" height="60" /></p>
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
    name: 'consentimientoInformadoCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: '-- CONSENTIMIENTO PARA ANESTESIA --',
        tituloFirma: '',
        quienFirma: '',
        totalPacientes: 0,
        pacientes: {},
        token: '',
        paciente: {},
        ci: {},
        firmaBase64: '',
        firmaBase64Back: '',
        firmaBase64Paciente: '',
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
            case 'PACIENTE':
              this.ci.firmaBase64Paciente = this.firmaBase64Back;
              break;
            case 'ANESTESIOLOGO':
              this.ci.firmaBase64Anestesiologo = this.firmaBase64Back;
              break;
            case 'TESTIGO1':
              this.ci.firmaBase64Testigo1 = this.firmaBase64Back;
              break;
            case 'TESTIGO2':
              this.ci.firmaBase64Testigo2 = this.firmaBase64Back;
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
      this.getConsentimientoInformado();
      //this.getMedicos();
    },

    methods: {
      firma: function (firmaBase64) {
        if (firmaBase64) {
          return "data: image/png;base64," + firmaBase64
        };
        return "no-image.jpg"
      },
      firmaPaciente: function () {
        this.tituloFirma = 'FIRMA DE PACIENTE'
        this.quienFirma = 'PACIENTE';
        document.getElementById('firmaPaciente').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      firmaAnestesiologo: function () {
        this.tituloFirma = 'FIRMA ANESTESIÓLOGO'
        this.quienFirma = 'ANESTESIOLOGO';
        document.getElementById('firmaAnestesiologo').appendChild(document.getElementById('firmaX'));
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

        console.log('1.- this.ci= ', this.ci);

        const req = {
          method: this.ci.paciente ? 'put' : 'post',
          url: process.env.urlServer + '/ConsentimientoInformado/' + this.$store.state.pacienteId,
          headers: {
            token: this.$store.state.token
          },
          data: {

            lugarFirma: this.ci.lugarFirma,
            fechaFirma: this.ci.fechaFirma,

            esUrgente: this.ci.esUrgente,
            preoperatorio: this.ci.preoperatorio,
            procedimientoQuirurgico: this.ci.procedimientoQuirurgico,

            nombrePaciente: this.ci.nombrePaciente,
            firmaBase64Paciente: this.ci.firmaBase64Paciente,

            medicoAnestesiologo : this.ci.medicoAnestesiologo,
            firmaBase64Anestesiologo: this.ci.firmaBase64Anestesiologo,

            nombreTestigo1: this.ci.nombreTestigo1,
            firmaBase64Testigo1: this.ci.firmaBase64Testigo1,
            nombreTestigo2: this.ci.nombreTestigo2,
            firmaBase64Testigo2: this.ci.firmaBase64Testigo2,

            nombreRepresentanteLegal: this.ci.nombreRepresentanteLegal,
            firmaBase64RepresentanteLegal: this.ci.firmaBase64RepresentanteLegal,

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
        if (!this.ci.paciente) {
          this.$refs.notify.showNotify("ANTES DEBES AGREGAR Y GUARDAR LOS DATOS", 4);
          return;
        }
        axios.get(process.env.urlServer + '/msi02/' + this.$store.state.pacienteId, {
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




      getConsentimientoInformado: function () {

        axios.get(process.env.urlServer + '/ConsentimientoInformado/' + this.$store.state.pacienteId, {
          headers: {
            'token': this.$store.state.token
          }
        }).then((response) => {
          this.ci = response.data.consentimientoInformado;
          this.ci.fechaFirma = moment(this.ci.fechaFirma).format('YYYY-MM-DD');
          console.log('ci leido=', this.ci);
        })
          .catch(err => {
            //this.ci = { fechaFirma: Date() };
            this.ci = {};
          });
      }
    }
  }

</script>
