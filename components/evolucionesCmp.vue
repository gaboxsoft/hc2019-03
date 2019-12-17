
<template>
  <div>
    <!--<h1 class=" text-primary">{{tituloPagina}}</h1>-->
    <!--<b-btn class="bg-success" v-on:click="agregar">NUEVA NOTA DE EVOLUCION</b-btn>-->
    <!--<b-btn class="bg-success" v-on:click="imprimir">IMPRIMIR</b-btn>-->
    <notifyCmp ref="notify" />

    <!--<p></p>-->
    <!--<div class="row">-->
      <!--<div class="col-md-12">-->

        <!--<no-ssr>-->
          <table   class="table table-sm  table-hover table-info ">
            <tbody>
              <tr>
                <!--<td>ID</td>-->
                <td style="width:20%">FECHA</td>
                <td style="width:5%">HORA</td>
                <td>
                  EVOLUCIÓN
                  <b-btn class="bg-success" v-on:click="agregar">+</b-btn>
                </td>
                <td>
                  MÉDICO
                  <b-btn class="bg-success button-right" v-on:click="imprimir">IMPRIMIR</b-btn>
                </td>
                <td>FIRMA</td>
              </tr>
              <tr :class="{'bg-warning':e._id===$store.state.evolucionId}"
                  v-model="evoluciones"
                  v-for="e in evoluciones">
                <!--<td>{{e._id}}</td>-->
                <td>{{e.fecha}}</td>
                <!--<td>{{momento(e.fecha).format('YYYY-MMM-DD')}}</td>
                <td>{{momento(e.fecha).format('HH:mm')}}</td>-->
                <td>{{e.descripcion}}</td>
                <td>--{{e.usuarioSe.nombre}}--</td>
                <td>
                  <img v-bind:src="firma(e.firmaBase64)" width="100" height="20" />
                </td>
                <td style="width:25px;">
                  <!--<b-btn btn-xs
           v-on:click="imprimir(e._id)">
      Imp
       <img src="../assets/iconos/boton-seleccionar-documento.png" style="width: 25px;">
    </b-btn>-->
                  <!--</td>
    <td style="width:25px;">-->
                  <b-btn btn-xs v-show="e.usuarioSe._id===$store.state.usuarioId"
                         v-on:click="seleccionar(e._id)">
                    Sel
                    <!-- <img src="../assets/iconos/boton-seleccionar-documento.png" style="width: 25px;">-->
                  </b-btn>
                </td>
              </tr>
            </tbody>
          </table>
        <!--</no-ssr>-->



      <!--</div>-->
    <!--</div>
    <p></p>-->


    <!--<b-btn class="bg-success" v-on:click="guardar">GUARDAR</b-btn>-->
    <!--<b-btn class="bg-success" v-on:click="imprimir">IMPRIMIR</b-btn>-->

  </div>
</template>

