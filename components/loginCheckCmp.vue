
<template>
  <div class="container">
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'loginCheckCmp',
   
    created() {
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };

    }
  };

</script>
