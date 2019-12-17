
<template>
  <div>
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <div>
      <solicitudPiezasCmp></solicitudPiezasCmp>
      <!--<trazosFiguraHumanaCmp></trazosFiguraHumanaCmp>-->
    </div>
  </div>


</template>
<script>
  import solicitudPiezasCmp from '~/components/solicitudPiezasCmp';
  export default {
    name: 'solicitudPiezas',
    components: {
      solicitudPiezasCmp,
    },
    data() {
      return {
        tituloPagina: 'SOLICITUD ESTUDIO Y DISPOSICIÓN DE PIEZAS ANATOMOPATOLÓGICAS'
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
