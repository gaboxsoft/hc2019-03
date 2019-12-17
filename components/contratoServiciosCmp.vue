<template>
  <!--style="margin-top:100px;"-->
  <div class="col-md-8">
    <!--<div>
    <h2 class="text-primary">{{tituloPagina}} -- {{estaFirmado()}}</h2>
  </div>-->
    <notifyCmp ref="notify" />

    <b-btn class="bg-success button-right " v-on:click="guardar">GUARDAR</b-btn>
    <b-btn class="bg-success button-right " v-on:click="imprimir">IMPRIMIR</b-btn>
    <div>
      <table class="table table-sm table-info">

        <tbody>
          <tr>
            <td style="width:40%;">Nombre responsable paciente:</td>
            <td><input type="text" class="text input-text" v-model="cs.nombreResponsablePaciente" name="nombreResponsablePaciente"></td>
          </tr>
          <tr>
            <td>Importe anticipo por servicios($):</td>
            <td><input type="number" class="input-text" v-model="cs.importeAnticipo" name="importeAnticipo"></td>
          </tr>
          <tr>
            <td>Nombre Representante Legal Medica:</td>
            <td><input type="text" class="input-text" v-model="cs.nombreRepresentanteLegalMedica" name="nombreRepresentanteLegalMedica"></td>
          </tr>
          <tr>
            <td>Fecha de Firma de Contrato:</td>
            <td><input type="date" class="input-text" v-model="cs.fechaFirmaContrato" name="fechaFirmaContrato"></td>
          </tr>
        </tbody>
      </table>
      <!--<firmaCmp id="firmaPaciente" v-show="estaFirmando" @firmaCapturada="firmaBase64Paciente=$event" />
    <firmaCmp id="firmaRepresentanteLegal" v-show="estaFirmando" @firmaCapturada="firmaBase64RepresentanteLegal=$event" />
    <firmaCmp id="firmaResponsablePaciente" v-show="estaFirmando" @firmaCapturada="firmaBase64ResponsablePaciente=$event" />-->
      <!--<b-btn class="bg-success button-right " v-on:click="firmaPaciente">FIRMA PACIENTE</b-btn>
    <b-btn class="bg-success button-right " v-on:click="firmaRepresentanteLegal">FIRMA RESPONSABLE PACIENTE</b-btn>
    <b-btn class="bg-success button-right " v-on:click="firmaResponsablePaciente">FIRMA REPRESENTANTE MEDICA</b-btn>-->
      <!--<firmaCmp id="firmaPaciente" disabled="false" @firmaCapturada="firmaBase64=$event" />
    <firmaCmp id="firmaRepresentanteLegal" disabled="true" @firmaCapturada="firmaBase64RepresentanteLegal=$event" />
    <firmaCmp id="firmaResponsablePaciente" disabled="true" @firmaCapturada="firmaBase64ResponsablePaciente=$event" />-->

    </div>
    <!--<b-btn class="bg-success" v-on:click="guardar">GUARDAR</b-btn>-->

    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaRepresentanteLegal">FIRMA REPRESENTANTE LEGAL</b-btn>
            </td>
            <td id="firmaRepresentanteLegal">
              <firmaCmp id="firmaX" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              <p><img v-bind:src="firma(cs.firmaBase64RepresentanteLegal)" width="300" height="60" /></p>
            </td>
          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaPaciente">FIRMA PACIENTE:</b-btn>
            </td>
            <td id="firmaPaciente">
              <p><img v-bind:src="firma(cs.firmaBase64Paciente)" width="300" height="60" /></p>
            </td>
          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaResponsablePaciente">FIRMA RESPONSABLE CUENTA:</b-btn>
            </td>
            <td id="firmaResponsablePaciente">
              <p><img v-bind:src="firma(cs.firmaBase64ResponsablePaciente)" width="300" height="60" /></p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>

  const urlGetPacientes = process.env.urlServer + '/Pacientes?limite=0&desde=0';//'http://localhost:3000/Pacientes?limite=0&desde=0';
  const MAX_SIZE_NOMBRE = 50;
  import axios from 'axios';

  import notifyCmp from '~/components/notifyCmp';
  import firmaCmp from '~/components/firmaCmp';

  import moment from 'moment';
  export default {
    name: 'contratoServiciosCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: 'CONTRATO DE SERVICIOS',
        totalPacientes: 0,
        cs: {},
        token: '',
        paciente: {},
        esNuevoContrato: false,
        firmaBase64:'',
        firmaBase64Back: '',
        quienFirma: '',
        estaFirmando: false
      }
    },
    computed: {
      getToken() {
        return this.$store.state.token;
      },
      urlApiPaciente: function () {
        return process.env.urlServer + '/Paciente/' + this.$store.state.pacienteId;//'http://localhost:3000/paciente/' + this.$store.state.pacienteId;
      },
      urlGetPaciente: function () {
        return process.env.urlServer + '/Paciente/' + this.$store.state.pacienteId;
        //'http://localhost:3000/paciente/' + this.$store.state.pacienteId;
      },
      getPacienteId() {
        return this.$store.state.pacienteId;
      },
      seFirmo: function () {
        return !(this.firmaBase64 === '');
      }
    },
    watch: {
      getPacienteId() {
        this.getCurrentPaciente(this.getToken);
      },
      seFirmo: function () {

        if (this.seFirmo) {
          // Para clonar la firma en otro objeto y que no sean la misma referencia
          this.firmaBase64Back = JSON.parse(JSON.stringify(this.firmaBase64));

          //console.log(this.quienFirma, ':[', this.firmaBase64Back, ']');
          switch (this.quienFirma) {
            case 'REPRESENTANTELEGAL':
              this.cs.firmaBase64RepresentanteLegal = this.firmaBase64Back;
              break;
            case 'PACIENTE':
              this.cs.firmaBase64Paciente = this.firmaBase64Back;
              break;

            case 'RESPONSABLEPACIENTE':
              this.cs.firmaBase64ResponsablePaciente = this.firmaBase64Back;
              break;

            default:
            // code block
          }

          //console.log('EN seFIRMO: ', this.pq.firmaBase64MedicoCirujano);

          this.estaFirmando = false;
        }
      },

    },

    beforeMount() {
      this.getContratoServicios();
    },
    created() {
      //this.getCurrentPaciente(this.getToken);

    },


    methods: {
      firma: function (firmaBase64) {
        if (firmaBase64) {
          return "data: image/png;base64," + firmaBase64
        };
        return "no-image.jpg"
      },
      firmaRepresentanteLegal: function () {
        this.quienFirma = 'REPRESENTANTELEGAL';
        document.getElementById('firmaRepresentanteLegal').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      firmaPaciente: function () {
        this.quienFirma = 'PACIENTE';
        document.getElementById('firmaPaciente').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      firmaResponsablePaciente: function () {
        this.quienFirma = 'RESPONSABLEPACIENTE';
        document.getElementById('firmaResponsablePaciente').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      firmar: function () {
        this.estaFirmando = true;
        this.firmaBase64 = '';
        document.getElementById('btnIniciarFirma').click();
      },


      guardar: function () {
        const req = {
          method: this.esNuevoContrato ? 'post' : 'put',
          url: process.env.urlServer + '/contratoServicios/' + this.$store.state.pacienteId,
          headers: {
            token: this.getToken
          },
          data: {

            //paciente: this.$store.state.pacienteId,
            importeAnticipo: this.cs.importeAnticipo,
            fechaFirmaContrato: this.cs.fechaFirmaContrato,
            nombreRepresentanteLegalMedica: this.cs.nombreRepresentanteLegalMedica,

            nombreResponsablePaciente: this.cs.nombreResponsablePaciente,
            
            firmaBase64Paciente: this.cs.firmaBase64Paciente,
            firmaBase64RepresentanteLegal: this.cs.firmaBase64RepresentanteLegal,
            firmaBase64ResponsablePaciente: this.cs.firmaBase64ResponsablePaciente,

          }
        };
        axios(req)
          .then((response) => {
            //console.log('En guardar hie-- success---->>> pasé ', response.data);
            this.$refs.notify.showNotify("DOCUMENTO GUARDADO", 2.5);


          })
          .catch(err => {
            //console.log('ERROR  al guardar HIE-- fail---->>> pasé ', err.response);
            this.$refs.notify.showNotify("ERROR AL GUARDAR: " + err.response, 2.5);
          });
      },
      eliminar: function () {
        return true;
      },

      imprimir: function () {
        if (!this.cs.paciente) {
          this.$refs.notify.showNotify("ANTES DEBES AGREGAR Y GUARDAR LOS DATOS", 4);
          return;
        }
        axios.get(process.env.urlServer + '/msi00/' + this.$store.state.pacienteId, {
          headers: {
            token: this.getToken,
            Accept: 'application/pdf',
            responseType: 'blob'
          }
        })
          .then((response) => {
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER EL FORMATO", 4, response.data.pdfFile, true);
          },
            (error) => {
              //this.err = error.response.data.error;
              //console.log('Error en imprimir Nota Urgencias: ', this.err);
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
            });
      },
      getCurrentPaciente: function (token) {
        //console.log('>> urlGetPaciente en UPDATE_PACIENTEcmp: ', this.urlGetPaciente);

        axios.get(this.urlGetPaciente, {
          token: token
        })
          .then((response) => {
            this.paciente = response.data.paciente;
            //console.log('urlGetPaciente en UPDATE_PACIENTEcmp: ', this.urlGetPaciente);
            //console.log('response.data en UPDATE_PACIENTEcmp: ', response.data);
            this.paciente.fechaNacimiento = moment(this.paciente.fechaNacimiento).format('YYYY-MM-DD');
            //this.$store.commit('setCurrentPaciente', this.paciente);
          },
            (error) => {
              //console.log('paciente en updatePaciente ---ERROR -- NO EXISTE: ', this.urlGetPaciente);
              this.err = error.response.data.error;
              //console.log('en UpdatePaciente->getCurrentPaciente->error', this.err);
              //this.$store.commit('setCurrentPaciente', undefined);
              this.paciente = {
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

      getPacientes: function () {
        //console.log(new Date(), '-->en pacientesCmp--> getPacientes--> this.$store.state.token:', this.$store.state.token);
        this.token = this.$store.state.token;
        axios.get(urlGetPacientes, {
          headers: {
            'token': this.token
          }
        }).then((response) => {
          this.pacientes = response.data.pacientes;
          this.totalPacientes = this.pacientes.length
          //console.log('En pacientesCmp-- success---->>> pasé ', new Date(), '--', this.pacientes.length);

        })
          .catch(err => {
            //console.log('---->>> error en Leer la lista de Pacientes:' + err);
            this.totalPacientes = this.pacientes.length
            this.pacientes = {};
            //console.log('En pacientesCmp-- fail---->>> pasé ', new Date(), '--', this.pacientes.length);
          });
      },

      getContratoServicios: function () {
        //console.log('>> urlGetPaciente en UPDATE_PACIENTEcmp: ', this.urlGetPaciente);

        axios.get(process.env.urlServer + '/contratoServicios/' + this.$store.state.pacienteId, {
          headers: {
            token: this.$store.state.token
          }
        })
          .then((response) => {
            this.cs = response.data.contratoServicios;
            //console.log('urlGetPaciente en UPDATE_PACIENTEcmp: ', this.urlGetPaciente);
            //console.log('response.data en UPDATE_PACIENTEcmp: ', response.data);
            //this.cs.fechaNacimiento = moment(this.paciente.fechaNacimiento).format('YYYY-MM-DD');
            //this.$store.commit('setCurrentPaciente', this.paciente);
            //console.log('Si hay contrato: ', this.cs);
            this.esNuevoContrato = false;

          },
            (error) => {
              //console.log('paciente en updatePaciente ---ERROR -- NO EXISTE: ', this.urlGetPaciente);
              this.err = error.response.data.error;
              //console.log('en UpdatePaciente->getCurrentPaciente->error', this.err);
              //this.$store.commit('setCurrentPaciente', undefined);

              //console.log('NO hay contrato: ', this.cs);
              this.esNuevoContrato = true;

              this.cs = {
                paciente: '',
                nombreResponsable: '',
                nombreRepresentanteLegalMedica: '',
                importeAnticipo: 0,
                fechaFirmaContrato: moment(new Date()),

                firmaBase64Paciente: this.firmaBase64Paciente,
                firmaBase64RepresentanteLegal: this.firmaBase64RepresentanteLegal,
                firmaBase64ResponsablePaciente: this.firmaBase64ResponsablePaciente,

              };
            });
      },
    }
  }

</script>
