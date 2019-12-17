
<template>
  <div>
    <div class="text-center bg-warning" style=" align-content:center; margin:50px; padding:50px;">
      <h1>S E S I Ó N</h1>
      <h1>C E R R A D A</h1>
    </div>
    <b-dropdown-item class="bg-success text-center" href="/login">ABRIR SESIÓN</b-dropdown-item>
  </div>
</template>

<script>

  export default {
    name: 'logoutCmp',
    computed: {
      Token: {
        get: () => {
          return this.$store.getters.getToken;
        },
        set: (payload) => {
          this.$store.commit('setToken', payload);
        }
      },
      Host: {
        get: () => {
          return this.$store.getters.getHost;
        }
      }
    },
    created() {
      this.logout();
    },
    methods: {
      
      logout() {
        this.$store.commit('setToken', 'NONE');
        this.$store.commit('setPacienteId', 'NONE');
        this.$store.commit('setUsuarioId', 'NONE');
        this.$store.commit('setUsuario', {});
        this.token = 'NONE';
        this.usuarioLogin = {};
      }
      
    }
  };
</script>

