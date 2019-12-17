<template>
  <div>
    <h2 class="text-center text-primary">{{tituloPagina}}</h2>
    <notifyCmp ref="notify" />
    <!--<b-btn class="button-right bg-success" v-on:click="guardar">GUARDAR</b-btn>-->
    <!--<b-btn class="button-right bg-success" v-show="firmaBase64 != ''" v-on:click="imprimir">IMPRIMIR</b-btn>-->
    <b-btn class="button-right bg-success" v-on:click="imprimir">IMPRIMIR</b-btn>
    <firmaCmp id="firma" v-show="estaFirmando" @firmaCapturada="firmaBase64=$event" />
    <b-btn class="bg-success button-right" v-on:click="firmar">GUARDAR</b-btn>

    <br />
    <br />
    <form action="#">
      <table class="table-sm table-hover table-info">
        <tbody>
          <tr>
            <td class="text-right" style="width:25%">Estado civíl: </td>
            <td><input class="input-text" type="text" v-model="paciente.edoCivil" name="edoCivil"></td>
          </tr>
          <tr>
            <td class="text-right">Lugar de Origen:</td>
            <td><input class="input-text" type="text" v-model="paciente.lugarOrigen" name="lugarOrigen"></td>
          </tr>
          <tr>
            <td class="text-right">Antecedentes Heterodofamiliares:</td>
            <td><textarea class="input-text" v-model="paciente.antHeredoFam" name="antHeredoFam" rows="3" cols="50"></textarea></td>
          </tr>
          <tr>
            <td class="text-right">Personales patológicos:</td>
            <td><textarea class="input-text" v-model="paciente.personalesPato" name="personalesPato" rows="3" cols="50"></textarea></td>
          </tr>
          <tr>
            <td class="text-right">Personales NO patológicos:</td>
            <td><textarea class="input-text" v-model="paciente.personalesNoPato" name="personalesNoPato" rows="3" cols="50"></textarea></td>
          </tr>
          <tr>
            <td class="text-right">Género:</td>
            <td>
              <input type="radio" id="hombre" value="H" v-model="paciente.genero">
              Masculino
              <input type="radio" id="mujer" value="M" v-model="paciente.genero">
              Femenino
            </td>
          </tr>

          <tr>
            <td class="rounded" style="background-color:#ffd800" v-show="paciente.genero==='M'" colspan="2">
              <table class="table table-sm table-info">
                <tbody>
                  <tr>
                    <td class="text-right" style="width:25%">Menarca:</td>
                    <td><input class="input-text" type="text" v-model="paciente.menarca" name="menarca"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Tensión menstrual:</td>
                    <td><input class="input-text" type="text" v-model="paciente.tensionMens" name="tensionMens"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Ritmo:</td>
                    <td>
                      <input type="radio" id="regular" value="REGULAR" v-model="paciente.ritmo">
                      Regular
                      <input type="radio" id="irregular" value="IRREGULAR" v-model="paciente.ritmo">
                      Irregular
                    </td>
                  </tr>
                  <tr>
                    <td class="text-right">Inicio vida sexual:</td>
                    <td><input class="input-text" type="text" v-model="paciente.inicioVidaSexual" name="inicioVidaSexual"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Gestados:</td>
                    <td><input class="input-text" type="text" v-model="paciente.gestados" name="gestados"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Partos:</td>
                    <td><input class="input-text" type="text" v-model="paciente.partos" name="partos"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Abortos:</td>
                    <td><input class="input-text" type="text" v-model="paciente.abortos" name="abortos"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Cesareas:</td>
                    <td><input class="input-text" type="text" v-model="paciente.cesareas" name="cesareas"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Fecha Ultimo Parto:</td>
                    <td><input class="input-text" type="text" v-model="paciente.fechaUltimpoParto" name="fechaUltimpoParto"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Fecha Ultimo Aborto:</td>
                    <td><input class="input-text" type="text" v-model="paciente.fechaUltimoAborto" name="fechaUltimoAborto"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Peso Productos:</td>
                    <td><input class="input-text" type="text" v-model="paciente.pesoProductos" name="pesoProductos"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Fecha Ultima Regla:</td>
                    <td><input class="input-text" type="text" v-model="paciente.fechaUltimaRegla" name="fechaUltimaRegla"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Fecha Ultima Citocervix:</td>
                    <td><input class="input-text" type="text" v-model="paciente.fechaUltimaCitoCervix" name="fechaUltimaCitoCervix"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Protección Menstrual:</td>
                    <td><input class="input-text" type="text" v-model="paciente.proteccionMenstrual" name="proteccionMenstrual"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Mamas:</td>
                    <td><input class="input-text" type="text" v-model="paciente.mamas" name="mamas"></td>
                  </tr>
                  <tr>
                    <td class="text-right">Tacto Vaginal:</td>
                    <td><input class="input-text" type="text" v-model="paciente.tactoVaginal" name="tactoVaginal"></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td class="rounded" style="background-color:#4800ff" v-show="paciente.genero==='H'" colspan="2">
              <table class="table table-sm table-info">
                <tbody>
                  <tr>
                    <td class="text-right" style="width:25%">Circuncisión:</td>
                    <td><input class="input-text" type="text" v-model="paciente.circuncision" name="circuncision"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td class="text-right">Otros Historia clínica:</td>
            <td><input class="input-text" type="text" v-model="paciente.otrosHistoriaClinica" name="otrosHistoriaClinica"></td>
          </tr>
          <tr>
            <td class="text-right">Padecimiento Actual:</td>
            <td><input class="input-text" type="text" v-model="paciente.padecimientoActual" name="padecimientoActual"></td>
          </tr>
          <tr>
            <td class="text-right">Peso:</td>
            <td><input class="input-text" type="text" v-model="paciente.peso" name="peso"></td>
          </tr>
          <tr>
            <td class="text-right">Talla:</td>
            <td><input class="input-text" type="text" v-model="paciente.talla" name="talla"></td>
          </tr>
          <tr>
            <td class="text-right">Temperatura:</td>
            <td><input class="input-text" type="text" v-model="paciente.temperatura" name="temperatura"></td>
          </tr>
          <tr>
            <td class="text-right">Tension Arterial:</td>
            <td><input class="input-text" type="text" v-model="paciente.tensionArterial" name="tensionArterial"></td>
          </tr>
          <tr>
            <td class="text-right">Craneo:</td>
            <td><input class="input-text" type="text" v-model="paciente.craneo" name="craneo"></td>
          </tr>
          <tr>
            <td class="text-right">Cara:</td>
            <td><input class="input-text" type="text" v-model="paciente.cara" name="cara"></td>
          </tr>
          <tr>
            <td class="text-right">Fondo Ocular:</td>
            <td><input class="input-text" type="text" v-model="paciente.fondoOcular" name="fondoOcular"></td>
          </tr>
          <tr>
            <td class="text-right">cuello:</td>
            <td><input class="input-text" type="text" v-model="paciente.cuello" name="cuello"></td>
          </tr>
          <tr>
            <td class="text-right">Cardio Pulmunar:</td>
            <td><input class="input-text" type="text" v-model="paciente.cardioPulmunar" name="cardioPulmunar"></td>
          </tr>
          <tr>
            <td class="text-right">Abdomen:</td>
            <td><input class="input-text" type="text" v-model="paciente.abdomen" name="abdomen"></td>
          </tr>
          <tr>
            <td class="text-right">Tacto Rectal:</td>
            <td><input class="input-text" type="text" v-model="paciente.tactoRectal" name="tactoRectal"></td>
          </tr>
          <tr>
            <td class="text-right">Miembros:</td>
            <td><input class="input-text" type="text" v-model="paciente.miembros" name="miembros"></td>
          </tr>
          <tr>
            <td class="text-right" style="width:25%">ID:</td>
            <td><input class="input-text" type="text" v-model="paciente.ID" name="ID"></td>
          </tr>
          <tr>
            <td class="text-right" style="width:25%">TX:</td>
            <td><input class="input-text" type="text" v-model="paciente.TX" name="TX"></td>
          </tr>
          <tr>
            <td class="text-right" style="width:25%">LAB:</td>
            <td><input class="input-text" type="text" v-model="paciente.LAB" name="LAB"></td>
          </tr>
          <tr>
            <td class="text-right" style="width:25%">USG:</td>
            <td><input class="input-text" type="text" v-model="paciente.USG" name="USG"></td>
          </tr>
          <tr>
            <td class="text-right" style="width:25%">RX:</td>
            <td><input class="input-text" type="text" v-model="paciente.RX" name="RX"></td>
          </tr>
        </tbody>
      </table>

    </form>
    <!--<b-btn class="button-right bg-success" v-on:click="guardar">GUARDAR</b-btn>
  <b-btn class="button-right bg-success" v-on:click="imprimir">IMPRIMIR</b-btn>-->
    <br />
    <br />
    <br />
    <br />
  </div>
