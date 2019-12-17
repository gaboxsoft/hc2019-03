
<template>
  <div>
    <!--<h1 class=" text-primary">{{tituloPagina}}</h1>-->
    <notifyCmp ref="notify" />
    <firmaCmp id="firmax" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
    <b-btn class="bg-success button-right" v-show="estaFirmando!=true" v-on:click="firmar">GUARDAR</b-btn>

    <form action="#">
      <table class="table table-sm table-info ">
        <tbody>
          <tr>
            <td>Fecha:</td>
            <td><input class="input-text" type="datetime-local" v-model="notaUrgencias.fechaNota" name="fechaNota"></td>
          </tr>
          <tr>
            <td>Seguro:</td>
            <td><input class="input-text" type="text" v-model="notaUrgencias.seguro" name="seguro"></td>
          </tr>
          <tr>
            <td>Ocupacion:</td>
            <td> {{paciente.ocupacion}}</td>
          </tr>
          <tr>
            <td>Diagnóstico egreso:</td>
            <td><textarea class="input-text" type="text" v-model="notaUrgencias.diagnosticoEgreso" name="diagnosticoEgreso" rows="5" cols="50"></textarea></td>
          </tr>
          <tr>
            <td></td>
            <td>
              __FC:
              <input class="input-text col-md-3" type="text" v-model="notaUrgencias.FC" name="FC">
              __FR:
              <input class="input-text col-md-3" type="text" v-model="notaUrgencias.FR" name="FR">
              <br />
              __TA:
              <input class="input-text col-md-3" type="text" v-model="notaUrgencias.TA" name="TA">
              ___T:
              <input class="input-text col-md-3" type="text" v-model="notaUrgencias.T" name="T">
              <br />
              Peso:
              <input class="input-text col-md-3" type="text" v-model="notaUrgencias.peso" name="peso">
              Talla:
              <input class="input-text col-md-3" type="text" v-model="notaUrgencias.talla" name="talla">
            </td>
          </tr>
          <tr>
            <td>Antecedentes importantes:</td>
            <td>
              <textarea class="input-text" type="text" v-model="notaUrgencias.antecedentesImportancia" name="antecedentesImportancia" rows="3" cols="50"></textarea>
            </td>
          </tr>
          <tr>
            <td>Resumen clínico:</td>
            <td>
              <textarea class="input-text" v-model="notaUrgencias.resumenClinico" name="resumenClinico" rows="3" cols="50"></textarea>
            </td>
          </tr>
          <tr>
            <td>Indicaciones:</td>
            <td>
              <textarea class="input-text" v-model="notaUrgencias.indicaciones" name="indicaciones" rows="5" cols="50"></textarea>
            </td>
          </tr>        
        </tbody>
      </table>
    </form>
    <!--<b-btn class="bg-success button-right" v-show="estaFirmando!=true" v-on:click="firmar">FIRMAR</b-btn>-->
  </div>