<script>
  import axios from 'axios';
  import notifyCmp from '~/components/notifyCmp';
  const moment = require('moment');
  //require('moment/locale/es');  // without this line it didn't work
  //moment.locale('es')
  export default {
    name: 'evolucionesCmp',
    components: {
      notifyCmp
    },
    data() {
      return {    
        tituloPagina: 'NOTAS DE EVOLUCIÓN',
        evolucionesVacia: [
          { _id: '', fecha: '', descripcion: '' }
        ],
        evoluciones:{},
        evolucionId: 'NUEVO',
      }
    },

    computed: {
      urlGetPaciente: function () {
        return process.env.urlServer+'/paciente/' + this.$store.state.pacienteId; //'http://localhost:3000/paciente/' + this.$store.state.pacienteId;
      },
      urlGetEvolucion: function () {
        return process.env.urlServer + '/Evolucion/' + this.$store.state.evolucionId;//'http://localhost:3000/Evolucion/' + this.$store.state.evolucionId;
      },
      urlGetEvoluciones: function () {
        return process.env.urlServer + '/Evoluciones/' + this.$store.state.pacienteId; 
        //return 'http://localhost:3000/Evoluciones/' + this.$store.state.pacienteId;
      },
      urlHojaEvolucionPdf: function () {
        return process.env.urlServer + '/msi14/' + this.$store.state.pacienteId; 
        //return 'http://localhost:3000/msi14/' + this.$store.state.pacienteId;
      },
      getSocketEvolucion: function () {
        return this.$store.state.socketEvolucion;
      },
      //setPaciente: function () {
      //  this.$store.commit(this.currentPaciente);
      //},
      getToken: function () {
        return this.$store.state.token;
      }
    },
    watch: {
      getSocketEvolucion: function () {
        this.getEvoluciones(this.getToken);
      }
    },
    created() {
      //this.getCurrentPaciente(this.getToken);
      this.getEvoluciones(this.getToken);
      //console.log('--- primero ----EN nota urgencias.Created, Paciente= ', this.Paciente);
    },

    methods: {
      firma: function (firmaBase64) {
        if (firmaBase64) {
          return "data: image/png;base64," + firmaBase64
        };
        return "no-image.jpg"
      },
      momento: function (date) {
          return moment(date);
      },
      agregar: function () {
        console.log('aquí en agregar Evolucion');
        //this.$store.commit('setPacienteId', pacienteId)
        this.$store.commit('setEvolucionId', 'NUEVO');

      },
      seleccionar: function (evolucionId) {
        console.log('aquí en seleccionar Evolucion, id: ', evolucionId);
        //this.$store.commit('setPacienteId', pacienteId)
        this.$store.commit('setEvolucionId', evolucionId)

      },
      getCurrentPaciente: function (token) {

        axios.get(this.urlGetPaciente, {
          token: token
        })
          .then((response) => {
            this.paciente = response.data.paciente;
            //console.log('response.data en getCurrentPaciente: ', response.data);
            //console.log('getCurrentPaciente en Evoluciones: ', this.paciente);
          },
            (error) => {
              this.err = error.response.data.error;
            });
      },

      getEvoluciones: function (token) {

        //console.log('--1.- en NotasUrgenciasCmp->urlNotasUrgencias->', this.urlGetNotasUrgencias);
        //console.log('--1.1.- en NotasUrgenciasCmp->Token->', token);
        //console.log('--1.2.- en NotasUrgenciasCmp->Token->', this.$store.state.pacienteId);
        //axios.get(this.urlGetNotasUrgencias, {
        axios.get(this.urlGetEvoluciones, {
          //token: token
          headers: {
            token: this.getToken
          }
        })
          .then((response) => {
            console.log('21.-response.data en Evoluciones: ', response.data);
            console.log('22.-response.data.conteo en Evoluciones: ', response.data.conteo);
            console.log('23.-response.data.Evoluciones: ', response.data.evoluciones);
            if (response.data.conteo = 0) {
              this.evoluciones = notasVacia;
            }
            else {
              this.evoluciones = response.data.evoluciones;
              for (var i = 0; i < this.evoluciones.length; i++) {
                this.evoluciones[i].fecha = moment(this.evoluciones[i].fecha).format('YYYY-MMM-DD HH:mm');//'ddd DD MMM YYYY HH:mm:ss');
              }
            }
            console.log('24.-final this.evoluciones: ', this.evoluciones);
          },
            (error) => {
              this.err = error.response.data.error;
              this.evoluciones = this.evolucionesVacia;
              //this.$store.commit('setCurrentPaciente', undefined);
            });
      },
    
      imprimir: function () {
        
        console.log('aquí en imprimir HojaEvolucion...', this.urlHojaEvolucionPdf);
        //this.seleccionar(evolucionId);
        axios.get(this.urlHojaEvolucionPdf, {
          headers: {
            token: this.getToken,
            Accept: 'application/pdf',
            responseType: 'blob'
          }
        })
          .then((response) => {
            //console.log('aaquí en imprimir HojaEvolucionPdf y regresó: ', response);
            //console.log('aaquí en imprimir HojaEvolucionPdf axios y regresó: ', response.data.pdfFile);
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER EL FORMATO", 4, response.data.pdfFile,true);
          },
            (error) => {
              this.err = error.response.data.error;
              //console.log('Error en imprimir HojaEvolucionPdf: ', this.err);
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
            });
      }
    }
  };

</script>

