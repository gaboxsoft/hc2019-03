
<template>
  <div class="container">
    <div>
      <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    </div>
    <div>
      <recetaCmp />
      <recetasCmp />
    </div>
  </div> 
</template>

<script>
  import recetasCmp from '~/components/recetasCmp';
  import recetaCmp from '~/components/recetaCmp';
  
  export default {
    name: 'receta',
    components: {
      recetaCmp,
      recetasCmp
    },
    data() {
      return {
        tituloPagina: 'Recetario'
      }
    },
    created() {
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };
      this.$store.commit('setRecetaId', 'NUEVO');

    }
  }
  
</script>

