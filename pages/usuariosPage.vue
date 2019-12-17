
<template>
  <div  id="datosGenerales">
    <h2 class="text-primary text-center">{{tituloPagina}}</h2>
    <usuariosCmp />
    <updateUsuarioCmp />
  </div>
</template>
<script>
  import usuariosCmp from '../components/usuariosCmp';
  import updateUsuarioCmp from '../components/updateUsuarioCmp';
  console.log('pages/usuarios')
  export default {
    name: 'usuarios',
    components: {
      usuariosCmp,
      updateUsuarioCmp
    },
    data() {
      return {
        tituloPagina: 'Lista de Usuarios'
      }
    },
    created() {
      console.log('usuariosPage..created()....');
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };
    }
  };

</script>
