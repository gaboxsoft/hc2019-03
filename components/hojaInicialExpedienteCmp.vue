
<template>
  <div id="main">
    <h2 class="text-center text-primary">{{tituloPagina}}</h2>
    <notifyCmp ref="notify"/>
    
    <b-btn class="button-right bg-success" v-on:click="guardarHojaInicialExpediente">GUARDAR</b-btn>
    <b-btn class="button-right bg-success" v-on:click="imprimirHojaInicialExpediente">IMPRIMIR</b-btn>

    <div>
      <form action="#">
       
        <div>Fecha ingreso:</div>
        <input type="datetime-local" v-model="paciente.fechaIngreso" />
       
        <!--rows="3" cols="80"-->
        <div>
          Alergias:
        </div>
        <textarea class="input-text" v-model="paciente.alergias" name="alergias" rows="3" cols="80"></textarea>

        <div>
          Diagnóstico de ingreso:
        </div>
        <textarea class="input-text" v-model="paciente.diagnosticoIngreso" name="diagnosticoIngreso" rows="3" cols="80"></textarea>

        <div>
          Otros diagnósticos:
        </div>
        <textarea class="input-text" v-model="paciente.otrosDiagnosticos" name="otrosDiagnosticos" rows="3" cols="80"></textarea>

      </form>
      <b-btn class="button-right bg-success" v-on:click="guardarHojaInicialExpediente">GUARDAR</b-btn>
      <b-btn class="button-right bg-success" v-on:click="imprimirHojaInicialExpediente">IMPRIMIR</b-btn>
    </div>
  </div>
</template>

