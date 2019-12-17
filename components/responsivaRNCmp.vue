
<template>
  <div>

    <notifyCmp ref="notify" />
    <b-btn class="bg-success button-right " v-on:click="guardar">GUARDAR</b-btn>
    <b-btn class="bg-success button-right " v-on:click="imprimir">IMPRIMIR</b-btn>


    <table class="table table-sm table-info">
      <tbody>
        <tr>
          <td style="width:20%;">Fecha y hora responsiva:<br />
            <input type="datetime-local" v-model="rrn.fechaFirma" name="fechaFirma">
          </td>
        </tr>

        <tr>
          <td>Nombre recién nacido:<br /><input type="text" class="input-text" v-model="rrn.nombreRN" name="nombreRN" size="40"></td>
          <td style="width:10%;">Fecha y hora de nacimiento:<br /><input type="datetime-local" v-model="rrn.fechaNacimientoRN" name="fechaNacimientoRN"></td>
          <td style="width:15%;">
            Sexo:<br />
            <div>
              <input type="radio" id="mujer" value="M" v-model="rrn.sexoRN">Mujer
              <input type="radio" id="hombre" value="H" v-model="rrn.sexoRN">Hombre
            </div>
          </td>
        </tr>


        <tr>
          <td>Nombre familiar responsable:<input type="text" class="input-text" v-model="rrn.nombreAutoriza" name="nombreAutoriza" size="40"></td>
          <td style="width:15%;">Parentesco:<br /><input type="text" class="input-text" v-model="rrn.parentescoAutoriza" name="parentescoAutoriza" size="25"></td>
        </tr>

        <tr>
          <td>Nombre personal hospitalario que entrega al recién nacido:<input type="text" class="input-text" v-model="rrn.nombreQuienEntregaRN" name="nombreQuienEntregaRN" size="40"></td>
          <td style="width:15%;">Cargo:<br /><input type="text" class="input-text" v-model="rrn.cargoQuienEntregaRN" name="cargoQuienEntregaRN" size="25"></td>
        </tr>


      </tbody>
    </table>

    <div>
      <table class="table table-sm table-info">
        <tbody>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaMadre">FIRMA MADRE</b-btn>
            </td>
            <td id="firmaMadre">
              <p><img v-bind:src="firma(rrn.firmaBase64Madre)" width="300" height="60" /></p>
            </td>
          </tr>

          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaAutoriza">FIRMA RESPONSABLE</b-btn>
            </td>
            <td id="firmaAutoriza">
              <firmaCmp id="firmaX" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              <p><img v-bind:src="firma(rrn.firmaBase64Autoriza)" width="300" height="60" /></p>
            </td>
          </tr>

          
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaQuienEntregaRN"><p>FIRMA PERSONAL <br />ENTREGA <br />RECIEN NACIDO</p></b-btn>
            </td>
            <td id="firmaQuienEntregaRN">
              <p><img v-bind:src="firma(rrn.firmaBase64QuienEntregaRN)" width="300" height="60" /></p>
            </td>
          </tr>

        </tbody>
      </table>
    </div>



  </div>
