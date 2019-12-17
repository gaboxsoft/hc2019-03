<template>
  <div >
    <headerCmp />
    <nuxt />
    <footerCmp />
  </div>
</template>
<script>

  import headerCmp from '~/components/headerCmp'
  import footerCmp from '~/components/footerCmp'
  export default {
    components: {
      headerCmp,
      footerCmp
    }
  }
</script>
<style>
  body {
    padding: 90px 20px 100px 30px;
    /*margin-top: 90px;*/
    overflow: auto;

    /*margin: 150px,0px,0px,0px;*/
    /*align-items: center;*/
  }
  .textarea-size {
    width: 100%;
  }
  .text {
    width: 100%;
  }
  .input-text {
    text-transform: uppercase
  }
  .button-right {
    float: right;
  }
  .btn-borrar {
    background: #ff0000;
    color: #fff;
    border: none;
    padding: 3px 7px;
    border-radius: 100%;
    cursor: pointer;
    float: right;
  }
  .btn-abrir {
    background: #46ab1c;
    color: #fff;
    border: none;
    padding: 3px 7px;
    border-radius: 50%;
    cursor: pointer;
    float: right;
  }
  /*.notify-container {
    min-height: 100vh;
    
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 5px,5px,5px,5px;
  }*/
  /*.main-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding-top: 40px;
  }*/

</style>

 


<!--html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>-->