</template>
<script>
  import axios from 'axios';
  import notifyCmp from '~/components/notifyCmp';
  import firmaCmp from '~/components/firmaCmp';
  const moment = require('moment');
  //require('moment/locale/es');  // without this line it didn't work
  //moment.locale('es')
  export default {
    name: 'notaUrgenciasCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: 'NOTA URGENCIAS',
        estaFirmando: false,
        firmaBase64:'',
        paciente: {},
        notaUrgencias: {},
        notaUrgenciasNuevo: {
          fechaNota: moment().format('YYYY-MM-DDTHH:mm'), //(new Date().toISOString()).split('.')[0],
          seguro: '',
          diagnosticoEgreso: '',
          FC: '',
          FR: '',
          TA: '',
          T: '',
          peso: '',
          talla: '',
          antecedentes: '',
          resumenClinico: '',
          indicaciones: '',
          firmaBase64:''
        }
      }
    },

    computed: {
      urlApiNotaUrgencias: function () {
        return process.env.urlServer + '/NotaUrgencias/';
      },
      urlGetPaciente: function () {
        return process.env.urlServer + '/paciente/' + this.$store.state.pacienteId;
      },
      urlGetNotaUrgencias: function () {
        return process.env.urlServer + '/NotaUrgencias/' + this.$store.state.notaUrgenciasId;
      },
      urlNotaUrgenciasPdf: function () {
        return process.env.urlServer + '/msi12/' + this.$store.state.pacienteId;
      },
      getNotaUrgenciasId: function () {
        return this.$store.state.notaUrgenciasId;
      },
      getToken: function () {
        return this.$store.state.token;
      },
      seFirmo: function () {
        return !(this.firmaBase64 === '');
      }
    },

    
    ////////
    watch: {
      seFirmo: function () {
        //console.log(' --- EN nota urgencias-> ' + (!(this.firmaBase64 === '') ? 'FIRMADO!' : "NO FIRMADO"));
        //console.log(' ---- EN nota urgencias-> ' + this.firmaBase64);
        this.guardar();
      },
      getNotaUrgenciasId: function () {
        //console.log('notasUrgenciasCmp->Watch->getNotaUrgenciasId->', this.getNotaUrgenciasId)

        this.getCurrentPaciente(this.getToken);
        if (!this.getNotaUrgenciasId || this.getNotaUrgenciasId === 'NUEVO' || this.getNotaUrgenciasId === 'NONE') {
          //console.log('AGREGANDO NUEVA NOTA DE URGENCIAS...2');
          this.notaUrgencias = this.inicializaNotaUrgencias();
        }
        else {
          //console.log('notasUrgenciasCmp->created()->getNotaUrgenciasId->', this.getNotaUrgenciasId)
          this.getNotaUrgencias();
        }

      }
    },
    created() {

      this.getCurrentPaciente(this.getToken);
      if (!this.getNotaUrgenciasId || this.getNotaUrgenciasId === 'NUEVO' || this.getNotaUrgenciasId === 'NONE') {
        //console.log('AGREGANDO NUEVA NOTA DE URGENCIAS...1');
        this.$store.commit('setNotaUrgenciasId', 'NUEVO');
        this.notaUrgencias = this.inicializaNotaUrgencias();
      }
      else {
        //console.log('notasUrgenciasCmp->created()->getNotaUrgenciasId->', this.getNotaUrgenciasId)
        this.getNotaUrgencias();
      }
      //console.log('EN nota urgencias.Created, Paciente= ', this.Paciente);
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
      inicializaNotaUrgencias: function () {
        return {
          fechaNota: moment(this.getFechaHora()).format('YYYY-MM-DDTHH:mm'),
          seguro: '',
          diagnosticoEgreso: '',
          FC: '',
          FR: '',
          TA: '',
          T: '',
          peso: '',
          talla: '',
          antecedentes: '',
          resumenClinico: '',
          indicaciones: '',
          firmaBase64: ''
        };
      },
      imprimir: function (notaUrgenciasId) {
        if (notaUrgenciasId == '') {
          return;
        }
        //console.log('aquí en imprimir NU...', process.env.urlServer + '/msi12/' + this.$store.state.pacienteId);
        //console.log('------>>   aquí en imprimir NU->notaUrgenciasId: ', notaUrgenciasId);
        //this.seleccionar(notaUrgenciasId);
        axios.get(this.urlNotaUrgenciasPdf, {
          headers: {
            token: this.getToken,
            Accept: 'application/pdf',
            responseType: 'blob',
            notaUrgenciasId: notaUrgenciasId
          }
        })
          .then((response) => {
            //console.log('aaquí en imprimir NU axios y regresó: ', response);
            console.log('aaquí en imprimir NU axios y regresó: ', response.data.pdfFile);
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER EL FORMATO", 4, response.data.pdfFile, true);
          },
            (error) => {
              this.err = error.response.data.error;
              //console.log('Error en imprimir Nota Urgencias: ', this.err);
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
            });
      },

      getNotaUrgencias: function () {

        console.log('--1.- en NotaUrgenciasCmp->urlNotaUrgencias->', this.urlGetNotaUrgencias);
        //console.log('--1.1.- en NotasUrgenciasCmp->Token->', this.getToken);
        //console.log('--1.2.- en NotasUrgenciasCmp->Token->', this.$store.state.pacienteId);
        console.log('--1.3.- en NotaUrgenciasCmp->urlNotaUrgencias->', this.urlApiNotaUrgencias + this.$store.state.notaUrgenciasId);
        console.log('--1.4.- en NotaUrgenciasCmp->notaUrgenciasId->', this.$store.state.notaUrgenciasId);
        //axios.get(this.urlGetNotasUrgencias, {
        axios.get(this.urlApiNotaUrgencias + this.$store.state.notaUrgenciasId, {
          //token: token
          headers: {
            token: this.getToken
          }
        })
          .then((response) => {
            console.log('ojo 22.-response.data en nota urgencias: ', response.data);
            this.notaUrgencias = response.data.notaUrgencias;
            this.notaUrgencias.fechaNota = moment(this.notaUrgencias.fechaNota).format('YYYY-MM-DDTHH:mm');

          },
            (error) => {
              this.err = error;
              console.log('23.-ERROR response.data en nota urgencias: ');
              this.$store.commit('setNotaUrgenciasId', undefined);
            });
      },

      getCurrentPaciente: function () {

        axios.get(this.urlGetPaciente, {
          token: this.getToken
        })
          .then((response) => {
            this.paciente = response.data.paciente;
            console.log('paciente en nota urgencias: ', this.paciente);

          },
            (error) => {
              this.err = error.response.data.error;
              this.$store.commit('setPacienteId', undefined);
            });
      },
      guardar: function () {
        
        console.log('1 En guardar NU-- url---->>>  ', this.urlApiNotaUrgencias + this.$store.state.pacienteId);
        this.token = this.getToken;
        this.notaUrgencias.fechaNota = this.notaUrgencias.fechaNota.split('.')[0];
        //console.log('2 En guardar NU-- token---->>>  ', this.token);
        console.log('2.1.- fecha de notaUrgencia-> ', this.notaUrgencias.fechaNota)
        console.log('2.2.- nuevo->notaUrgenciasId  ', this.$store.state.notaUrgenciasId);
        if (this.notaUrgencias.diagnosticoEgreso.trim() === '') {
          this.$refs.notify.showNotify("ESCRIBE ALGO....", .25);
          return;
        }

        if (this.$store.state.notaUrgenciasId === 'NUEVO') {
          console.log('agregando nueva nota urgencias...', this.notaUrgencias);
          const req = {
            method: 'post',
            url: this.urlApiNotaUrgencias + this.$store.state.pacienteId,
            headers: {
              token: this.token
            },
            data: {
              fechaNota: this.notaUrgencias.fechaNota,
              diagnosticoEgreso: this.notaUrgencias.diagnosticoEgreso,
              seguro: this.notaUrgencias.seguro,
              ocupacion: this.notaUrgencias.ocupacion,
              FC: this.notaUrgencias.FC,
              FR: this.notaUrgencias.FR,
              TA: this.notaUrgencias.TA,
              T: this.notaUrgencias.T,
              peso: this.notaUrgencias.peso,
              talla: this.notaUrgencias.talla,
              antecedentesImportancia: this.notaUrgencias.antecedentesImportancia,
              resumenClinico: this.notaUrgencias.resumenClinico,
              indicaciones: this.notaUrgencias.indicaciones,
              firmaBase64:this.firmaBase64
            }
          };

          axios(req)
            .then((response) => {
              this.$refs.notify.showNotify("DOCUMENTO NUEVO GUARDADO", 2);
              console.log('3.1.-En guardar NUEVO  NU-- success---->>> pasé ', response.data.notaUrgencias);
              // Aquí después de que se guarda
              // deben limpiarse el contenido de las compos
              // para iniciar una nueva nota de evolución
              this.notaUrgencias = this.notaUrgenciasNuevo;

              //this.notaUrgencias = response.data.notaUrgencias;
              this.$store.commit('setNotaUrgenciasId', this.notaUrgencias._id);
              this.$store.commit('setSocketNotasUrgencias');
              this.estaFirmando = false;

            })
            .catch(err => {
              console.log('3.2.-ERROR  al guardar NUEVO  NU-- fail---->>> ', err);
              this.$refs.notify.showNotify("ERROR AL GUARDAR " + err, 5);
            });
        }
        else {
          const req = {
            method: 'put',
            url: this.urlApiNotaUrgencias + this.$store.state.notaUrgenciasId,
            headers: {
              token: this.token
            },
            data: {
              fechaNota: this.notaUrgencias.fechaNota,
              diagnosticoEgreso: this.notaUrgencias.diagnosticoEgreso,
              seguro: this.notaUrgencias.seguro,
              ocupacion: this.notaUrgencias.ocupacion,
              FC: this.notaUrgencias.FC,
              FR: this.notaUrgencias.FR,
              TA: this.notaUrgencias.TA,
              T: this.notaUrgencias.T,
              peso: this.notaUrgencias.peso,
              talla: this.notaUrgencias.talla,
              antecedentesImportancia: this.notaUrgencias.antecedentesImportancia,
              resumenClinico: this.notaUrgencias.resumenClinico,
              indicaciones: this.notaUrgencias.indicaciones,
              firmaBase64: this.firmaBase64
            }
          };
          axios(req)
            .then((response) => {
              console.log('4.1.- En guardar NU-- success---->>> pasé ', response.data);
              this.$refs.notify.showNotify("DOCUMENTO GUARDADO", 2);
              this.$store.commit('setSocketNotasUrgencias');
              this.$store.commit('setNotaUrgenciasId', this.notaUrgencias._id);
              this.estaFirmando = false;

            })
            .catch(err => {
              console.log('4.2.- ERROR  al guardar NU-- fail---->>> ', err);
              this.$refs.notify.showNotify("ERROR AL GUARDAR " + err, 5);
            });
        }
      },

    }
  };

</script>