</template>
<script>
  import axios from 'axios';
  import notifyCmp from '~/components/notifyCmp';
  import firmaCmp from '~/components/firmaCmp';

  export default {
    name: 'historiaClinicaCmp',
    components: {
      notifyCmp,
      firmaCmp
    },
    data() {
      return {
        tituloPagina: 'HISTORIA CLÍNICA',
        estaFirmando: false,
        estaFirmado:false,
        firmaBase64: '',
        /////////////////////////
        // Historia Clínica
        /////////////////////////
        paciente: {
          edoCivil: '',
          lugarOrigen: '',
          antHeredoFam: '',
          personalesPato: '',
          personalesNoPato: '',
          genero: '',
          menarca: '',
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
          proteccionMenstrual: '',
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
          firmaBase64HC:''
        }
      }
    },

    computed: {
      urlGetPaciente: function () {
        return process.env.urlServer + '/paciente/' + this.$store.state.pacienteId;
        //return 'http://localhost:3000/paciente/' + this.$store.state.pacienteId;
      },
      urlHistoriaClinica: function () {
        return process.env.urlServer + '/HistoriaClinica/' + this.$store.state.pacienteId;
        //return 'http://localhost:3000/HistoriaClinica/' + this.$store.state.pacienteId;
      },
      urlHistoriaClinicaPdf: function () {
        return process.env.urlServer + '/msi11/' + this.$store.state.pacienteId;
        //return 'http://localhost:3000/msi11/' + this.$store.state.pacienteId;
      },
      getPaciente: function () {
        return this.$store.state.currentPaciente;
      },
      setPaciente: function () {
        this.$store.commit(this.currentPaciente);
      },
      getToken: function () {
        return this.$store.state.token;
      },
      seFirmo: function () {
        return !(this.firmaBase64 === '');
      },
      
    },

    watch: {
      seFirmo: function () {
        this.guardar();
        this.estaFirmando = false;
      },
    },
    ///////
    created() {
      this.getCurrentPaciente(this.getToken);
      //console.log('EN historiaClinica.Created, Paciente= ', this.Paciente);
    },

    methods: {
      firmar: function () {
        this.estaFirmando = true;
      },
      getCurrentPaciente: function (token) {

        axios.get(this.urlGetPaciente, {
          token: token
        })
          .then((response) => {
            this.paciente = response.data.paciente;
            //console.log('response.data en historia clinica: ', response.data);
            //console.log('paciente en historia clinica: ',this.paciente);
            //this.$store.commit('setCurrentPaciente', this.paciente);
          },
            (error) => {
              this.err = error.response.data.error;
              this.$store.commit('setPacienteId', undefined);
            });
      },
      guardar: function () {
        //console.log('1 En guardar HC-- url---->>>  ', this.urlHistoriaClinica);
        this.token = this.getToken;
        //console.log('2 En guardar hie-- token---->>>  ', this.token);
        const req = {
          method: 'put',
          url: this.urlHistoriaClinica,
          headers: {
            token: this.token
          },
          data: {
            edoCivil: this.paciente.edoCivil,
            lugarOrigen: this.paciente.lugarOrigen,
            antHeredoFam: this.paciente.antHeredoFam,
            personalesPato: this.paciente.personalesPato,
            personalesNoPato: this.paciente.personalesNoPato,
            genero: this.paciente.genero,
            menarca: this.paciente.menarca,
            tensionMens: this.paciente.tensionMens,
            ritmo: this.paciente.ritmo,
            inicioVidaSexual: this.paciente.inicioVidaSexual,
            gestados: this.paciente.gestados,
            partos: this.paciente.partos,
            abortos: this.paciente.abortos,
            cesareas: this.paciente.cesareas,
            fechaUltimpoParto: this.paciente.fechaUltimpoParto,
            fechaUltimoAborto: this.paciente.fechaUltimoAborto,
            pesoProductos: this.paciente.pesoProductos,
            fechaUltimaRegla: this.paciente.fechaUltimaRegla,
            fechaUltimaCitoCervix: this.paciente.fechaUltimaCitoCervix,
            circuncision: this.paciente.circuncision,
            proteccionMenstrual: this.paciente.proteccionMenstrual,
            otrosHistoriaClinica: this.paciente.otrosHistoriaClinica,
            padecimientoActual: this.paciente.padecimientoActual,
            peso: this.paciente.peso,
            talla: this.paciente.talla,
            temperatura: this.paciente.temperatura,
            tensionArterial: this.paciente.tensionArterial,
            craneo: this.paciente.craneo,
            cara: this.paciente.cara,
            fondoOcular: this.paciente.fondoOcular,
            cuello: this.paciente.cuello,
            cardioPulmunar: this.paciente.cardioPulmunar,
            abdomen: this.paciente.abdomen,
            mamas: this.paciente.mamas,
            tactoVaginal: this.paciente.tactoVaginal,
            tactoRectal: this.paciente.tactoRectal,
            miembros: this.paciente.miembros,
            ID: this.paciente.ID,
            TX: this.paciente.TX,
            LAB: this.paciente.LAB,
            USG: this.paciente.USG,
            RX: this.paciente.RX,
            firmaBase64HC:this.firmaBase64
          }
        };
        axios(req)
          .then((response) => {
            //console.log('En guardar HC-- success---->>> pasé ', response.data);
            this.$refs.notify.showNotify("DOCUMENTO GUARDADO", .5);

          })
          .catch(err => {
            //console.log('ERROR  al guardar HC-- fail---->>> ', err.response);
            this.$refs.notify.showNotify("ERROR AL GUARDAR " + err, 5);
          });
      },
      imprimir: function () {

        //console.log('aquí en imprimir HC...', this.urlHistoriaClinicaPdf);

        axios.get(this.urlHistoriaClinicaPdf, {
          headers: {
            token: this.getToken,
            Accept: 'application/pdf',
            responseType: 'blob'
          }
        })
          .then((response) => {
            //console.log('aaquí en imprimir HC axios y regresó: ', response);
            //console.log('aaquí en imprimir HC axios y regresó: ', response.data.pdfFile);
            this.$refs.notify.showNotify("CLICK AQUÍ PARA VER EL FORMATO", 4, response.data.pdfFile, true);
            document.getElementById('notify').focus();
          },
            (error) => {
              this.err = error.response.data.error;
              //console.log('Error en imprimirHojaInicialExpediente: ', this.err);
              this.$refs.notify.showNotify("ERROR AL GENERAR EL FORMATO", 5);
            });
      }
    }
  };

</script>
