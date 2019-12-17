
<template>
  <div>
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <responsivaRNCmp />

  </div> 
</template>
<script>
  import responsivaRNCmp from '~/components/responsivaRNCmp';
  export default {
    name: 'responsivaRN',
    components: {
      responsivaRNCmp
    },
    data() {
      return {
        tituloPagina: 'RESPONSIVA ALOJAMIENTO MAMÁ-RECIÉN NACIDO'
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
