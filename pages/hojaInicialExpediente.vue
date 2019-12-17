
<template>
    <div class="container">
      <hojaInicialExpedienteCmp/>
    </div>
</template>

<script>
  import hojaInicialExpedienteCmp from '~/components/hojaInicialExpedienteCmp';
  import axios from 'axios';
  
  export default {
    name: 'RegistroPaciente',
    components: {
      hojaInicialExpedienteCmp
    },
    created() {
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };

    }
  };
  
</script>
