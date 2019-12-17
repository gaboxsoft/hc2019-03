
<template>
  <div>

    <notifyCmp ref="notify" />
    <b-btn class="bg-success button-right " v-on:click="guardar">GUARDAR</b-btn>
    <b-btn class="bg-success button-right " v-on:click="imprimir">IMPRIMIR</b-btn>


    <table class="table table-sm table-info">
      <tbody>
        <tr>
          <td class="text-right">Nombre responsable de programación:</td>
          <td><input type="text" class="input-text" v-model="pq.nombreResponsableProgramacion" name="nombreResponsableProgramacion" size="80"></td>
        </tr>
        <tr>
          <td class="text-right" style="width:25%;">Tipo cirugía:</td>
          <td>
            <div>
              <input type="radio" id="urgente" value="M" v-model="pq.esUrgente">  URGENTE
              <br />
              <input type="radio" id="Programa" value="P" v-model="pq.esUrgente">  PROGRAMADA
            </div>
          </td>
        </tr>

        <tr>
          <td class="text-right">Fecha y hora solicitada:</td>
          <td><input type="datetime-local" v-model="pq.fechaProgramada" name="fechaProgramada"></td>
        </tr>
        <tr>
          <td class="text-right">Médico cirujano:</td>
          <td>
            <select v-model="pq.medicoCirujano">
              <option v-for="mm in paciente.medicos" v-bind:value="mm._id">
                {{ mm.nombre }} - {{mm.especialidad}}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="text-right">Primer ayudante:</td>
          <td>
            <select v-model="pq.medicoAyudante1">
              <option v-for="mm in paciente.medicos" v-bind:value="mm._id">
                {{ mm.nombre }} - {{mm.especialidad}}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="text-right">Segundo ayudante:</td>
          <td>
            <select v-model="pq.medicoAyudante2">
              <option v-for="mm in paciente.medicos" v-bind:value="mm._id">
                {{ mm.nombre }} - {{mm.especialidad}}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="text-right">Anestesiólogo:</td>
          <td>
            <select v-model="pq.medicoAnestesiologo">
              <option v-for="mm in paciente.medicos" v-bind:value="mm._id">
                {{ mm.nombre }} - {{mm.especialidad}}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="text-right">HB:</td>
          <td><input type="text"  class="input-text"  v-model="pq.hb" name="hb" size="20"></td>
        </tr>
        <tr>
          <td class="text-right">HT:</td>
          <td><input type="text" class="input-text"  v-model="pq.ht" name="ht" size="20"></td>
        </tr>
        <tr>
          <td class="text-right">Grupo y RH:</td>
          <td><input type="text" class="input-text"  v-model="pq.gpoRH" name="gpoRH" size="20"></td>
        </tr>
        

        <tr>
          <td class="text-right">Tiempo quirúrgico estimado:</td>
          <td><input type="text" class="input-text"  v-model="pq.tiempoQuirurgico" name="tiempoQuirurgico" size="20"></td>
        </tr>

        <tr>
          <td class="text-right">Material y equipo requerido:</td>
          <td><input type="text" class="input-text"  v-model="pq.materialYEquipo" name="materialYEquipo" size="80"></td>
        </tr>

        <tr>
          <td class="text-right">Operación proyectada:</td>
          <td><input type="text" class="input-text"  v-model="pq.operacionProyectada" name="operacionProyectada" size="80"></td>
        </tr>

        <tr>
          <td class="text-right">Estudios transoperatorios:</td>
          <td><input type="text" class="input-text"  v-model="pq.estudiosTransoperatorios" name="estudiosTransoperatorios" size="80"></td>
        </tr>

        <tr>
          <td class="text-right">Diagnóstico preoperatorio:</td>
          <td><input type="text" class="input-text"  v-model="pq.diagnosticoPreoperatorio" name="diagnosticoPreoperatorio" size="80"></td>
        </tr>

        <tr>
          <td class="text-right">Diagnóstico postoperatorio:</td>
          <td><input type="text" class="input-text"  v-model="pq.diagnosticoPostoperatorio" name="diagnosticoPostoperatorio" size="80"></td>
        </tr>

        <tr>
          <td class="text-right">Operación realizada:</td>
          <td><input type="text" class="input-text"  v-model="pq.operacionRealizada" name="operacionRealizada" size="80"></td>
        </tr>

        <tr>
          <td class="text-right">Tipo de anestesia:</td>
          <td>
            <div>
              <input type="radio" id="local" value="L" v-model="pq.tipoAnestesia">LOCAL
              <br />
              <input type="radio" id="regional" value="R" v-model="pq.tipoAnestesia">REGIONAL
              <br />
              <input type="radio" id="general" value="G" v-model="pq.tipoAnestesia">GENERAL
            </div>
          </td>
        </tr>

        <tr>
          <td class="text-right">Incidentes y hallazgos:</td>
          <td><textarea type="text" class="input-text"  v-model="pq.incidentesYHallazgos" name="incidentesYHallazgos" rows="8" cols="80"></textarea></td>
        </tr>

        <tr>
          <td class="text-right">Descripción de la técnica quirúrgica:</td>
          <td><textarea type="text" class="input-text"  v-model="pq.descripcionTecnica" name="descripcionTecnica" rows="12" cols="80"></textarea></td>
        </tr>

        <tr>
          <td class="text-right">Complicaciones:</td>
          <td><textarea type="text" class="input-text"  v-model="pq.complicaciones" name="complicaciones" rows="4" cols="80"></textarea></td>
        </tr>

        <tr>
          <td class="text-right">Pieza quirúrgica:</td>
          <td><input type="text" class="input-text"  v-model="pq.piezaQuirurgica" name="piezaQuirurgica" size="80"></td>
        </tr>

      </tbody>
    </table>

    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaMedico">FIRMA MÉDICO CIRUJANO</b-btn>
            </td>
            <td id="firmaMedico">
              <firmaCmp id="firmaX" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
              <p><img v-bind:src="firma(pq.firmaBase64MedicoCirujano)" width="300" height="60" /></p>
            </td>
          </tr>
          <tr>
            <td>
              <b-btn class="bg-success" v-on:click="firmaAutorizo">FIRMA PACIENTE O FAMILAR:</b-btn>
            </td>
            <td id="firmaAutorizo">
              <p><img v-bind:src="firma(pq.firmaBase64Autorizo)" width="300" height="60" /></p>
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
    name: 'progQuirurgicaCmp',
    components: {
      notifyCmp,
      firmaCmp,
    },
    data() {
      return {
        tituloPagina: '-- PROGRAMACIÓN QUIRÚRGICA--',
        tituloFirma: '',
        quienFirma: '',

        token: '',
        paciente: {},
        pq: {},
        firmaBase64: '',
        firmaBase64Back: '',
        estaFirmando: false
      }
    },
    computed: {

      seFirmo: function () {
        return !(this.firmaBase64 === '');
      }
    },

    watch: {
      seFirmo: function () {

        if (this.seFirmo) {
          // Para clonar la firma en otro objeto y que no sean la misma referencia
          this.firmaBase64Back = JSON.parse(JSON.stringify(this.firmaBase64));

          //console.log(this.quienFirma, ':[', this.firmaBase64Back, ']');
          switch (this.quienFirma) {
            case 'MEDICO':
              this.pq.firmaBase64MedicoCirujano = this.firmaBase64Back;
              break;
            case 'AUTORIZO':
              this.pq.firmaBase64Autorizo = this.firmaBase64Back;
              break;

            default:
            // code block
          }

          //console.log('EN seFIRMO: ', this.pq.firmaBase64MedicoCirujano);

          this.estaFirmando = false;
          this.tituloFirma = '';

        }
      },
    },

    created() {
      this.getCurrentPaciente();
      this.getProgQuirurgica();

    },

    methods: {
      firma: function (firmaBase64) {
        if (firmaBase64) {
          return "data: image/png;base64," + firmaBase64
        };
        return "no-image.jpg"
      },

      addHeaderBase64: function (imgBase64) {
        if (imgBase64) {
          return "data: image/png;base64," + imgBase64
        };
        return '';
      },

      firmaAutorizo: function () {
        this.quienFirma = 'AUTORIZO';
        document.getElementById('firmaAutorizo').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },

      firmaMedico: function () {
        this.quienFirma = 'MEDICO';
        document.getElementById('firmaMedico').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },

      firmaER: function () {
        this.quienFirma = 'ER';
        document.getElementById('firmaER').appendChild(document.getElementById('firmaX'));
        this.firmar();
      },

      firmar: function () {
        this.estaFirmando = true;
        this.firmaBase64 = '';
        document.getElementById('btnIniciarFirma').click();
      },

      guardar: function () {

        //console.log('0.- this.pq=', this.pq);
        //console.log('0.1.- this.pq.firmaBase64MedicoCirujano=', this.pq.firmaBase64MedicoCirujano);

        const req = {
          method: this.pq.paciente ? 'put' : 'post',
          url: process.env.urlServer + '/ProgQuirurgica/' + this.$store.state.pacienteId,
          headers: {
            token: this.$store.state.token
          },
          data: {
            //////////////////////
            

            esUrgente: this.pq.esUrgente,
            fechaProgramada: this.pq.fechaProgramada,
            nombreResponsableProgramacion: this.pq.nombreResponsableProgramacion,

            hb: this.pq.hb,
            ht: this.pq.ht,
            gpoRH: this.pq.gpoRH,

            tiempoQuirurgico: this.pq.tiempoQuirurgico,
            materialYEquipo: this.pq.materialYEquipo,
            operacionProyectada: this.pq.operacionProyectada,

            estudiosTransoperatorios: this.pq.estudiosTransoperatorios,
            diagnosticoPreoperatorio: this.pq.diagnosticoPreoperatorio,
            diagnosticoPostoperatorio: this.pq.diagnosticoPostoperatorio,
            operacionRealizada: this.pq.operacionRealizada,
            tipoAnestesia: this.pq.tipoAnestesia,

            incidentesYHallazgos: this.pq.incidentesYHallazgos,

            descripcionTecnica: this.pq.descripcionTecnica,
            complicaciones: this.pq.complicaciones,

            piezaQuirurgica: this.pq.piezaQuirurgica,

            medicoCirujano: this.pq.medicoCirujano,
            firmaBase64MedicoCirujano: this.pq.firmaBase64MedicoCirujano,
            medicoAyudante1: this.pq.medicoAyudante1,
            medicoAyudante2: this.pq.medicoAyudante2,
            medicoAnestesiologo: this.pq.medicoAnestesiologo,

            firmaBase64Autorizo: this.pq.firmaBase64Autorizo,


            //////////////////
          }
        };
        //console.log('this.pq=', this.pq.firmaBase64Autorizo);
        //console.log('REQ.DATA=', req.data.firmaBase64Autorizo);

        axios(req)
          .then((response) => {
            this.pq = response.data.progQuirurgica;
            this.pq.fechaProgramada = moment(this.pq.fechaProgramada).format('YYYY-MM-DDTHH:mm');

            this.$refs.notify.showNotify("DOCUMENTO GUARDADO", 2.5);
            this.$store.commit('setSocketDatosGenerales');

          })
          .catch(err => {
            //console.log('ERROR  al guardar HIE-- fail---->>> pasé ', err.response);
            this.$refs.notify.showNotify("ERROR AL GUARDAR: " + err.response, 2.5);

          });
      },

      getCurrentPaciente: function () {

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
        if (!this.pq.paciente) {
          this.$refs.notify.showNotify("ANTES DEBES AGREGAR Y GUARDAR LOS DATOS", 4);
          return;
        }
        axios.get(process.env.urlServer + '/msi20/' + this.$store.state.pacienteId, {
          headers: {
            token: this.getToken,
            Accept: 'application/pdf',
            responseType: 'blob'
          }
        })
          .then((response) => {
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER EL FORMATO", 4, response.data.pdfFile, true);
          },
            (error) => {
              this.err = error.response.data.error;
              //console.log('Error en imprimir Nota Urgencias: ', this.err);
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
            });
      },

      getProgQuirurgica: function () {
        console.log('en getProgQuirurgica->->-> ');

        axios.get(process.env.urlServer + '/ProgQuirurgica/' + this.$store.state.pacienteId, {
          headers: {
            'token': this.$store.state.token
          }
        }).then((response) => {
          console.log('regresé exitósamente de leer la prog quirurgica....');
          this.pq = response.data.progQuirurgica;
          this.pq.fechaProgramada = moment(this.pq.fechaProgramada).format('YYYY-MM-DDTHH:mm');
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
