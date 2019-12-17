<template>
  <section class="main-container">
    <div>

      <a class="navbar-brand" href="#">
        <img src="~/assets/logoMSI-262x702.png" style="width: 500px;">
      </a>

      <br />
      <br />
      <h1 class=" text-primary">
        Archivo Clínico de Pacientes
      </h1>
      <h3 class=" text-info">
        Su uso se restringe sólo al personal autorizado por Médica San Isidro.
      </h3>
      <div class="links">  
        <a class="btn btn-success btn-lg" href="/login" role="button">
          Abre Sesión
        </a>

      </div>
    </div>

    
  </section>
</template>

<script>

  //import Logo from '~/components/Logo.vue'

  export default {
    
  //components: {
  //  Logo
  //  }
}
</script>

<!--<style scoped>



.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
  .main-container {
    /*min-height: 100vh;*/
    /*display: flex;*/
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 90px;
  }
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>-->
