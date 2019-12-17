
<template>
  <div class="container">
    <div>
      <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    </div>
    <div>
      
      <!--<evolucionCmp />-->
      <medicosTratantesCmp />
    </div>
  </div> 
</template>

<script>
  import medicosTratantesCmp from '~/components/medicosTratantesCmp';
  //import evolucionCmp from '~/components/evolucionCmp';
  
  export default {
    name: 'MedicoTratante',
    components: {
      medicosTratantesCmp,
      //evolucionCmp
    },
    data() {
      return {
        tituloPagina: 'Médicos Tratantes'
      }
    },
    created() {
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };
      //this.$store.commit('setEvolucionId', 'NUEVO');

    }
  }
  
</script>

