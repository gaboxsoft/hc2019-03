<template>
  <!--<div class="contanier fixed-top margin-bottom:10px">-->
  <div ref="barraMensajes">
    <!--<p>id: -{{getPacienteId}}</p>-->
    <h5 v-bind:class="{'bg-warning':paciente.nombre,'bg-danger':!paciente.nombre}">EXPEDIENTE:  {{paciente.nombre?paciente.nombre:'N I N G U N O'}} <!----- {{paciente?paciente.diagnosticoEgreso:''}}--></h5>
  </div>
  <!--</div>-->
</template>
<script>
  import axios from 'axios';
  export default
    {
      name: 'pacienteTagCmp',
      ////////////////////////
      data() {
        return {
          paciente: { nombre: '' },
          token: 'NONE'
        }
      },
      // props: [
      //   'paciente'
      //],
      computed: {
        urlGetPaciente: function () {
          //console.log('url--->', this.$store.state.host + '/paciente/' + this.$store.state.pacienteId);
          //return this.$store.state.host + '/paciente/' + this.$store.state.pacienteId;
          return process.env.urlServer +'/paciente/'+ this.$store.state.pacienteId;
          //return 'http://localhost:3000/paciente/' + this.$store.state.pacienteId;
        },
        getPacienteId: function () {
          return this.$store.state.pacienteId;
        },
        getSocketDatosGenerales: function () {
          return this.$store.state.socketDatosGenerales;
        },
        getToken: function () {
          //console.log('1 getPaciente-->token: ', this.$store.state.token);
          return this.$store.state.token;
        },
        //getSocketNotify: function() {
        //  return this.$store.state.socketNotify;
        //}
      }, 
      watch: {
        getPacienteId: function () {
          this.getPaciente();
        },
        getSocketDatosGenerales: function () {
          this.getPaciente();
        },
        //getSocketNotify: function() {
        //  showNotify()
        //}
      },
      created() {

        //console.log('Aquí en creado pacienteTAGCmp: ', this.urlGetPaciente)
        if (this.getPacienteId === '') {

        };
        this.getPaciente();
      },
      methods: {

        getPaciente() {

          if (this.$store.state.pacienteId==='NONE') {
            return this.paciente = {};
          };
          //console.log('2 getPaciente-->token: ', this.$store.state.token);
          //console.log('3 pacienteTagCmp-->getPaciente: ', this.$store.state.pacienteId);
          this.token = this.getToken;
          //console.log('4 getPaciente-->token: ', this.token, '---',this.$store.state.token);
          

          axios.get(this.urlGetPaciente, {
           
              token: this.$store.state.token
          })
            .then((response) => {
              //console.log('5 getPaciente-->lEÍ PACIENTE OK: ', response.data);
              this.paciente = response.data.paciente;
              //this.$store.commit('setCurrentPaciente', response.data.paciente);

            },
              (error) => {
                //console.log('hubo error: en pacienteTag : ', error.Error, error.config);
                this.paciente = { nombre: '--N I N G U N O--' };
                //this.$store.commit('setCurrentPaciente', this.paciente);
                //this.err = error.response.data.error;
                this.err = error.response;
              });
          //console.log('al final en pacienteTag= ', this.paciente);
        }
      }
    }


</script>

