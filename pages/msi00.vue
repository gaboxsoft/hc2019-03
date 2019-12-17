

<template lang="html">
  <div id="main" class="container">

    <h1>Generando el formato MSI-00--> Contrato</h1>
  </div>


</template>

<script>
import axios from 'axios';
var urlGetMsi00Contrato = '/contrato';
var urlLogin = '/login';

export default {
  data() {
    return {
      token: '',
      userLogin: '',
      msi00Contrato: ''
    }
  },
  created() {
    this.getLogin(() => {
      this.getContrato(
        //  () => {
        //  this.print()
        //}
      );

    });

  },
  methods: {



    getLogin: function (next) {
      axios.post(urlLogin, {
        email: 'gabox@msn.com',
        password: '12345'

      }).then((response) => {
        this.userLogin = response.data.usuario;
        this.token = response.data.token;
        next();
      }).catch(err => console.log(err));
    },

    getContrato: function () {
      axios.get(urlGetMsi00Contrato, {
        headers: {
          'token': this.token
        }
      }).then((response) => {
        this.msi00Contrato = response.data;
        console.log('msi00Contrato: ', response.data);
      }).catch(err => console.log('error en getMsi00Contrato:' + err));
    }
  }
};
</script>
