
<template>
  <div>
    <firmaCmp />
  </div>

</template>


<script>
  
  import firmaCmp from '~/components/firmaCmp';
  export default {
    name: 'Firma',
    components: {
      firmaCmp
    },
    data() {
      return {
        tituloPagina: 'Firma',
      }
    },
    created() {

      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };
      this.$store.commit('setEvolucionId', 'NUEVO');
    }
  }

</script>

