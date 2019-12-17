
<template>
  <div>
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <altaVoluntariaCmp />

  </div> 
</template>
<script>
  import altaVoluntariaCmp from '~/components/altaVoluntariaCmp';
  export default {
    name: 'altaVoluntaria',
    components: {
      altaVoluntariaCmp
    },
    data() {
      return {
        tituloPagina: 'CONSTANCIA DE ALTA VOLUNTARIA'
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
