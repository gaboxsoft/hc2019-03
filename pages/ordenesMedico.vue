
<template>
  <div class="container">
    <div>
      <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    </div>
    <div>
      <ordenesMedicoCmp />
      <ordenesMedicosCmp />
    </div>
  </div> 
</template>

<script>
  import ordenesMedicosCmp from '~/components/ordenesMedicosCmp';
  import ordenesMedicoCmp from '~/components/ordenesMedicoCmp';
  
  export default {
    name: 'ordenesMedico',
    components: {
      ordenesMedicoCmp,
      ordenesMedicosCmp
    },
    data() {
      return {
        tituloPagina: 'Ordenes Medicas'
      }
    },
    created() {
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };
      this.$store.commit('setOrdenesMedicoId', 'NUEVO');

    }
  }
  
</script>

