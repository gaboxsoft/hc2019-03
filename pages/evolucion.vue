
<template>
  <div >
    <div>
      <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    </div>
    <div>
      <evolucionCmp />
      <evolucionesCmp />
    </div>
  </div> 
</template>

<script>
  import evolucionesCmp from '~/components/evolucionesCmp';
  import evolucionCmp from '~/components/evolucionCmp';
  
  export default {
    name: 'HojaEvolucion',
    components: {
      evolucionesCmp,
      evolucionCmp
    },
    data() {
      return {
        tituloPagina: 'Hoja de Evolución'
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