<script>
const urlGetPacientes = process.env.urlServer + '/Pacientes?limite=5&desde=0';
//const urlGetPacientes = 'http://localhost:3000/Pacientes?limite=5&desde=0';
const MAX_SIZE_NOMBRE = 50;
  import axios from 'axios';
  import pacienteTagCmp from '~/components/pacienteTagCmp';
  import notifyCmp from '~/components/notifyCmp';

  const moment = require('moment');
  //require('moment/locale/es');  // without this line it didn't work
  //moment.locale('es')

  export default {
    name: 'hojaInicialExpedienteCmp',
    components: {
      pacienteTagCmp,
      notifyCmp
    },
    data() {
      return {
        tituloPagina: 'HOJA INICIAL DE EXPEDIENTE',
        token: '',
        paciente: { //hojaInicioExpediente
          fechaIngreso: moment().format('YYYY-MM-DDTHH:mm:ss'),//(new Date().toISOString()).split('.')[0],
            tituloMT: '',
          nombreMT: '',
          cedulaMT: '',
          institucionMT: '',
          especialidadMT: '',
          alergias: '',
          diagnosticoIngreso: '',
          otrosDiagnosticos: '',
        },
        reportePdf: ''
      }
    },

    computed: {
      url_Server: function () {
        return process.env.urlServer;
      },
      urlGetPaciente: function () {
        //console.log('url--->', this.$store.state.host + '/paciente/' + this.$store.state.pacienteId);
        //return this.$store.state.host + '/paciente/' + this.$store.state.pacienteId;
        return process.env.urlServer + '/paciente/' + this.$store.state.pacienteId;
        //return 'http://localhost:3000/paciente/' + this.$store.state.pacienteId;
      },
      urlHojaInicialExpediente: function () {
        //console.log('url--->', this.$store.state.host + '/paciente/' + this.$store.state.pacienteId);
        //return this.$store.state.host + '/paciente/' + this.$store.state.pacienteId;
        return process.env.urlServer + '/HojaInicialExpediente/' + this.$store.state.pacienteId;
        //return 'http://localhost:3000/HojaInicialExpediente/' + this.$store.state.pacienteId;
      },
      urlHojaInicialExpedientePdf: function () {
        //console.log('url--->', this.$store.state.host + '/paciente/' + this.$store.state.pacienteId);
        //return this.$store.state.host + '/paciente/' + this.$store.state.pacienteId;
        return process.env.urlServer + '/msi10/' + this.$store.state.pacienteId;
        //return 'http://localhost:3000/msi10/' + this.$store.state.pacienteId;
      },
      getPaciente: function () {
        return this.$store.state.currentPaciente;
      },
      setPaciente: function () {
        this.$store.commit(this.currentPaciente);
      },
      getToken: function () {
        return this.$store.state.token;
      }
    },
    created() {
      console.log('url_Server: ', this.url_Server);
     
      console.log('fechaHora:', this.getFechaHora());

      this.getCurrentPaciente(this.getToken);
      //console.log('EN hojaIniExp.Created, currentPaciente= ', this.Paciente);
      
    },
    //ready() {
    //  alert('ready');
    //  //this.anObject.myDate = "2001-01-02T00:00:00"
    //},

    methods: {
      getFechaAhora: function () {
        this.fechaIngreso = this.getFechaHora();
      },

      getFechaHora: function () {
        axios.get(process.env.urlServer + '/fechaHora', {headers: {token: this.getToken}})
          .then((response) => {
            console.log('fechaHora:=> ', response.data.fechaHora)
            return response.data.fechaHora;
          },
            (error) => {this.err = error.response.data.error;return new Date();});
      },

      getCurrentPaciente: function (token) {

        //console.log('aquí en getCurrentPaciente y token:', token);
        console.log('1.- aquí en getCurrentPaciente y url:', this.urlGetPaciente);
        console.log('2.- aquí en getCurrentPaciente y url:',
          process.env.urlServer + '/paciente/' + this.$store.state.pacienteId);
        axios.get(process.env.urlServer + '/paciente/' + this.$store.state.pacienteId, {
          token: token,
          desde:'HIE.getCurrentPaciente'
        })
          .then((response) => {
            //console.log('aaquí en getCurrentPaciente axios y regresó: ', response.data.paciente);
            this.paciente = response.data.paciente;
            console.log('fechaIngreso paciente de la BD: ', this.paciente.fechaIngreso);
            this.paciente.fechaIngreso = moment(this.paciente.fechaIngreso).format('YYYY-MM-DDTHH:mm:ss');
            console.log('fechaIngreso paciente de en moment(): ', this.paciente.fechaIngreso);

            //this.paciente.fechaIngreso = (new this.paciente.fechaIngreso.toISOString()).split('.')[0]
            //this.$store.commit('setCurrentPaciente', response.data.paciente);
          },
          (error) => {
            console.log('error en getCurrentPaciente(): ' + error);
              this.err = error.response.data.error;
             // this.$store.commit('setCurrentPaciente', undefined);
            });
      },
      guardarHojaInicialExpediente: function () {

        console.log('1 En guardar hie-- url---->>>  ', this.urlHojaInicialExpediente);
        this.token = this.getToken;
        console.log('2 En guardar hie-- token---->>>  ', this.token);
        const req = {
          method: 'put',
          url: this.urlHojaInicialExpediente,
          headers: {
            token: this.token,
            desde:'**guardar hoja inicial**'
          },
          data: {
            fechaIngreso: this.paciente.fechaIngreso,
            tituloMT: this.paciente.tituloMT,
            nombreMT: this.paciente.nombreMT,
            cedulaMT: this.paciente.cedulaMT,
            institucionMT: this.paciente.institucionMT,
            especialidadMT: this.paciente.especialidadMT,
            alergias: this.paciente.alergias,
            diagnosticoIngreso: this.paciente.diagnosticoIngreso,
            otrosDiagnosticos: this.paciente.otrosDiagnosticos,
          }
        };
        axios(req)
          .then((response) => {
            //console.log('En guardar hie-- success---->>> pasé ', response.data);
            this.$store.commit('setSocketDatosGenerales')
            this.$refs.notify.showNotify("DOCUMENTO GUARDADO", 2.5);


          })
          .catch(err => {
            //console.log('ERROR  al guardar HIE-- fail---->>> pasé ', err.response);
            this.$refs.notify.showNotify("ERROR AL GUARDAR: "+err.response, 2.5);
          });
      },
      imprimirHojaInicialExpediente: function () {

        //console.log('aquí en imprimir HIE...', this.urlHojaInicialExpedientePdf);
        
        axios.get(this.urlHojaInicialExpedientePdf, {
          headers: {
            token: this.getToken,             
            Accept: 'application/pdf',
            responseType: 'blob'
          }
        })
          .then((response) => {
            console.log('aaquí en imprimirHojaInicialExpediente axios y regresó: ', response.data.pdfFile);
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER EL FORMATO", 4,response.data.pdfFile, true);
          },
            (error) => {
              this.err = error.response.data.error;
              //console.log('Error en imprimirHojaInicialExpediente: ', this.err);
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO: "+error, 5);
            });
      },     
      seleccionar: function (pacienteId) {
        //console.log('aquí en seleccionar paciente, id: ', pacienteId);
        this.$store.commit('setPacienteId', pacienteId)
        this.$router.push({ name: 'index' })
        this.$forceUpdate();
      },
      addPaciente: () => {
        return true;

      },

      getPacientes: function () {
        this.token = this.$store.state.token;
        axios.get(urlGetPacientes, {
          headers: {
            'token': this.token
          }
        }).then((response) => {
          this.pacientes = response.data.pacientes;
          this.totalPacientes = this.pacientes.length
          
        })
          .catch(err => {
            this.totalPacientes = this.pacientes.length
            this.pacientes = {};
          });
      }
    }
  };
  
</script>

