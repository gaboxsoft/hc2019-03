
<template>
  <div>

    <!--<button id="btnDibuja" name="dibujaBtn" v-on:click="cargaImagenInicialEnElCanvas()">MUESTRA FIGURA HUMANA</button>
    <br />-->
    <!--<img id="scream" style="display: none;" src="~/../msiformatos/figuraHumana.png" alt="figuraHumana" height="200">-->
    <!--<br />-->
    <!--<p id="estado"></p>
    <br />-->
    <!--<button id="btnMostrar" name="mostrarBtn" v-on:click="getTrazosFiguraHumana()">MOSTRAR CAPTURA</button>-->

    <div align="center">


      <button id="btnLimpiar" name="limpiarBtn" v-on:click="limpiarTrazos()">LIMPIAR TRAZOS</button>
      <br />
      <canvas id="pizarraX" @mouseleave="mouseLeavePizarra" @mouseover="mouseOverPizarra" style="width: 300px;height: 300px;background-color: black;"></canvas>

      <!--<td>
        <img id="imagenCapturada" src="" width="300" height="300" />
      </td>-->
      <!--<table>
        <tbody>

          <tr>
            <td>
              <textarea class="input-text" style="font-size:12px;" v-model="imgBase64" name="imgBase64" rows="25" cols="210"></textarea>
            </td>
          </tr>
        </tbody>
      </table>-->
      <!--<p>
                IMG64-><br />

              </p>
      -->


    </div>
    <!--style="display: none;"-->
    <img id="imgInicial"  src="~/../msiFormatos/FiguraHumana.png" alt="imgInicial" height="200">


  </div>
</template>
<script>


  export default {
    name: 'trazosCmp',
    components: {

    },
    
    props: ['idCanvas', 'imgBase64Inicial'],
    data() {
      return {
        IdPizarra: '',
        primeraVez: true,
        imgBase64: ''
      }
    },
    computed: {

    },
    watch: {

    },

    created() {

    },
    mounted() {

      // agrega el script que adminstyra los trazos sobre el canvas
      let script = document.createElement('script');
      script.setAttribute('src', 'trazos.js');
      document.head.appendChild(script);

      // Inicializa el componente
      this.inicializaComponente();
    },

    methods: {
      inicializaComponente: function () {
        
        // renombra el Id del canvas 
        var e = document.getElementById("pizarraX");

        console.log('id pizarra: ', JSON.stringify(e),e);
        ////e.id = this.idCanvas;

       
        // Carga la imagen inicial en el elemento imgInicial
        var e = document.getElementById("imgInicial");

        //e.source = "data:image/png;base64," + this.imgBase64Inicial;

        this.cargaImagenInicialEnElCanvas();

      },


      
      cargaImagenInicialEnElCanvas: function () {

        // La imagen inicial que se mostrará en el canvas
        // llega como argumento en imgBase64Inicial
        // y esta en el elemento imgInicial

        var c = document.getElementById(this.idCanvas);
        var ctx = c.getContext("2d");
        var img = document.getElementById("imgInicial");
        ctx.drawImage(img, 0, 0, 300, 300);
      },

      
      getTrazosFiguraHumana() {
        // Obten el elemento idCanvas y obten la imgen en Base64
        var canvas = document.getElementById(this.idCanvas);
        this.imgBase64 = canvas.toDataURL();

        // Quítale la definición de encabezado "data:image/png;base64,"
        this.imgBase64 = this.imgBase64.slice(this.imgBase64.indexOf(',') + 1);

        // Avisa al componente padre que obtuviste algo
        this.$emit('trazosHechos', this.imgBase64);

      },

      limpiarTrazos() {

        // inicializa el conjunto de trazos
        lineas = [];
        this.cargaImagenInicialEnElCanvas();
        this.getTrazosFiguraHumana();
      },


      mouseLeavePizarra() {
        this.getTrazosFiguraHumana();
      },


      mouseOverPizarra() {
        if (this.primeraVez) {
          this.primeraVez = !this.primeraVez;
          this.cargaImagenInicialEnElCanvas();
        }
      }
    }
  }

</script>
