
<template>
  <div>

    <notifyCmp ref="notify" />
    <!--<b-btn class="bg-success button-right " v-on:click="subir">SUBIR</b-btn>-->
    <!--<b-btn class="bg-success button-right " v-on:click="imprimir">IMPRIMIR</b-btn>-->
    <!--<h1>{{titulo}}</h1>-->

    <table class="table table-sm table-info" style="width:80%">
      <tbody>
        <tr>
          <td class="text-left" style="width:10%"><img src="../msiFormatos/msi21-1.jpg" width="100" /><br />CMSI-21 Registro de anestesia:</td>
          <td style="width:25%">
            <fileSelectorCmp :max="3" v-model="msi21Files"><input type="file" class="slotted" /></fileSelectorCmp>
            <b-btn class="bg-success button-right " v-on:click="subir('msi21')">SUBIR</b-btn>
          </td>
          <td>
            <ul>
              <li v-for="img,index in msi21Files">
                <!--{{img.name}}-->
                <!--<img v-bind:src="addHeaderBase64(of.msi21)" width="100" />-->
                <img v-bind:src="addHeaderBase64(of.msi21)" width="100" />
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td class="text-left"><img src="../msiFormatos/msi30-1.jpg" width="100" /><br />CMSI-30 Hoja de Urgencias:</td>
          <td><fileSelectorCmp :max="2" v-model="msi30Files"><input type="file" class="slotted" /></fileSelectorCmp></td>
        </tr>
        <tr>
          <td class="text-left"><img src="../msiFormatos/msi31-1.jpg" width="100" /><br />CMSI-31 Hoja de hospitalización:</td>
          <td><fileSelectorCmp :max="2" v-model="msi30Files"><input type="file" class="slotted" /></fileSelectorCmp></td>
        </tr>

        <tr>
          <td class="text-left"><img src="../msiFormatos/msi32-1.jpg" width="100" /><br />CMSI-32	Hoja quirúrgica:</td>
          <td><fileSelectorCmp :max="2" v-model="msi32Files"><input type="file" class="slotted" /></fileSelectorCmp></td>
        </tr>
        <tr>
          <td class="text-left"><img src="../msiFormatos/msi33-1.jpg" width="100" /><br />CMSI-33	Hoja de terapia intensiva:</td>
          <td><fileSelectorCmp :max="2" v-model="msi33Files"><input type="file" class="slotted" /></fileSelectorCmp></td>
        </tr>

        <tr>
          <td class="text-left"><img src="../msiFormatos/msi40-1.jpg" width="100" /><br />CMSI-40	Historia clínica del recién nacido:</td>
          <td><fileSelectorCmp :max="2" v-model="msi40Files"><input type="file" class="slotted" /></fileSelectorCmp></td>
        </tr>
        <tr>
          <td class="text-left"><img src="../msiFormatos/msi41-1.jpg" width="100" /><br />CMSI-41	Registro clínico de Neonatología:</td>
          <td><fileSelectorCmp :max="2" v-model="msi41Files"><input type="file" class="slotted" /></fileSelectorCmp></td>
        </tr>
      </tbody>
    </table>

    <ul class="files">
      <li v-for="file,index in of.msi21Filess">
        {{index}}{{ file.name }}
      </li>
    </ul>

  </div>
</template>
<script>

  import axios from 'axios';
  import fileSelectorCmp from '~/components/fileSelectorCmp';
  import notifyCmp from '~/components/notifyCmp';


  //require('moment/locale/es');

  export default {
    name: 'otrosFormatosCmp',
    components: {
      notifyCmp,
      fileSelectorCmp
    },
    data() {
      return {
        of: {},
        files: [],
        msi21Files: [],
        msi30Files: [],
        msi31Files: [],
        msi32Files: [],
        msi33Files: [],
        msi40Files: [],
        msi41Files: [],
        tituloPagina: '-- SUBE LOS ARCHIVOS RESPECTIVOS DE CADA FORMATO--',

      }
    },
    computed: {

    },

    watch: {

    },

    created() {


    },

    methods: {
      addHeaderBase64: function (imgBase64) {
        if (imgBase64) {
          return "data: image/png;base64," + imgBase64
        };
        return '';
      },
      subir: function (formato) {
        console.log('en guardar formato: ', formato);

        ///////////////
        //method: this.of.paciente ? 'put' : 'post',
        const req = {
          method: 'put',
          url: process.env.urlServer + '/otrosFormatos/' + formato + '/' + this.$store.state.pacienteId,
          headers: {
            token: this.$store.state.token
          },
          files: this.msi21Files
        };
        
        console.log('REQ.DATA=', req);


        //////////////////
        axios(req).then((response) => {
            console.log('regresé exitósamente de guardar formato ' + formato + '....');
            this.of = response.data.otrosFormatos;
            this.of.msi21FechaSubido = moment(this.of.msi21FechaSubido).format('YYYY-MM-DDTHH:mm');
            console.log('OK leí getProgQuirurgica-//->:');
          })
          .catch(err => {
            //console.log('>>>en getProgQuirurgica-> error', err);

            //this.pq = { fechaFirma: Date() };

            //this.$refs.notify.showNotify("ERROR AL LEER DOCUMENTO"+JSON.stringify(err.Error), 2.5);


            ////this.pq.sitioObtencion = figHumanaBase64;
            ////this.trazos = this.pq.sitioObtencion;
            this.of = {};
            //console.log('hubo err al leer getSolicitudPzas-//->:', this.pq);
          });
      },

      getOtrosFormatos: function () {
        console.log('en getOtrosFormatos->->-> ');

        axios.get(process.env.urlServer + '/getOtrosFormatos/' + this.$store.state.pacienteId, {
          headers: {
            'token': this.$store.state.token
          }
        }).then((response) => {
          console.log('regresé exitósamente de leer la prog quirurgica....');
          this.of = response.data.otrosFormatos;
          this.of.msi21FechaSubido = moment(this.of.msi21FechaSubido).format('YYYY-MM-DDTHH:mm');
          console.log('OK leí getProgQuirurgica-//->:');
        })
          .catch(err => {
            //console.log('>>>en getProgQuirurgica-> error', err);

            //this.pq = { fechaFirma: Date() };

            //this.$refs.notify.showNotify("ERROR AL LEER DOCUMENTO"+JSON.stringify(err.Error), 2.5);


            ////this.pq.sitioObtencion = figHumanaBase64;
            ////this.trazos = this.pq.sitioObtencion;
            this.pq = {};
            //console.log('hubo err al leer getSolicitudPzas-//->:', this.pq);
          });
      }


    }
  }

</script>
