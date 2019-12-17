
<template>
  <!--style="margin-top:100px;"-->
  <div class="col-md-8">
    <div>
      <h2 class="text-primary">{{tituloPagina}} -- {{estaFirmado()}}</h2>
    </div>
    <notifyCmp ref="notify" />
    <b-btn class="bg-success button-right " v-on:click="guardar">GUARDAR</b-btn>

    <form action="#">
      <table class="table table-sm table-info">


        <tbody>
          <tr>
            <td style="width:40%;">Nombre responsable paciente:</td>
            <td><input type="text" class="text input-text" v-model="contratoServicios.nombreResponsablePaciente" name="nombreResponsablePaciente"></td>
          </tr>
          <tr>
            <td>Importe anticipo por servicios($):</td>
            <td><input type="number" class="input-text" v-model="contratoServicios.importeAnticipo" name="importeAnticipo"></td>
          </tr>
          <tr>
            <td>Nombre Representante Legal Medica:</td>
            <td><input type="text" class="input-text" v-model="contratoServicios.nombreRepresentanteLegalMedica" name="nombreRepresentanteLegalMedica"></td>
          </tr>

          <tr>
            <td>Fecha de Firma de Contrato:</td>
            <td><input type="date" class="input-text" v-model="contratoServicios.fechaFirmaContrato" name="fechaFirmaContrato"></td>
          </tr>

        </tbody>
      </table>
      <!--<firmaCmp id="firmaPaciente" v-show="estaFirmando" @firmaCapturada="firmaBase64Paciente=$event" />
      <firmaCmp id="firmaRepresentanteLegal" v-show="estaFirmando" @firmaCapturada="firmaBase64RepresentanteLegal=$event" />
      <firmaCmp id="firmaResponsablePaciente" v-show="estaFirmando" @firmaCapturada="firmaBase64ResponsablePaciente=$event" />-->

      <!--<b-btn class="bg-success button-right " v-on:click="firmaPaciente">FIRMA PACIENTE</b-btn>
      <b-btn class="bg-success button-right " v-on:click="firmaRepresentanteLegal">FIRMA RESPONSABLE PACIENTE</b-btn>
      <b-btn class="bg-success button-right " v-on:click="firmaResponsablePaciente">FIRMA REPRESENTANTE MEDICA</b-btn>-->


      <firmaCmp id="firmaPaciente" disabled="false" @firmaCapturada="firmaBase64=$event" />
      <firmaCmp id="firmaRepresentanteLegal"  disabled="true" @firmaCapturada="firmaBase64RepresentanteLegal=$event" />
      <firmaCmp id="firmaResponsablePaciente"  disabled="true" @firmaCapturada="firmaBase64ResponsablePaciente=$event" />
      <!--</no-ssr>-->
    </form>
    <!--<b-btn class="bg-success" v-on:click="guardar">GUARDAR</b-btn>-->
    <br />
    <br />
    <br />
    <br />
  </div>
</template>
<script>
  //const ContratoServicios = require('../models/contratoServicios');

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
        contratoServicios: {},
        token: '',
        paciente: {},
        esNuevoContrato: false,
        estaFirmando: false,
        firmaBase64Paciente: '',
        firmaBase64RepresentanteLegal: '',
        firmaBase64ResponsablePaciente: '',
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
      }
    },
    watch: {
      getPacienteId() {
        this.getCurrentPaciente(this.getToken);
      },
      seFirmo: function () {
        return !(this.firmaBase64 === '');
      }

    },


    watch: {
      seFirmo: function () {
        //console.log(' --- EN nota urgencias-> ' + (!(this.firmaBase64 === '') ? 'FIRMADO!' : "NO FIRMADO"));
        //console.log(' ---- EN nota urgencias-> ' + this.firmaBase64);
        this.guardar();

      },
    },

    beforeMount() {
      this.getContratoServicios();
    },
    created() {
      //this.getCurrentPaciente(this.getToken);

    },


    methods: {

      firmaPaciente: function () {
        firmaPaciente = true;
      },

      estaFirmado: function () {
        return this.contratoServicios.firmaBase64Paciente != '' ? 'NO FIRMADO' : 'FIRMADO POR PACIENTE';
      },
      guardar: function () {
        const req = {
          method: this.esNuevoContrato ? 'post' : 'put',
          url: process.env.urlServer + '/contratoServicios/' + this.$store.state.pacienteId,
          headers: {
            token: this.getToken
          },
          data: {

            paciente: this.$store.state.pacienteId,
            nombreResponsablePaciente: this.contratoServicios.nombreResponsablePaciente,
            nombreRepresentanteLegalMedica: this.contratoServicios.nombreRepresentanteLegalMedica,//representanteLegal.nombreCompleto(),
            importeAnticipo: this.contratoServicios.importeAnticipo,
            fechaFirmaContrato: this.contratoServicios.fechaFirmaContrato,

            firmaBase64Paciente: this.contratoServicios.firmaBase64Paciente,
            firmaBase64RepresentanteLegal: this.contratoServicios.firmaBase64RepresentanteLegal,
            firmaBase64ResponsablePaciente: this.contratoServicios.firmaBase64ResponsablePaciente,

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
      }
      ,
      archiva: () => {
        return true;

      },
      modificar: (pacienteId) => {
        this.$store.commit('setPacienteId', pacienteId)


      },
      seleccionar: function (pacienteId) {
        //console.log('aquí en seleccionar paciente, id: ', pacienteId);
        this.$store.commit('setPacienteId', pacienteId)


        //this.$router.push({ name: 'index' })
        //this.$forceUpdate();

      },
      addPaciente: function () {
        return true;

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
            this.contratoServicios = response.data.contratoServicios;
            //console.log('urlGetPaciente en UPDATE_PACIENTEcmp: ', this.urlGetPaciente);
            //console.log('response.data en UPDATE_PACIENTEcmp: ', response.data);
            //this.contratoServicios.fechaNacimiento = moment(this.paciente.fechaNacimiento).format('YYYY-MM-DD');
            //this.$store.commit('setCurrentPaciente', this.paciente);
            console.log('Si hay contrato: ', this.contratoServicios);
            this.esNuevoContrato = false;

          },
            (error) => {
              //console.log('paciente en updatePaciente ---ERROR -- NO EXISTE: ', this.urlGetPaciente);
              this.err = error.response.data.error;
              //console.log('en UpdatePaciente->getCurrentPaciente->error', this.err);
              //this.$store.commit('setCurrentPaciente', undefined);

              console.log('NO hay contrato: ', this.contratoServicios);
              this.esNuevoContrato = true;

              this.contratoServicios = {
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
