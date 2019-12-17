
<template>
  <div>
    <a ref="linkToDatosGenerales" href="#datosGenerales">ir a Generales</a>
    <!--<no-ssr>-->
    <!--<table class="table table-striped table-bordered table-hover table-info ">-->
    <table class="table table-bordered table-info ">
      <tbody>
        <tr>
          <td>CÉDULA</td>
          <td>ROL</td>
          <td>NOMBRE</td>
          <td>ESPECIALIDAD</td>
          <td>INSTITUCIÓN</td>
        </tr>
        <!--<tr :class="{'bg-warning':p._id===$store.state.pacienteId}" v-model="pacientes"
        v-for="p in pacientes">-->
        <tr :class="{'bg-warning':u._id===$store.state.editingUsuarioId}"
            v-model="usuarios" v-for="u in usuarios">
          <td>{{u.cedula}}</td>
          <td style="width:200px;">{{u.rol}}</td>
          <td>{{u.nombre}}</td>
          <td>{{u.especialidad}}</td>
          <td>{{u.institucion}}</td>
          <td>
            <span><b-btn class="bg-success" btn-xs v-on:click="cambiar(u._id)">*</b-btn></span>
            <span><b-btn class="bg-success" btn-xs v-on:click="agregar">+</b-btn></span>
            <!--<span><b-btn class="bg-success" btn-xs v-on:click="borrar">-</b-btn></span>-->

          </td>
        </tr>
      </tbody>

    </table>
    <!--</no-ssr>-->

  </div>

</template>

<script>
  //const urlGetPacientes = process.env.urlServer + '/usuarios?limite=0&desde=0';//'http://localhost:3000/Pacientes?limite=0&desde=0';
  //const urlGetUsuarios = process.env.urlServer + '/usuarios';
  //const MAX_SIZE_NOMBRE = 50;
  import axios from 'axios';

  export default {
    name: 'usuariosCmp',

    data() {
      return {
        tituloPagina: 'Usuarios',
        usuarios: {},
        totalUsuarios: 0
      }
    },
    computed: {
      getSocketView() {
        return this.$store.state.socketView;
      },

    },
    watch: {
      getSocketView() {
        //console.log('2.--- VALORES USUARIO:', this.usuario);
        //console.log('2.1.--- VALOR:');
        ////console.log('2.1.--- VALOR:', typeof this.usuario, typeof this.usuario.rol, typeof this.usuario.rol,
        ////  (this.usuario !== undefined && this.usuario.rol !== undefined && this.usuario.rol === 'ADMIN_ROL'));
        //if (this.usuario !== undefined && this.usuario.rol !== undefined && this.usuario.rol === 'ADMIN_ROL') {
          this.getUsuarios();
        //}
        //else {
          //this.$refs.notify.showNotify("REQUIERE DE PERMISOS DE ADMINISTRADOR.", 5);
        //}

      }
    },

    created() {
      //this.getUsuario();
      //console.log('1.--- VALORES USUARIO:', this.usuario);
      //console.log('1.1.--- VALOR:');
      ////console.log('1.1.--- VALOR:', typeof this.usuario, typeof this.usuario.rol, typeof this.usuario.rol,
      ////(this.usuario !== undefined && this.usuario.rol !== undefined && this.usuario.rol === 'ADMIN_ROL'));
      //if (this.usuario !== undefined && this.usuario.rol !== undefined && this.usuario.rol==='ADMIN_ROL') {
            this.getUsuarios();
      //}
      //else {
          //this.$refs.notify.showNotify("REQUIERE DE PERMISOS DE ADMINISTRADOR.", 5);
      //}
      console.log('usuariosCmp.created()...');
    },


    methods: {
      //agregar: function () { },
      borrar: function () { },
      //cambiar: function () { },



      cambiar: function (editingUsuarioId) {
        console.log('usuariosCmp.cambiar()->', editingUsuarioId);
        this.$store.commit('setEditingUsuarioId', editingUsuarioId)
        this.$refs.linkToDatosGenerales.click();
        //this.$router.push({ name: 'index' })
        //this.$router.push({ name: 'hojaInicialExpediente' })
        //this.$forceUpdate();
        //this.getPacientes();
      },
      agregar: function () {
        this.$store.commit('setEditingUsuarioId', 'NONE')
        console.log('usuariosCmp.agregar()->', this.$store.state.editingUsuarioId);
        this.$refs.linkToDatosGenerales.click();
        //this.$router.push({ name: 'index' })
        //this.$router.push({ name: 'hojaInicialExpediente' })
        //this.$forceUpdate();
        //this.getPacientes();
      },
      //updatePaciente: (pacienteId) => {
      //  this.seleccionar(pacienteId);
      //  this.getCurrentPaciente(this.getToken);
      //  return true;

      //},
      getUsuarios: function () {
        axios.get(process.env.urlServer + '/usuarios', {
          headers: {
            'token': this.$store.state.token
          }
        }).then((response) => {
          this.usuarios = response.data.usuarios;
          this.totalUsuarios = this.usuarios.length

        })
          .catch(err => {
            this.totalUsuarios = 0;
            this.usuarios = {};
          });
      },
      getUsuario: function () {
        console.log('GET usuario urlServer->', process.env.urlServer + '/usuario/' + this.$store.state.usuarioId)
        axios.get(process.env.urlServer + '/usuario/' + this.$store.state.usuarioId, {
          headers: {
            token: this.$store.state.token
          }
        })
          .then((response) => {
            this.usuario = response.data.usuario;
            //this.usuarioBak = JSON.parse(JSON.stringify(response.data.usuario));

            console.log('SI LO PUDE LEER getUsuario: ', this.usuario);
            //console.log('response.data en UPDATE_usuariocmp: ', response.data);
            //this.$store.commit('setCurrentusuario', this.usuario);
          },
            (error) => {
              console.log('ERROR: NO LO PUDE LEER .getUsuario:  NO EXISTE. ');
              this.err = error.response.data.error;
              this.usuario = { rol: 'NONE' };
              //console.log('en Updateusuario->getCurrentusuario->error', this.err);
              //this.$store.commit('setCurrentusuario', undefined);
            });
      },
    }
  }
</script>

