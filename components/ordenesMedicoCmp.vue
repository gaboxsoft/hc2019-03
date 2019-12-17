
<template>
  <div>
    <notifyCmp ref="notify" />
    
      <table class="table table-sm table-bordered table-info ">
        <tbody>

          <tr>
            <td style="width:10%;">FECHA-HORA</td>
            <td>ORDENES</td>
            <td>FIRMA</td>
          </tr>

          <tr>
            <td>
              <input type="datetime-local" v-model="ordenesMedico.fechaOrdenes" name="fechaOrdenes">
            </td>
            <td>
              <textarea class="input-text textarea-size" type="text" v-model="ordenesMedico.ordenes" name="ordenes" rows="10" cols="50"></textarea>
              <!--<span><b-btn class="bg-success button-right" v-on:click="guardar">GUARDAR</b-btn></span>-->
            </td>
            <td>
              <!--<textarea class="input-text textarea-size" type="text" v-model="ordenesMedico.ordenes" name="ordenes" rows="10" cols="50"></textarea>-->
              <!--<firmaCmp @firmaCapturada="firmaBase64=$event" />-->
              <b-btn class="bg-success button-right" v-show="estaFirmando!=true" v-on:click="firmar">GUARDAR</b-btn>

              <firmaCmp id="firmax" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
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
    name: 'ordenesMedicoCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: 'ORDENES',
        firmaBase64: '',
        paciente: {},
        ordenesMedico: {},
        estaFirmando: false,

      }
    },

    computed: {
      urlApiOrdenesMedico: function () {
        return process.env.urlServer + '/OrdenesMedico/';
      },
      urlGetPaciente: function () {
        return process.env.urlServer + '/Paciente/' + this.$store.state.pacienteId;
      },
      urlGetOrdenesMedico: function () {
        return process.env.urlServer + '/OrdenesMedico/' + this.$store.ordenesMedicoId;
      },
      urlOrdenesMedicoPdf: function () {
        return process.env.urlServer + '/msi13/' + this.$store.state.ordenesMedicoId;
      },
      getOrdenesMedicoId: function () {
        return this.$store.state.ordenesMedicoId;
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
        console.log(' EN ORDENES MEDICOS-> ' + (!(this.firmaBase64 === '') ? 'FIRMADO!' : "NO FIRMADO"));
        this.guardar();
      },
      getOrdenesMedicoId: function () {
        this.getCurrentPaciente(this.getToken);
        if (!this.getOrdenesMedicoId || this.getOrdenesMedicoId === 'NUEVO' || this.getOrdenesMedicoId === 'NONE' || this.getOrdenesMedicoId === '') {
          this.InicializaOrdenesMedico();
          this.$store.commit('setOrdenesMedicoId', 'NUEVO');
        }
        else {
          this.getOrdenesMedico();
        }
      }
    },
    created() {
      if (!this.getOrdenesMedicoId || this.getOrdenesMedicoId === 'NUEVO' || this.getOrdenesMedicoId === 'NONE' || this.getOrdenesMedicoId === '') {
        this.InicializaOrdenesMedico();
        this.$store.commit('setOrdenesMedicoId', 'NUEVO');
      }
      else {
        this.getOrdenesMedico();
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
          .then((response) => { return moment(response.data.fechaHora); },
            (error) => { this.err = error.response.data.error; return new Date(); });
      },

      InicializaOrdenesMedico: function () {
        this.ordenesMedico._id = 'NUEVO';
        this.ordenesMedico.fechaOrdenes = this.getFechaHora(); //moment(this.getFechaHora()).format('YYYY-MM-DDTHH:mm:ss');
        this.ordenesMedico.ordenes = '';
        this.getOrdenesMedico.firmaBase64 = '';
        console.log('ORDENES INICIALIZADA', this.ordenesMedico);

      },
      getOrdenesMedico: function () {
        axios.get(process.env.urlServer + '/OrdenesMedico/' + this.$store.state.ordenesMedicoId, {
          headers: {
            token: this.getToken
          }
        })
          .then((response) => {
            this.ordenesMedico = response.data.ordenesMedico;
            this.ordenesMedico.fechaOrdenes = moment(this.ordenesMedico.fechaOrdenes).format('YYYY-MM-DDTHH:mm:ss');


          },
            (error) => {
              this.err = error;
              this.$store.commit('setOrdenesMedicoId', 'NUEVO');
              this.InicializaOrdenesMedico();
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
        //console.log('THIS.ordenesMedico', this.ordenesMedico);

        if (this.ordenesMedico.ordenes.trim() === '') {
          this.$refs.notify.showNotify("ESCRIBE ALGO....[" + this.ordenesMedico.ordenes.trim() + ']-[' + this.$store.state.firmaBase64.trim(), .25);
          return;
        }
        //if (this.$store.state.firmaBase64 === '') {
        if (this.firmaBase64 === '') {
          return this.$refs.notify.showNotify('PARA CONTINUAR, POR FAVOR FIRME LA NOTA....', 2);
          return alert("PARA CONTINUAR, POR FAVOR FIRME LA NOTA....");
        }
        //console.log('this.$store.state.firmaBase64-->', this.$store.state.firmaBase64);
        //console.log('this.$store.state.ordenesMedicoId', this.$store.state.ordenesMedicoId);
        //console.log('url-->', this.urlApiOrdenesMedico + this.$store.state.pacienteId);

        if (this.$store.state.ordenesMedicoId === 'NUEVO') {
          const req = {
            method: 'post',
            url: this.urlApiOrdenesMedico + this.$store.state.pacienteId,
            headers: {
              token: this.getToken
            },
            data: {
              fechaOrdenes: moment(this.ordenesMedico.fechaOrdenes).format(),
              ordenes: this.ordenesMedico.ordenes.trim(),
              paciente: this.$store.state.PacienteId,
              //firmaBase64: this.$store.state.firmaBase64
              firmaBase64: this.firmaBase64
            }
          };

          axios(req)
            .then((response) => {
              this.ordenesMedico = {};
              this.InicializaOrdenesMedico()
              this.$store.commit('setOrdenesMedicoId', 'NUEVO');
              this.$store.commit('setHuboCambio');
              this.firmaBase64 = '';
              //this.$store.commit('setFirmaBase64', '');
              this.$refs.notify.showNotify("DOCUMENTO GUARDADO ", 3);
              this.estaFirmando = false;
            })
            .catch(err => {
              console.log('err', err);
              this.$refs.notify.showNotify("ERROR AL GUARDAR " + err, 5);
            });
        }
        else {
          const req = {
            method: 'put',
            url: this.urlApiOrdenesMedico + this.$store.state.ordenesMedicoId,
            headers: {
              token: this.getToken
            },
            data: {
              fechaOrdenes: this.ordenesMedico.fechaOrdenes,
              ordenes: this.ordenesMedico.ordenes
            }
          };
          axios(req)
            .then((response) => {
              this.$store.commit('setHuboCambio');
              this.$store.commit('setOrdenesMedicoId', this.ordenesMedico._id);
              //this.$store.commit('setFirmaBase64', '');
              this.firmaBase64 = '';
              this.$refs.notify.showNotify("firma guardada no debe salir nuca", 2);
            })
            .catch(err => {
              this.$refs.notify.showNotify("ERROR AL GUARDAR " + err, 5);
            });
        }
      }

    }
  };

</script>
