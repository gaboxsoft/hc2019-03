
<template>
  <div>
    <notifyCmp ref="notify" />

    
      <table class="table table-sm table-bordered table-info ">
        <tbody>

          <tr>
            <td style="width:10%;">FECHA-HORA</td>
            <td>
              PRESCRIPCION
            </td>
          </tr>

          <tr>
            <td>
              <input type="datetime-local" v-model="receta.fechaReceta" name="fechaReceta">
            </td>
            <td>
              <textarea class="input-text textarea-size" type="text" v-model="receta.prescripcion" name="prescripcion" rows="10" cols="50"></textarea>
            </td>
            <td width="20%">
              <firmaCmp id="firma" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              <b-btn class="bg-success button-right" v-show="estaFirmando!=true" v-on:click="firmar">GUARDAR</b-btn>
              <!--<span><b-btn class="bg-success button-right" v-on:click="guardar">GUARDAR</b-btn></span>-->
            </td>

          </tr>

        </tbody>
      </table>

  </div>
</template>
<script>
  import axios from 'axios';
  import notifyCmp from '~/components/notifyCmp';
  import firmaCmp from '~/components/firmaCmp';
  const moment = require('moment');
  require('moment/locale/es');  // without this line it didn't work
  moment.locale('es')
  export default {
    name: 'recetaCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: 'RECETA',
        estaFirmando: false,
        firmaBase64: '',

        paciente: {},
        receta: {},
      }
    },

    computed: {
      urlApiReceta: function () {
        return process.env.urlServer + '/Receta/';
      },
      urlGetPaciente: function () {
        return process.env.urlServer + '/Paciente/' + this.$store.state.pacienteId;
      },
      urlGetReceta: function () {
        return process.env.urlServer + '/Receta/' + this.$store.recetaId;
      },
      urlRecetaPdf: function () {
        return process.env.urlServer + '/msi15/' + this.$store.state.recetaId;
      },
      getRecetaId: function () {
        return this.$store.state.recetaId;
      },
      getToken: function () {
        return this.$store.state.token;
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
      getRecetaId: function () {
        this.getCurrentPaciente(this.getToken);
        if (!this.getRecetaId || this.getRecetaId === 'NUEVO' || this.getRecetaId === 'NONE' || this.getRecetaId === '') {
          this.InicializaReceta();
          this.$store.commit('setRecetaId', 'NUEVO');
        }
        else {
          this.getReceta();
        }
      }
    },
    created() {
      if (!this.getRecetaId || this.getRecetaId === 'NUEVO' || this.getRecetaId === 'NONE' || this.getRecetaId === '') {
        this.InicializaReceta();
        this.$store.commit('setRecetaId', 'NUEVO');
      }
      else {
        this.getReceta();
      }
    },

    methods: {
      firmar: function () {
        this.estaFirmando = true;
        //
        //No appendchild por que no se moverá
        //document.getElementById('firmaPaciente').appendChild(document.getElementById('firmaX'));
        this.firmaBase64 = '';
        document.getElementById('btnIniciarFirma').click();
      },
      getFechaHora: function () {
        axios.get(process.env.urlServer + '/fechaHora', { headers: { token: this.getToken } })
          .then((response) => { return response.data.fechaHora; },
            (error) => { this.err = error.response.data.error; return new Date(); });
      },

      InicializaReceta: function () {
        this.receta._id = 'NUEVO';
        this.receta.fechaReceta = moment(this.getFechaHora()).format('YYYY-MM-DDTHH:mm:ss');
        this.receta.prescripcion = '';
        this.receta.firmaBase64 = '';
        //console.log('RECETA iNICIALIZADA', this.receta);
      },
      getReceta: function () {
        axios.get(process.env.urlServer + '/Receta/' + this.$store.state.recetaId, {
          headers: {
            token: this.getToken
          }
        })
          .then((response) => {
            this.receta = response.data.receta;
            this.receta.fechaReceta = moment(this.receta.fechaReceta).format('YYYY-MM-DDTHH:mm:ss');

          },
            (error) => {
              this.err = error;
              this.$store.commit('setRecetaId', 'NUEVO');
              this.InicializaReceta();
            });
      },

      getCurrentPaciente: function () {
        axios.get(this.urlGetPaciente, {
          token: this.getToken
        })
          .then((response) => {
            this.paciente = response.data.paciente;
          },
            (error) => {
              this.err = error;
            });
      },
      guardar: function () {
        //console.log('THIS.receta', this.receta);

        if (this.receta.prescripcion.trim() === '') {
          this.$refs.notify.showNotify("ESCRIBE ALGO....", .25);
          return;
        }
        //console.log('this.$store.state.recetaId', this.$store.state.recetaId);
        //console.log('url-->', this.urlApiReceta + this.$store.state.pacienteId);

        if (this.$store.state.recetaId === 'NUEVO') {
          const req = {
            method: 'post',
            url: this.urlApiReceta + this.$store.state.pacienteId,
            headers: {
              token: this.getToken
            },
            data: {
              fechaReceta: moment(this.receta.fechaReceta).format(),
              prescripcion: this.receta.prescripcion.trim(),
              paciente: this.$store.state.PacienteId,
              firmaBase64: this.firmaBase64
            }
          };

          axios(req)
            .then((response) => {
              this.receta = {};
              this.InicializaReceta()
              this.$store.commit('setRecetaId', 'NUEVO');
              this.$store.commit('setHuboCambio');
              this.estaFirmando = false;
            })
            .catch(err => {
              //console.log('err', err);
              this.$refs.notify.showNotify("ERROR AL GUARDAR " + err, 5);
            });
        }
        else {
          const req = {
            method: 'put',
            url: this.urlApiReceta + this.$store.state.recetaId,
            headers: {
              token: this.getToken
            },
            data: {
              fechaReceta: this.receta.fechaReceta,
              prescripcion: this.receta.prescripcion,
              firmaBase64: this.firmaBase64
            }
          };
          axios(req)
            .then((response) => {
              this.$store.commit('setHuboCambio');
              this.$store.commit('setRecetaId', this.receta._id);
              this.estaFirmando = false;
            })
            .catch(err => {
              this.$refs.notify.showNotify("ERROR AL GUARDAR " + err, 5);
            });
        }
      }
      ////,
      ////imprimir: function () {

      ////  console.log('aquí en imprimir NU...', this.urlNotaUrgenciasPdf);

      ////  axios.get(this.urlNotaUrgenciasPdf, {
      ////    headers: {
      ////      token: this.getToken,
      ////      Accept: 'application/pdf',
      ////      responseType: 'blob'
      ////    }
      ////  })
      ////    .then((response) => {
      ////      console.log('aaquí en imprimir NU axios y regresó: ', response);
      ////      console.log('aaquí en imprimir NU axios y regresó: ', response.data.pdfFile);
      ////      this.$refs.notify.showNotify("CLICK AQUÍ PARA VER EL FORMATO", 4, response.data.pdfFile,true);
      ////    },
      ////      (error) => {
      ////        this.err = error.response.data.error;
      ////        console.log('Error en imprimir Nota Urgencias: ', this.err);
      ////        this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
      ////      });
      ////}
    }
  };

</script>
