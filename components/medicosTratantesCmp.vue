
<template>
  <div>
    <a ref="linkToDatosGenerales" href="#datosGenerales">ir a Generales</a>
    <table class="table table-info ">
      <tbody>
        <tr>
          <td style="width:25%;">Nombre médico:</td>
          <td>
            <input type="text" class="text input-text" v-model="filtroNombre" name="filtroNombre">

          </td>
        </tr>
        <tr>
          <td style="width:25%;">Especialidad:</td>
          <td>
            <input type="text" class="text input-text" v-model="filtroEspecialidad" name="filtroEspecialidad">
            <b-btn class="bg-success" btn-xs
                   v-on:click="filtrar(filtroNombre, filtroEspecialidad)">
              buscar
            </b-btn>
          </td>
        </tr>
        <tr>
          <td>
            selecciona médico:
          </td>
          <td>
            <select v-model="medicoId">
              <option v-for="mm in medicos" v-bind:value="mm._id">
                {{ mm.nombre }} - {{mm.especialidad}}
              </option>
            </select>
            <span>
              <b-btn class="bg-success" btn-xs
                     v-on:click="agregarMedico(medicoId)">
                +
              </b-btn>
            </span>
            
          </td>
        </tr>
      </tbody>
    </table>
    <notifyCmp ref="notify" />
    <table class="table table-bordered table-info ">
      <tbody>
        <tr>
          <td>NOMBRE</td>
          <td>CEDULA</td>
          <td>ESPECIALIDAD</td>
        </tr>
        <!-- class="{'bg-warning':paciente._id===$store.state.pacienteId}" -->
        <tr v-model="paciente.medicos"
            v-for="(m, i) in paciente.medicos">
          <td style="width:200px;">{{m.nombre}}</td>
          <td>{{m.cedula}}</td>
          <td>{{m.especialidad}}</td>
          <td v-show="paciente.medicos.length>1&&i!=0" style="width:25px;">
              <b-btn class="bg-success" btn-xs
                     v-on:click="quitarMedico(m._id)">
                -
              </b-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
  import axios from 'axios';
  import notifyCmp from '~/components/notifyCmp';
  export default {
    name: 'pacientesCmp',
    components: {
      notifyCmp
    },
    data() {
      return {
        tituloPagina: 'Médicos Tratantes',
        filtroNombre: '',
        filtroEspecialidad: '',
        paciente: {},
        medicos: {},
        medicosBak: {},
        medicoId: ''
      }
    },
    computed: {
      getToken() {
        return this.$store.state.token;
      },
      urlGetPacientes() {
        return process.env.urlServer + '/Pacientes/'
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
      console.log('AQUÍ EN medicosTratantesCmp');
      this.getPaciente();
      this.getMedicos();
    },


    methods: {
      agregarMedico: function (medicoId) {
        let existe = false;
        if (!medicoId) {
          return this.$refs.notify.showNotify("SELECCIONA UN MÉDICO.", 1);

        }
        for (var i = 0; i < this.paciente.medicos.length; i++) {
          if (this.paciente.medicos[i]._id === medicoId) {
            existe = true;
            break;
          };
        }

        if (!existe) {
          this.paciente.medicos.push(medicoId);
          this.guardarMedicos();
          //this.getPaciente();
        };
      },
      quitarMedico: function (medicoId) {
        for (var i = 0; i < this.paciente.medicos.length; i++) {
          if (this.paciente.medicos[i]._id === medicoId) {
            this.paciente.medicos.splice(i, 1);
            this.guardarMedicos();
            //this.getPaciente();
            break;
          };
        }
      },
      filtrar: function (nombre, especialidad) {
        console.log('medicos BACK:', this.medicosBak);
        if (this.medicosBak.length>0) {
          nombre = nombre.toUpperCase();
          especialidad = especialidad.toUpperCase();
          console.log('nombre: ', nombre, 'especialidad: ', especialidad)
          this.medicos = this.medicosBak.filter(m => m.nombre.includes(nombre) && m.especialidad.includes(especialidad));
          console.log('medicos filtrados:', this.medicos);
        }
      },

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
      getPaciente: function () {
        //console.log('getCurrentPaciente->this.urlApiPaciente:', this.urlApiPaciente)

        axios.get(this.urlApiPaciente, {
          token: this.getToken
        })
          .then((response) => {
            this.paciente = response.data.paciente;
            console.log('MEDICOS del paciente--->', this.paciente.medicos);
          },
            (error) => {
              this.err = error.response.data.error;
              this.$store.commit('setPacienteId', undefined);
            });
      },

      getPacientes: function () {
        this.token = this.$store.state.token;
        axios.get(this.urlGetPacientes, {
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
      },

      getMedicos: function () {
        console.log('AQUI EN GETmÉDICOS tratantes-->')
        axios.get(process.env.urlServer + '/Medicos', {
          headers: {
            'token': this.getToken,
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
            let aviso = JSON.parse(JSON.stringify(err)).response.data.error.message;
            console.log('ERR ->',aviso);
            this.$refs.notify.showNotify("AVISO:"+aviso, 10);

          });
      },

      guardarMedicos: function () {
        console.log('xx>> guardar');
        const req = {
          method: 'put',
          url: process.env.urlServer + '/paciente/' + this.$store.state.pacienteId,
          headers: {
            token: this.getToken
          },
          data: {
            medicos: this.paciente.medicos
          }
        };
        axios(req)
          .then((response) => {
            console.log('En guardar hcMT-- success---->>> pasé ', response.data);
            this.paciente = response.data.paciente;
            console.log('En guardar hcMT-- success---->>> pasé ', this.paciente);
            this.$refs.notify.showNotify("LISTA DE MÉDICOS ACTUALIZADA.", 1);
            //this.$store.commit('setSocketDatosGenerales');

          })
          .catch(err => {
            console.log('ERROR  al guardar hcMT-- fail---->>> pasé ', err.response);
            this.paciente = {};
            this.$refs.notify.showNotify("ERROR AL AGREGAR: " + err.response, 2.5);
          });
      },

    }
  }
</script>

