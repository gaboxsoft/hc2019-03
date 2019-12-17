
<template>
  <!--style="margin-top:100px;"-->
  <div class="col-md-8">
    <div>
      <h2 class="text-primary">{{tituloPagina}}</h2>
    </div>

    <notifyCmp ref="notify" />
    <b-btn class="bg-success button-right " v-on:click="guardar">GUARDAR</b-btn>

    <div class="row">
      folio:
      <div class="col-md-2 text-left bg-warning">{{paciente.folioCuenta}}</div>
    </div>

    <form action="#">
      <table class="table table-sm table-info">

        <tbody>
          <tr>
            <td style="width:25%;">Nombre:</td>
            <td><input type="text" class="text input-text" v-model="paciente.nombre" name="nombre"></td>
          </tr>
          <tr>
            <td>Estado civíl:</td>
            <td><input type="text" class="input-text" v-model="paciente.edoCivil" name="edoCivil"></td>
          </tr>
          <tr>
            <td>Género:</td>
            <td>
              <div>
                <input type="radio" id="hombre" value="H" v-model="paciente.genero">Hombre
                <input type="radio" id="mujer" value="M" v-model="paciente.genero">Mujer
              </div>
            </td>
          </tr>
          <tr>
            <td>Nacimiento:</td>
            <td><input type="date" class="input-text" v-model="paciente.fechaNacimiento" name="fechaNacimiento"></td>
          </tr>
          <tr>
            <td>Edad:</td>
            <td><input type="text" class="input-text" v-model="paciente.edad" name="edad"></td>
          </tr>
          <tr>
            <td>Responsable:</td>
            <td><input type="text" class="input-text" v-model="paciente.nombreResponsable" name="nombreResponsable"></td>
          </tr>
          <tr>
            <td>Telefonos:</td>
            <td><input type="text" class="input-text" v-model="paciente.telefonosResponsable" name="telefonosResponsable"></td>
          </tr>
          <tr>
            <td>Ocupación:</td>
            <td><input type="text" class="input-text" v-model="paciente.ocupacion" name="fechaNacimiento"></td>
          </tr>
          <tr>
            <td>Habitación:</td>
            <td><input type="text" class="input-text" v-model="paciente.habitacion" name="habitacion"></td>
          </tr>
          <tr>
            <td>Calle:</td>
            <td><input type="text" class="text input-text" v-model="paciente.calle" name="calle"></td>
          </tr>
          <tr>
            <td>Núm. exterior:</td>
            <td><input type="text" class="input-text" v-model="paciente.numExterior" name="numExterior"></td>
          </tr>
          <tr>
            <td>Núm. interior:</td>
            <td><input type="text" class="input-text" v-model="paciente.numInterior" name="numInterior"></td>
          </tr>
          <tr>
            <td>Colonia:</td>
            <td><input type="text" class="text input-text" v-model="paciente.colonia" name="colonia"></td>
          </tr>
          <tr>
            <td>Municipio:</td>
            <td><input type="text" class="text input-text" v-model="paciente.municipio" name="municipio"></td>
          </tr>
          <tr>
            <td>Estado:</td>
            <td><input type="text" class="text input-text" v-model="paciente.entidad" name="entidad"></td>
          </tr>
          <tr>
            <td>País:</td>
            <td><input type="text" class="text input-text" v-model="paciente.pais" name="pais"></td>
          </tr>
          <tr>
            <td>CP:</td>
            <td><input type="text" class="input-text" v-model="paciente.CP" name="CP"></td>
          </tr>
          <tr>
            <td>NOMBRE Méd. tratante (MT):</td>
            <td><input type="text" class="text input-text" v-model="paciente.nombreMT" name="nombreMT"></td>
          </tr>
          <tr>
            <td>Cédula profesional MT:</td>
            <td><input type="text" class="text input-text" v-model="paciente.cedulaMT" name="cedulaMT"></td>
          </tr>
          <tr>
            <td>Institución expide Título MT:</td>
            <td><input type="text" class="text input-text" v-model="paciente.institucionMT" name="institucionMT"></td>
          </tr>
        </tbody>
      </table>
      <!--</no-ssr>-->
    </form>
    <b-btn class="bg-success" v-on:click="guardar">GUARDAR</b-btn>
    <br />
    <br />
    <br />
    <br />
  </div>
</template>

<script>
  const urlGetPacientes = process.env.urlServer + '/Pacientes?limite=0&desde=0';//'http://localhost:3000/Pacientes?limite=0&desde=0';
  const MAX_SIZE_NOMBRE = 50;
  import axios from 'axios';

  import notifyCmp from '~/components/notifyCmp';
  import moment from 'moment';
  export default {
    name: 'updatePacienteCmp',
    components: {
      notifyCmp
    },
    data() {
      return {
        tituloPagina: 'DATOS GENERALES DEL PACIENTE',
        totalPacientes: 0,
        pacientes: {},
        token: '',
        paciente: {}
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
      }

    },
    created() {
      this.getCurrentPaciente(this.getToken);
    },


    methods: {
      guardar: function () {
        console.log('fecha Nacimiento', this.paciente.fechaNacimiento);

        //// supervisa que Genero viene codificado como H/M se cambie por M/F
        //if (!this.paciente.genero) {
        //  this.paciente.genero = 'M'
        //};
        //if (this.paciente.genero.toUpperCase() === 'H') {
        //  this.paciente.genero = 'M';
        //};
        //if (this.paciente.genero.toUpperCase() === 'M') {
        //  this.paciente.genero = 'F';
        //};


        this.token = this.getToken;
        const req = {
          method: 'put',
          url: this.urlGetPaciente,
          headers: {
            token: this.token
          },
          data: {
            // folioCuenta,
            //'nombre', 'fechaNacimiento', 'genero',
            //'calle', 'numInterior', 'numExterior',
            //'colonia', 'municipio',
            //'entidad', 'pais', 'telefonos', 'CP'

            folioCuenta: this.paciente.folioCuenta,
            nombre: this.paciente.nombre,
            edoCivil: this.paciente.edoCivil,
            fechaNacimiento: this.paciente.fechaNacimiento,
            genero: this.paciente.genero,
            ocupacion: this.paciente.ocupacion,

            edad: this.paciente.edad,
            habitacion: this.paciente.habitacion,
            nombreResponsable: this.paciente.nombreResponsable,
            telefonosResponsable: this.paciente.telefonosResponsable,


            calle: this.paciente.calle,
            numInterior: this.paciente.numInterior,
            numExterior: this.paciente.numExterior,
            colonia: this.paciente.colonia,
            municipio: this.paciente.municipio,
            entidad: this.paciente.entidad,
            CP: this.paciente.CP,
            telefonos: this.paciente.telefonos,
            pais: this.paciente.pais,
            nombreMT: this.paciente.nombreMT,
            cedulaMT: this.paciente.cedulaMT,
            institucionMT: this.paciente.institucionMT
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
      }
    }
  }

</script>

