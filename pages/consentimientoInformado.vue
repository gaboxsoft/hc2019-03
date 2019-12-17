
<template>
  <div>
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <consentimientoInformadoCmp />

  </div> 
</template>
<script>
  import consentimientoInformadoCmp from '~/components/consentimientoInformadoCmp';
  export default {
    name: 'consentimientoInformado',
    components: {
      consentimientoInformadoCmp
    },
    data() {
      return {
        tituloPagina: 'CARTA DE CONSENTIMIENTO PARA PROCEDIMIENTO ANESTÉSICO'
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
