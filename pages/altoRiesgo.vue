
<template>
  <div>
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <altoRiesgoCmp />

  </div> 
</template>
<script>
  import altoRiesgoCmp from '~/components/altoRiesgoCmp';
  export default {
    name: 'altoRiesgo',
    components: {
      altoRiesgoCmp
    },
    data() {
      return {
        tituloPagina: 'CONSENTIMIENTO INFORMADO DE ALTO RIESGO'
      }
    },
    created() {
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };
    }
  };

</script>
