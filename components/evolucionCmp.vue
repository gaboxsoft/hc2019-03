
<template>
  <div class="main-container">
    <!--<h1 class=" text-primary">{{tituloPagina}}</h1>-->
    <!--<b-btn class="bg-success" v-on:click="imprimir">IMPRIMIR</b-btn>-->
    <notifyCmp ref="notify" />
    <b-btn class="bg-success button-right" v-show="estaFirmando!=true" v-on:click="firmar">GUARDAR</b-btn>

    
     
        <table class="table table-sm table-bordered table-info ">
          <tbody>
            <tr>
              <td style="width:10%;">FECHA-HORA</td>
              <td>
                EVOLUCIÓN
              </td>
              <td>
                FIRMA
              </td>
            </tr>
            <tr>
              <td>
                <input type="datetime-local" v-model="evolucion.fecha" name="fecha">
              </td>
              <td>
                <!-- cols="50" rows="2" -->
                <textarea class="input-text textarea-size" type="text" v-model="evolucion.descripcion" name="descripcion"></textarea>
              </td>
              <td width="20%">
                <firmaCmp id="firma" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              </td>
              <!--<b-btn class="bg-success " v-on:click="guardar">GUARDAR</b-btn>-->
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
    name: 'evolucionCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: 'NOTA DE EVOLUCIÓN',
        estaFirmando: false,
        firmaBase64: '',

        paciente: {},
        evolucion: {},
        evolucionNuevo: {
          _id: 'NUEVO',
          fecha: moment(),
          descripcion: '',
          firmaBase64: ''
        }
      }
    },

    computed: {
      urlApiEvolucion: function () {
        return process.env.urlServer + '/Evolucion/';
        //return 'http://localhost:3000/Evolucion/';
      },
      urlGetPaciente: function () {
        return process.env.urlServer + '/Paciente/' + this.$store.state.pacienteId;
        //return 'http://localhost:3000/paciente/' + this.$store.state.pacienteId;
      },
      urlGetEvolucion: function () {
        return process.env.urlServer + '/Evolucion/' + this.$store.evolucionId;
        //return 'http://localhost:3000/Evolucion/' + this.$store.evolucionId;
      },
      urlHojaEvolucionPdf: function () {
        return process.env.urlServer + '/msi14/' + this.$store.state.pacienteId;
        //return 'http://localhost:3000/msi14/' + this.$store.state.pacienteId;
      },
      getEvolucionId: function () {
        return this.$store.state.evolucionId;
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
      if (this.seFirmo) {
        this.guardar();
        return;
      }
      this.firmar();
      
    },
    getEvolucionId: function () {
      console.log('notasUrgenciasCmp->Watch->getNotaUrgenciasId->', this.getEvolucionId)

      this.getCurrentPaciente(this.getToken);
      console.log(this.getEvolucionId || 'no existe evolucionId');
      if (!this.getEvolucionId || this.getEvolucionId === 'NUEVO' || this.getEvolucionId === 'NONE' || this.getEvolucionId === '') {
        console.log('AGREGANDO NUEVA NOTA DE Evolucion...2');
        this.InicializaEvolucion();
        this.$store.commit('setEvolucionId', 'NUEVO');
        console.log('this.evolucion->despues de inciarlo2', this.evolucion.fecha);
      }
      else {
        console.log('EvolucionCmp->created()->getEvolucionId->', this.getEvolucionId)
        this.getEvolucion();
      }

    }
  },
  created() {

    //this.getCurrentPaciente(this.getToken);
    if (!this.getEvolucionId || this.getEvolucionId === 'NUEVO' || this.getEvolucionId === 'NONE' || this.getEvolucionId === '') {
      console.log('AGREGANDO NUEVA NOTA DE Evolucion...1');
      this.InicializaEvolucion();
      console.log('this.evolucion->despues de inciarlo1', this.evolucion);
      this.$store.commit('setEvolucionId', 'NUEVO');
    }
    else {
      console.log('EvolucionCmp->created()->getEvolucionId->', this.getEvolucionId)
      this.getEvolucion();
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
        .then((response) => { return moment(response.data.fechaHora).format('YYYY-MM-ddTHH:mm:ss'); },
          (error) => { this.err = error.response.data.error; return new Date(); });
    },

    InicializaEvolucion: function () {
      console.log(this.evolucion);
      this.evolucion._id = 'NUEVO';
      this.evolucion.fecha = moment(this.getFechaHora()).format('YYYY-MM-ddTHH:mm');
      this.evolucion.descripcion = '';
      this.getEvolucion.firmaBase64 = '';
      console.log(this.evolucion);
    },
    getEvolucion: function () {
      //////if (this.$store.state.evolucionId === 'NUEVO') {
      //////  return this.evolucion = this.evolucionNuevo;
      //////}
      ////console.log('--1.- en EvolucionCmp->urlGetEvolucion->', this.urlGetEvolucion);
      //////console.log('--1.1.- en NotasUrgenciasCmp->Token->', this.getToken);
      //////console.log('--1.2.- en NotasUrgenciasCmp->Token->', this.$store.state.pacienteId);
      ////console.log('--1.3.- en EvolucionCmp->urlEvolucion->', this.urlApiEvolucion + this.$store.state.evolucionId);
      ////console.log('--1.4.- en EvolucionCmp->notaEvolucionId->', this.$store.state.evolucionId);
      //////axios.get(this.urlGetNotasUrgencias, {
      axios.get(process.env.urlServer + '/Evolucion/' + this.$store.state.evolucionId, {
        //token: token
        headers: {
          token: this.getToken
        }
      })
        .then((response) => {
          //console.log('ojo 22.-response.data en Evolucion: ', response.data);
          this.evolucion = response.data.evolucion;
          console.log('fecha de GET evolución->', this.evolucion);
          this.evolucion.fecha = moment(this.evolucion.fecha).format('YYYY-MM-DDTHH:mm:ss');
          //this.evolucion.fecha = this.evolucion.fecha.toISOString().replace(/T/, ' ').replace(/\..+/, '');

        },
          (error) => {
            this.err = error;
            //console.log('23.-ERROR response.data en get evoluvion: ');
            this.$store.commit('setEvolucionId', 'NUEVO');
            //this.$store.commit('setEvolucionId', undefined);
            this.InicializaEvolucion();
          });
    },

    getCurrentPaciente: function () {
      //console.log('this.urlGetPaciente getcurrentPaciente._>', this.urlGetPaciente);
      axios.get(this.urlGetPaciente, {
        token: this.getToken
      })
        .then((response) => {
          this.paciente = response.data.paciente;
          //console.log('paciente en getCurrentPaciente: ', this.paciente);

          console.log('getCurrentPaciente: OK');

        },
          (error) => {
            console.log('error en getCurrentPaciente:-->', error);
            this.err = error;
            //this.$store.commit('setPacienteId', undefined);
          });
    },
    guardar: function () {

      if (this.evolucion.descripcion.trim() === '') {
        this.$refs.notify.showNotify("ESCRIBE ALGO....", .25);
        return;
      }

      //console.log('1 En guardar Evol-- url---->>>  ', this.urlApiEvolucion + this.$store.state.evolucionId);
      //this.token = this.getToken;
      ////this.evolucion.fecha = this.evolucion.fecha.split('.')[0];
      ////console.log('2 En guardar NU-- token---->>>  ', this.token);
      //console.log('2.1.- fecha de Evolucion-> ', this.evolucion.fecha)
      //console.log('2.1.1.- fecha de Evolucion-> ', moment(this.evolucion.fecha).format('DD-MM-YYYYTHH:mm:ss'));
      //console.log('2.2.- nuevo->EvolucionId  ', this.$store.state.evolucionId);


      if (this.$store.state.evolucionId === 'NUEVO') {
        const req = {
          method: 'post',
          url: this.urlApiEvolucion + this.$store.state.pacienteId,
          headers: {
            token: this.getToken
          },
          data: {
            fecha: moment(this.evolucion.fecha).format(),
            descripcion: this.evolucion.descripcion.trim(),
            paciente: this.$store.state.pacienteId,
            firmaBase64: this.firmaBase64
          }
        };

        axios(req)
          .then((response) => {
            //console.log("existe-->",response.data);
            //console.log('3.1.-En guardar NUEVO  evol-- success---->>> pasé ', response.data.evolucion);

            //this.evolucion = response.data.evolucion;
            //this.$refs.notify.showNotify("DOCUMENTO NUEVO GUARDADO", 2);

            //this.$store.commit('setEvolucionId', this.evolucion._id);
            this.evolucion = {};
            this.InicializaEvolucion()
            this.$store.commit('setEvolucionId', 'NUEVO');
            this.$store.commit('setSocketEvolucion');
            //this.$refs.notify.showNotify("GUARDADO ", 3);
            this.estaFirmando = false;
          })
          .catch(err => {
            //console.log('3.2.-ERROR  al guardar NUEVO  evol-- fail---->>> ', err);
            this.$refs.notify.showNotify("ERROR AL GUARDAR " + err, 5);
          });
      }
      else {
        const req = {
          method: 'put',
          url: this.urlApiEvolucion + this.$store.state.evolucionId,
          headers: {
            token: this.getToken
          },
          data: {
            fecha: this.evolucion.fecha,
            descripcion: this.evolucion.descripcion,
            firmaBase64: this.firmaBase64
          }
        };
        axios(req)
          .then((response) => {
            //console.log('4.1.- En guardar evol-- success---->>> pasé ', response.data);
            //this.$refs.notify.showNotify("DOCUMENTO GUARDADO", 2);
            this.$store.commit('setSocketEvolucion');
            this.$store.commit('setEvolucionId', this.evolucion._id);
            this.estaFirmando = false;

          })
          .catch(err => {
            //console.log('4.2.- ERROR  al guardar evol-- fail---->>> ', err);
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
