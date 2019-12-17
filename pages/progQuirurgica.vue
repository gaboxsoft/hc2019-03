
<template>
  <div>
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <div>
      <progQuirurgicaCmp></progQuirurgicaCmp>
      
    </div>
  </div>


</template>
<script>
  import progQuirurgicaCmp from '~/components/progQuirurgicaCmp';
  export default {
    name: 'progQuirurgica',
    components: {
      progQuirurgicaCmp,
    },
    data() {
      return {
        tituloPagina: 'HOJA DE PROGRAMACIÓN QUIRÚRGICA'
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
