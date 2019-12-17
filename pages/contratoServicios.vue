
<template>
  <div  >
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <contratoServiciosCmp />
    
  </div>
</template>
<script>
  import contratoServiciosCmp from '~/components/contratoServiciosCmp';
  export default {
    name: 'contratoServicios',
    components: {
      contratoServiciosCmp
    },
    data() {
      return {
        tituloPagina: 'CONTRATO DE SERVICIOS'
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
