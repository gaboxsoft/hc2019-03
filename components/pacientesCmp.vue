
<template>
  <div>
    <a ref="linkToDatosGenerales" href="#datosGenerales">ir a Generales</a>
    <!--<no-ssr>-->
    <!--<table class="table table-striped table-bordered table-hover table-info ">-->
    <table class="table table-bordered table-info ">
      <!--style="width:50%;"-->
      <tbody>
        <tr>
          <td>FOLIO</td>
          <td>NOMBRE</td>
          <td>GENERO</td>
          <td>DIAGNOSTICO</td>
          <td>TELÉFONOS</td>
          <td>MÉDICO</td>
        </tr>
        <tr :class="{'bg-warning':p._id===$store.state.pacienteId}" v-model="pacientes"
            v-for="p in pacientes">
          <td>{{p.folioCuenta}}</td>
          <td style="width:200px;">{{p.nombre}}</td>
          <td>{{p.genero}}</td>
          <td>{{p.diagnosticoIngreso}}</td>
          <td>{{p.telefonos}}</td>
          <td>
            <table class="table table-bordered table-info ">
              <tbody>
                <tr v-model="p.medicos" v-for="m in p.medicos">
                  <td>{{m.nombre}}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="width:25px;">
            <b-btn class="bg-success" btn-xs
                   v-on:click="seleccionar(p._id)">
              Abrir
            </b-btn>
          </td>
        </tr>
      </tbody>
    </table>
    <!--</no-ssr>-->

  </div>

</template>

<script>
  const urlGetPacientes = process.env.urlServer + '/Pacientes?limite=0&desde=0';//'http://localhost:3000/Pacientes?limite=0&desde=0';
  const MAX_SIZE_NOMBRE = 50;
  import axios from 'axios';

  export default {
    name: 'pacientesCmp',

    data() {
      return {
        tituloPagina: 'P a c i e n t e',
        token: '',
        pacientes: {}
      }
    },
    computed: {
      getToken() {
        return this.$store.state.token;
      },
      urlApiPaciente() {
        return process.env.urlServer + '/Paciente/' + this.$store.state.pacienteId;
      },
      getSocketDatosGenerales() {
        return this.$store.state.socketDatosGenerales;
      },
      getPacienteId() {
        return this.$store.state.pacienteId;
      }
    },

    watch: {
      getPacienteId: function () {
        this.$store.commit('setSocketDatosGenerales');
      },
      getSocketDatosGenerales: function () {
        this.getPacientes();
      }
    },

    created() {
      //console.log('AQUÍ EN PACIENTES_CMP');
      this.getPacientes();
    },


    methods: {


      seleccionar: function (pacienteId) {
        //console.log('aquí en seleccionar paciente, id: ', pacienteId);
        this.$store.commit('setPacienteId', pacienteId)
        this.$refs.linkToDatosGenerales.click();
        //this.$router.push({ name: 'index' })
        //this.$router.push({ name: 'hojaInicialExpediente' })
        //this.$forceUpdate();
        //this.getPacientes();
      },
      //updatePaciente: (pacienteId) => {
      //  this.seleccionar(pacienteId);
      //  this.getCurrentPaciente(this.getToken);
      //  return true;

      //},
      getCurrentPaciente: function (token) {
        //console.log('getCurrentPaciente->this.urlApiPaciente:', this.urlApiPaciente)

        axios.get(this.urlApiPaciente, {
          token: token
        })
          .then((response) => {
            this.paciente = response.data.paciente;
          },
            (error) => {
              this.err = error.response.data.error;
              this.$store.commit('setPacienteId', undefined);
            });
      },

      getPacientes: function () {
        this.token = this.$store.state.token;
        axios.get(urlGetPacientes, {
          headers: {
            'token': this.token,
            'usuarioId': this.$store.state.usuarioId
          }
        }).then((response) => {
          console.log('\r\n\r\npacientesCmp.getPacientes-> ok->', response.data)
          this.pacientes = response.data.pacientes;
          this.totalPacientes = this.pacientes.length;

        })
          .catch(err => {
            this.totalPacientes = 0;
            this.pacientes = {};
          });
      }
    }
  }
</script>