</template>
<script>

  import axios from 'axios';

  import notifyCmp from '~/components/notifyCmp';
  import firmaCmp from '~/components/firmaCmp';

  import moment from 'moment';
  //require('moment/locale/es');

  export default {
    name: 'responsivaRNCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: '-- CONSTANCIA ALTA VOLUNTARIA--',
        //tituloFirma: '',
        quienFirma: '',
        totalPacientes: 0,
        pacientes: {},
        token: '',
        paciente: {},
        rrn: {},
        firmaBase64: '',
        firmaBase64Back: '',
        firmaBase64Autoriza: '',
        firmaBase64Testigo1: '',
        firmaBase64Testigo2: '',
        estaFirmando: false,
        medicos: {},
      }
    },
    computed: {

      seFirmo: function () {
        console.log('seFirmo()?->' + this.firmaBase64);
        return !(this.firmaBase64 === '');
      }
    },

    watch: {
      seFirmo: function () {

        if (this.seFirmo) {

          this.firmaBase64Back = JSON.parse(JSON.stringify(this.firmaBase64));

          switch (this.quienFirma) {
            case 'AUTORIZA':
              this.rrn.firmaBase64Autoriza = this.firmaBase64Back;
              break;

            case 'MADRE':
              this.rrn.firmaBase64Madre = this.firmaBase64Back;
              break;
            case 'QuienEntregaRN':
              this.rrn.firmaBase64QuienEntregaRN = this.firmaBase64Back;
              break;
            default:
            // code block
          }


          this.estaFirmando = false;
          this.tituloFirma = '';

        }
      },
    },

    created() {
      this.getCurrentPaciente();
      this.getResponsivaRN();

    },

    methods: {
      firma: function (firmaBase64) {
        if (firmaBase64) {
          return "data: image/png;base64," + firmaBase64
        };
        return "no-image.jpg"
      },
      firmaAutoriza: function () {
        //this.tituloFirma = 'FIRMA AUTORIZA'
        this.quienFirma = 'AUTORIZA';
        document.getElementById('firmaAutoriza').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      firmaQuienEntregaRN: function () {
        //this.tituloFirma = 'FIRMA QuienEntregaRN'
        this.quienFirma = 'QuienEntregaRN';
        document.getElementById('firmaQuienEntregaRN').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },

      firmaMadre: function () {
        //this.tituloFirma = 'FIRMA DE MADRE'
        this.quienFirma = 'MADRE';
        document.getElementById('firmaMadre').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },
      
      firmar: function () {
        this.estaFirmando = true;
        this.firmaBase64 = '';
        document.getElementById('btnIniciarFirma').click();
      },

    
      guardar: function () {

        console.log('1111111.- this.rrn= ', this.rrn);

        const req = {
          method: this.rrn.paciente ? 'put' : 'post',
          url: process.env.urlServer + '/responsivaRN/' + this.$store.state.pacienteId,
          headers: {
            token: this.$store.state.token
          },
          data: {

            //////////////////

            
            lugarFirma: 'METEPEC, ESTADO DE MÉXICO',
            fechaFirma: this.rrn.fechaFirma,

            nombreRN: this.rrn.nombreRN,
            sexoRN: this.rrn.sexoRN,
            fechaNacimientoRN: this.rrn.fechaNacimientoRN,

            nombreMadre: this.rrn.nombreMadre,
            firmaBase64Madre: this.rrn.firmaBase64Madre,

            nombreAutoriza: this.rrn.nombreAutoriza,
            parentescoAutoriza: this.rrn.parentescoAutoriza,
            firmaBase64Autoriza: this.rrn.firmaBase64Autoriza,

            nombreQuienEntregaRN: this.rrn.nombreQuienEntregaRN,
            cargoQuienEntregaRN: this.rrn.cargoQuienEntregaRN,
            firmaBase64QuienEntregaRN: this.rrn.firmaBase64QuienEntregaRN,


            //////////////////
          }
        };
        axios(req)
          .then((response) => {
            //console.log('En guardar hie-- success---->>> pasé ', response.data);
            this.$refs.notify.showNotify("DOCUMENTO GUARDADO", 2.5);
            this.$store.commit('setSocketDatosGenerales');

          })
          .catch(err => {
            //console.log('ERROR  al guardar HIE-- fail---->>> pasé ', err.response);
            this.$refs.notify.showNotify("ERROR AL GUARDAR: " + err.response, 2.5);
          });
      },

      getCurrentPaciente: function () {
        console.log('getPaciente');
        axios.get(process.env.urlServer + '/Paciente/' + this.$store.state.pacienteId, {
          token: this.$store.state.token
        })
          .then((response) => {

            this.paciente = response.data.paciente;
            console.log('getPaciente->', this.paciente);
          },
            (error) => {
              this.paciente = {};
              let p = {
                folioCuenta: '',
                nombre: '',
                genero: '',
                fechaNacimiento: '',
                calle: '',
                numeroInterior: '',
                numeroExterior: '',
                colonia: '',
                municipio: '',
                entidad: '',
                pais: '',
                cp: '',
                telefonos: '',
                ////////////////
                // Hoja inicial expediente
                fechaIngreso: '',
                alergias: '',
                diagnosticoIngreso: '',
                otrosDiagnosticos: '',
                tituloMT: '',
                tituloAbrMT: '',
                nombreMT: '',
                cedulaMT: '',
                institucionMT: '',
                especialidadMT: '',

                //////////////////////////
                //// Nota de urgencias
                fecha1: '',
                seguro: '',
                ocupacion: '',
                diagnosticoEgreso: '',
                FC: '',
                FR: '',
                TA: '',
                T: '',
                peso1: '',
                talla1: '',
                antecedentesImportancia1: '',
                resumenClinico1: '',
                indicaciones1: '',

                /////////////////////////
                // Historia clínica
                lugarOrigen: '',
                antHeredoFam: '',
                personalesPato: '',
                personalesNoPato: '',
                ago: '',
                tensionMens: '',
                ritmo: '',
                inicioVidaSexual: '',
                gestados: '',
                partos: '',
                abortos: '',
                cesareas: '',
                fechaUltimpoParto: '',
                fechaUltimoAborto: '',
                pesoProductos: '',
                fechaUltimaRegla: '',
                fechaUltimaCitoCervix: '',
                circuncision: '',
                protecciónMenstrual: '',
                otrosHistoriaClinica: '',
                padecimientoActual: '',
                peso: '',
                talla: '',
                temperatura: '',
                tensionArterial: '',
                craneo: '',
                cara: '',
                fondoOcular: '',
                cuello: '',
                cardioPulmunar: '',
                abdomen: '',
                mamas: '',
                tactoVaginal: '',
                tactoRectal: '',
                miembros: '',
                ID: '',
                TX: '',
                LAB: '',
                USG: '',
                RX: '',
                /////////////////////////
                //Sello
                fechaCreacionSe: '',
                fechaModificacionSe: '',
                situacionSe: 1, //1-activo
                //fechaBorrado: default nada
                usuarioSe: ''//req.usuario._id
              };
            });
      },

      imprimir: function () {
        if (!this.rrn.paciente) {
          this.$refs.notify.showNotify("ANTES DEBES AGREGAR Y GUARDAR LOS DATOS", 4);
          return;
        }
        axios.get(process.env.urlServer + '/msi42/' + this.$store.state.pacienteId, {
          headers: {
            token: this.getToken,
            Accept: 'application/pdf',
            responseType: 'blob'
          }
        })
          .then((response) => {
            console.log('aaquí en imprimir consentiInfo axios y regresó: ', response.data.pdfFile);
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER EL FORMATO", 4, response.data.pdfFile, true);
          },
            (error) => {
              this.err = error.response.data.error;
              //console.log('Error en imprimir Nota Urgencias: ', this.err);
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
            });
      },

      getResponsivaRN: function () {

        axios.get(process.env.urlServer + '/ResponsivaRN/' + this.$store.state.pacienteId, {
          headers: {
            'token': this.$store.state.token
          }
        }).then((response) => {
          this.rrn = response.data.responsivaRN;
          this.rrn.fechaFirma = moment(this.rrn.fechaFirma).format('YYYY-MM-DDTHH:mm');
          this.rrn.fechaNacimientoRN = moment(this.rrn.fechaNacimientoRN).format('YYYY-MM-DDTHH:mm');
          //console.log(this.rrn.fechaFirma);
          console.log('av leido=', this.rrn);
        })
          .catch(err => {
            //this.rrn = { fechaFirma: Date() };
            this.rrn = {};
          });
      }
    }
  }

</script>
