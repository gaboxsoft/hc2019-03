
<template>
  <div>
    <notifyCmp ref="notify" />

          <table   class="table table-sm  table-hover table-info ">
            <tbody>
              <tr>
                <td style="width:20%">FECHA</td>
                <td style="width:5%">HORA</td>
                <td>
                  RECETA
                  <b-btn class="bg-success" v-on:click="agregar">+</b-btn>
                </td>
                <td>
                  MÉDICO
                </td>
                <td>FIRMA</td>
              </tr>
              <tr :class="{'bg-warning':r._id===$store.state.recetaId}"
                  v-model="recetas"
                  v-for="r in recetas">
                <td>{{momento(r.fechaReceta).format('YYYY-MMM-DD')}}</td>
                <td>{{momento(r.fechaReceta).format('HH:mm')}}</td>
                <td>{{r.prescripcion}}</td>
                <td>--{{r.usuarioSe.nombre}}--</td>
                <td width="20%">
                  <img v-bind:src="firma(r.firmaBase64)" width="100" height="20" />

                </td>
                <td style="width:25px;">
                  <b-btn btn-xs v-show="r.usuarioSe._id===$store.state.usuarioId"
                         v-on:click="seleccionar(r._id)">
                    Sel
                  </b-btn>
                  <b-btn class="bg-success button-right" v-on:click="imprimir(r._id)">IMPRIMIR</b-btn>

                </td>
              </tr>
            </tbody>
          </table>
  </div>
</template>

<script>
  import axios from 'axios';
  import notifyCmp from '~/components/notifyCmp';
  const moment = require('moment');
  //require('moment/locale/es');  // without this line it didn't work
  //moment.locale('es')
  export default {
    name: 'recetasCmp',
    components: {
      notifyCmp
    },
    data() {
      return {    
        tituloPagina: 'RECETAS',
        evolucionesVacia: [
          { _id: '', fecha: '', descripcion: '' }
        ],
        evoluciones:{},
        evolucionId: 'NUEVO',
        recetas: {},
        receta: {},
        recetaId:'NUEVO'
      }
    },

    computed: {
      urlGetPaciente: function () {
        return process.env.urlServer+'/paciente/' + this.$store.state.pacienteId; //'http://localhost:3000/paciente/' + this.$store.state.pacienteId;
      },
      urlGetReceta: function () {
        return process.env.urlServer + '/Receta/' + this.$store.state.recetaId;
      },
      urlGetRecetas: function () {
        return process.env.urlServer + '/Recetas/' + this.$store.state.pacienteId; 
      },
      urlRecetaPdf: function () {
        return process.env.urlServer + '/msi15/' ; 
      },
      getHuboCambio: function () {
        return this.$store.state.huboCambio;
      },
      getToken: function () {
        return this.$store.state.token;
      }
    },
    watch: {
      getHuboCambio: function () {
        this.getRecetas(this.getToken);
      }
    },
    created() {
      this.getRecetas(this.getToken);
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
        this.$store.commit('setRecetaId', 'NUEVO');

      },
      seleccionar: function (recetaId) {
        this.$store.commit('setRecetaId', recetaId)

      },
      getCurrentPaciente: function (token) {

        axios.get(this.urlGetPaciente, {
          token: token
        })
          .then((response) => {
            this.paciente = response.data.paciente;
          },
            (error) => {
              this.err = error.response.data.error;
            });
      },

      getRecetas: function (token) {

        axios.get(this.urlGetRecetas, {
          headers: {
            token: this.getToken
          }
        })
          .then((response) => {
            if (response.data.conteo = 0) {
              this.recetas = {};
            }
            else {
              this.recetas = response.data.recetas;
              for (var i = 0; i < this.recetas.length; i++) {
                this.recetas[i].fecha = moment(this.recetas[i].fechaReceta).format('ddd DD MMM YYYY HH:mm:ss');
              }
            }
          },
            (error) => {
              this.err = error.response.data.error;
              this.recetas = {};
            });
      },
    
      imprimir: function (id) {
        axios.get(this.urlRecetaPdf+id, {
          headers: {
            token: this.getToken,
            Accept: 'application/pdf',
            responseType: 'blob'
          }
        })
          .then((response) => {
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER LA RECETA", 4, response.data.pdfFile,true);
          },
            (error) => {
              this.err = error.response.data.error;
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
            });
      }
    }
  };

</script>

