
<template>
  <div>

    <div>
      <img id="imgFiguraHumanaDeOrigen" style="display: none;"
           v-bind:src="getBase64ToDisplay(imgBase64Original)"
           alt="imgDeOrigen" height="200">

    </div>
    <div align="center">


      <button id="btnLimpiar"
              name="limpiarBtn"
              v-on:click="limpiarTrazosFiguraHumana()">
        LIMPIAR TRAZOS
      </button>
      <br />
      <canvas id="pizarra"
              @mouseleave="mouseLeavePizarra"
              @mouseover="mouseOverPizarra"
              style="width: 300px;height: 300px;background-color: black;"></canvas>

    </div>
    <!--style="display: none;"-->
    <img id="imgFiguraHumanaLimpia" style="display: none;" src="~/../msiFormatos/FiguraHumana.png" alt="figuraHumana" height="200">

  </div>
</template>
<script>
  import debounce from 'lodash/debounce'
  export default {
    name: 'trazosFiguraHumanaCmp',
    components: {

    },
    props: ['imgBase64Original'],
    data() {

      return {
        primeraVez: true,
        imgBase64: '',


      }
    },
    computed: {

    },
    watch: {

    },

    created() {


    },
    mounted() {

      let script = document.createElement('script');
      script.setAttribute('src', 'figuraHumana.js');
      document.head.appendChild(script);

    },

    // esta chingón. Ejecuta un avez que se estima ya se ha renderizado el DOM 
    updated:
      //function () {
      //  this.mouseOverPizarra();
      //},
      debounce(function () {
      this.$nextTick(() => {
        this.mouseOverPizarra(); // runs only once
      })
    }, 250),
  
  methods: {
    getBase64ToDisplay: function (imgBase64) {
      if (imgBase64) {
        return "data: image/png;base64," + imgBase64
      };
      return "no-image.jpg"
    },

    dibujarImg: function (fuenteImg) {

      var c = document.getElementById("pizarra");
      var ctx = c.getContext("2d");

      var img = document.getElementById(fuenteImg);
      ctx.drawImage(img, 0, 0, 300, 300);
    },

    getTrazosFiguraHumana() {
      var canvas = document.getElementById("pizarra");
      this.imgBase64 = canvas.toDataURL();

      this.imgBase64 = this.imgBase64.slice(this.imgBase64.indexOf(',') + 1);

      this.$emit('trazosHechos', this.imgBase64);
    },

    limpiarTrazosFiguraHumana() {
      lineas = [];
      this.dibujarImg('imgFiguraHumanaLimpia');
      this.getTrazosFiguraHumana();
    },
    mouseLeavePizarra() {
      this.getTrazosFiguraHumana();
    },
    mouseOverPizarra() {
      if (this.primeraVez) {
        this.dibujarImg('imgFiguraHumanaDeOrigen');
        this.primeraVez = !this.primeraVez;
      }

    },


  }
  }

</script>
