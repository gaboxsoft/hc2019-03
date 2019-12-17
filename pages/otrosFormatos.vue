
<template>
  <div>
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <div>
      <otrosformatosCmp></otrosformatosCmp>
      

        <!--<div id="app" class="text-primary">
          <fileSelectorCmp max="1" v-model="files">
            <input type="file" class="slotted" />
          </fileSelectorCmp>
        </div>-->


    </div>
  </div>


</template>
<script>
  import otrosformatosCmp from '~/components/otrosformatosCmp';
  //import fileSelectorCmp from '~/components/fileSelectorCmp';
  export default {
    name: 'OtrosFormatos',
    components: {
      //fileSelectorCmp,
      otrosformatosCmp
    },
    data() {
      return {
        tituloPagina: 'ENVIAR OTROS FORMATOS',
        //files: []
      }
    },
    mounted() {

      ;

    },

    created() {
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };
    },
    methods: {

    }
  };

</script>
<style>
  input[type="file"] {
    border: 1px solid yellow;
  }

    input[type="file"].slotted {
      border: 1px solid rebeccapurple;
    }

  .invalid {
    color: red;
  }



  /* Base codepen styles */
  body {
    font-family: Helvetica, Arial;
    background: #f0f0f0;
    color: #555;
    margin: 0;
    line-height: 1.5;
    font-size: 18px;
  }

  .container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .head {
    background: #de6159;
    color: white;
    padding: 85px 0 45px;
    font-size: 22px;
    margin-bottom: 35px;
    text-align: right;
  }

    .head h2 {
      font-weight: normal;
      line-height: 1;
      margin-top: -30px;
    }
</style>
