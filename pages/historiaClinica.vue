
<template>
  <div class="container">
    <historiaClinicaCmp />
    
  </div>
</template>

<script>
  import historiaClinicaCmp from '~/components/historiaClinicaCmp';
  import axios from 'axios';
  
  export default {
    name: 'HistoriaClinica',
    components: {
      historiaClinicaCmp
    },
    created() {
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };

    }
  };
  
</script>

