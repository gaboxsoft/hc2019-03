
<template>
  <div id="notaUrgencias">
    <h3 class="text-center text-primary">{{tituloPagina}}</h3>
    <!--<table>
      <tbody>
        <tr>
          <td><notasUrgenciasCmp /></td>
          <td><notaUrgenciasCmp /></td>
        </tr>
      </tbody>
    </table>-->
    <div class="row">
      <div class="col-md-6">
        <notasUrgenciasCmp />
      </div>
      <div class="col-md-6">
        <notaUrgenciasCmp />
      </div>
    </div>
  </div>
</template>

<script>
  import notasUrgenciasCmp from '~/components/notasUrgenciasCmp';
  import notaUrgenciasCmp from '~/components/notaUrgenciasCmp';
  export default {
    name: 'NotaUrgencias',
    components: {
      notasUrgenciasCmp,
      notaUrgenciasCmp
    },
    data() {
      return {
        tituloPagina:'Nota de Urgencias'
      }
    },
    created() {
      // No hay sesion abierta, redirige a login
      if (this.$store.state.token === 'NONE') {
        this.$router.push({ name: 'login' })
      };
      this.$store.commit('setNotaUrgenciasId', 'NUEVO');

    }
  };
  
</script>

