
<template>
  <div>
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <cartaConsentCmp />

  </div> 
</template>
<script>
  import cartaConsentCmp from '~/components/cartaConsentCmp';
  export default {
    name: 'cartaConsent',
    components: {
      cartaConsentCmp
    },
    data() {
      return {
        tituloPagina: 'CARTA DE CONSENTIMIENTO INFORMADO'
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
