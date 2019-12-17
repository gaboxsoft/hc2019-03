
<template>
  <div>
    <notifyCmp ref="notify" />
    <b-btn class="bg-success button-right" v-on:click="imprimir">IMPRIMIR</b-btn>

    <table class="table table-sm  table-hover table-info ">
      <tbody>
        <tr>
          <td style="width:20%">FECHA</td>
          <td style="width:5%">HORA</td>
          <td>
            ORDENES
            <b-btn class="bg-success" v-on:click="agregar">+</b-btn>
          </td>
          <td>
            MÉDICO
          </td>
        </tr>
        <tr :class="{'bg-warning':om._id===$store.state.ordenesMedicoId}"
            v-model="ordenesMedicos"
            v-for="om in ordenesMedicos">
          <td>{{momento(om.fechaOrdenes).format('YYYY-MMM-DD')}}</td>
          <!--<td>{{om.fechaOrdenes}}</td>-->

          <td>{{momento(om.fechaOrdenes).format('HH:mm')}}</td>
          <!--<td>{{om.fechaOrdenes}}</td>-->

          <td>{{om.ordenes}}</td>

          <td>--{{om.usuarioSe.nombre}}--</td>
          <td>
            <img v-bind:src="firma(om.firmaBase64)" width="250" height="50" />

          </td>
          <!--<td style="width:25px;">
            <b-btn btn-xs v-show="om.usuarioSe._id===$store.state.usuarioId"
                   v-on:click="seleccionar(om._id)">
              Sel
            </b-btn>
          </td>-->
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
    name: 'ordenesMedicosCmp',
    components: {
      notifyCmp
    },
    data() {
      return {
        tituloPagina: 'ORDENES MEDICOS',

        ordenesMedicos: {},
        ordenesMedico: {},
        ordenesMedicoId: 'NUEVO'
      }
    },

    computed: {
      urlGetPaciente: function () {
        return process.env.urlServer + '/paciente/' + this.$store.state.pacienteId;
      },
      urlGetOrdenesMedico: function () {
        return process.env.urlServer + '/OrdenesMedico/' + this.$store.state.ordenesMedicoId;
      },
      urlGetOrdenesMedicos: function () {
        return process.env.urlServer + '/OrdenesMedicos/' + this.$store.state.pacienteId;
      },
      urlOrdenesMedicoPdf: function () {
        return process.env.urlServer + '/msi13/';
      },
      getHuboCambio: function () {
        return this.$store.state.huboCambio;
      },
      getToken: function () {
        return this.$store.state.token;
      },

    },
    watch: {
      getHuboCambio: function () {
        this.getOrdenesMedicos(this.getToken);
      }
    },
    created() {
      this.getOrdenesMedicos(this.getToken);
    },

    methods: {
      firma: function (firmaBase64) {
        if (firmaBase64) {
          return "data: image/png;base64," + firmaBase64
        };
        return "no-image.jpg"
      },
      momento: function (fecha) {
        return moment(fecha);
      },
      agregar: function () {
        this.$store.commit('setOrdenesMedicoId', 'NUEVO');

      },
      seleccionar: function (ordenesMedicoId) {
        this.$store.commit('setOrdenesMedicoId', ordenesMedicoId)

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

      getOrdenesMedicos: function (token) {

        axios.get(this.urlGetOrdenesMedicos, {
          headers: {
            token: this.getToken
          }
        })
          .then((response) => {
            if (response.data.conteo = 0) {
              this.ordenesMedicos = {};
            }
            else {
              this.ordenesMedicos = response.data.ordenesMedicos;
              for (var i = 0; i < this.ordenesMedicos.length; i++) {
                this.ordenesMedicos[i].fechaOrdenes = moment(this.ordenesMedicos[i].fechaOrdenes).format('YYYY-MM-DDTHH:mm:ss');
              //  this.ordenesMedicos[i].fecha = moment(this.ordenesMedicos[i].fechaOrdenesMedico);
              }
              console.log(this.ordenesMedicos);
            }
          },
            (error) => {
              this.err = error.response.data.error;
              this.ordenesMedicos = {};
            });
      },

      imprimir: function () {
        axios.get(this.urlOrdenesMedicoPdf + this.$store.state.pacienteId, {
          headers: {
            token: this.getToken,
            Accept: 'application/pdf',
            responseType: 'blob'
          }
        })
          .then((response) => {
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER LAS ORDENES MEDICAS", 4, response.data.pdfFile, true);
          },
            (error) => {
              this.err = error.response.data.error;
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
            });
      }
    }
  };

</script>

