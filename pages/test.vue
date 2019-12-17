<template>
  <div class="main-contanier">
    <h1>1</h1>
    <h1>2</h1>
    <h1>3</h1>
    <h1>4</h1>
    <h1>5</h1>
    <notifyCmp ref="notify" />
    <p>HOOOLLLAAAA</p>
    <b-btn class="bg-success" v-on:click="mostrarTag">MostrarTag</b-btn>
    <b-btn class="bg-success" v-on:click="mostrarLink">MostrarLink</b-btn>
  </div>
</template>

<script>
import notifyCmp from '~/components/notifyCmp';

export default {
  name: 'test',
  components: {
    notifyCmp
  },
    created() {
      console.log(this.$refs);
    

    },
    methods: {
      mostrarLink: function () {
        console.log('mostrando Link...');
        this.$refs.notify.showNotify("<click> aquí para descargar el archivo ", 3, 'http://localhost:3000/pdfs/MSI14-1549968930641.pdf', true);
      },
      mostrarTag: function () {
        console.log('mostrando texto...');
        this.$refs.notify.showNotify("DOCUMENTO GUARDADO", 2);
      }
    }
}
</script>

<style scoped>
</style>
