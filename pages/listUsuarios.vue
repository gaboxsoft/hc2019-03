

<template lang="html">
  <div id="main" class="container">

    <div>
      <!--<h1>Estatus: {{userLogin}}</h1>
      <h1>Usuario conectado: {{userLogin.usuario}}</h1>
      <h2>Rol: {{userLogin.usuario}}</h2>
      <h5>email: {{userLogin.usuario}}</h5>-->

      <h1>Nombre: {{userLogin.nombres}}</h1>
      <h2>Rol: {{userLogin.rol}}</h2>
      <h5>email: {{userLogin.email}}</h5>

    </div>
    <div class="row">
      <div class="col-sm-4">
        <h1>Lista Usuarios</h1>
        <ul class="list-group">

          <li v-for="u in usersGet.usuarios" class="list-group-item">
            {{u.email}} {{u.nombres}} {{u.rol}}
          </li>
        </ul>
      </div>
      <div class="col-sm-8">
        <h1>JSON</h1>
        <pre>
                    {{userLogin}}
                    {{usersGet}}
                </pre>
      </div>
    </div>
  </div>


</template>

<script>
  import axios from 'axios';
  var urlUsers = '/usuarios?limite=5&desde=0';
  var urlLogin = '/login';
 
  export default {
    data() {
      return {
        token:'',
        userLogin: '',
        usersGet: ''
      }
    },
    created() {
      this.getLogin(() => {
        this.getUsers(
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

      getUsers: function (next) {
        axios.get(urlUsers, {
          headers: {
            'token': this.token
          }
        }).then((response) => {
          this.usersGet = response.data;
         if(next)  next();
        }).catch(err => console.log('error en getUsuarios:' + err));
      }
    }
  };
</script>
