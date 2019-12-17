
<template>
  <!--style="margin-top:100px;"-->
  <div>
    <!--class="col-md-8"-->
    <div>
      <h2 class="text-primary">{{tituloPagina}}</h2>
    </div>
    <notifyCmp ref="notify" />
    <b-btn class="bg-success button-right " v-on:click="guardar">GUARDAR</b-btn>
    <!--<div class="row">
    folio:
    <div class="col-md-2 text-left bg-warning">{{usuario.cedula}}</div>
  </div>-->
    <form action="#">
      <table class="table table-sm table-info">
        <tbody>
          <tr>
            <td style="width:25%;">Cédula:</td>
            <td><input type="text" class="text input-text" v-model="usuario.cedula" name="cedula"></td>
          </tr>
          <tr>
            <td>Nombre:</td>
            <td><input type="text" class="text input-text" v-model="usuario.nombre" name="nombre"></td>
          </tr>
          <tr>
            <td>Título:</td>
            <td><input type="text" class="input-text" v-model="usuario.titulo" name="titulo"></td>
          </tr>

          <tr>
            <td>Abreviación del título:</td>
            <td><input type="text" class="input-text" v-model="usuario.tituloAbr" name="tituloAbr"></td>
          </tr>
          <tr>
            <td>Especialidad:</td>
            <td><input type="text" class="input-text" v-model="usuario.especialidad" name="especialidad"></td>
          </tr>
          <tr>
            <td>Institución:</td>
            <td><input type="text" class="input-text" v-model="usuario.institucion" name="institucion"></td>
          </tr>
          <tr>
            <td>email:</td>
            <td><input type="text" class="input-text" v-model="usuario.email" name="email"></td>
          </tr>
          <tr>
            <td>contraseña:</td>
            <td><input type="password" class="input-text" v-model="usuario.password" name="password"></td>
          </tr>
          <tr>
            <td>Rol:</td>
            <td>
              <div>
                <input type="radio" id="Medico" value="DOCTOR_ROL" v-model="usuario.rol">Médico
                <input type="radio" id="Enfermeria" value="ENFERMERIA_ROL" v-model="usuario.rol">Enfermería
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </form>
    <b-btn class="bg-success" v-on:click="guardar">GUARDAR</b-btn>
    <br />
    <br />
    <br />
    <br />
  </div>
</template>
<script>
  //const urlGetusuarios = process.env.urlServer + '/usuarios?limite=0&desde=0';//'http://localhost:3000/usuarios?limite=0&desde=0';
  //const MAX_SIZE_NOMBRE = 50;
  import axios from 'axios';

  import notifyCmp from '~/components/notifyCmp';
  export default {
    name: 'updateUsuarioCmp',
    components: {
      notifyCmp
    },
    data() {
      return {
        tituloPagina: 'DATOS GENERALES DEL USUARIO',
        usuario: {},
        newUsuario: {}
      }
    },
    computed: {
      getEditingUsuarioId() {
        //console.log('updateUsuarioCmp.computed.getEditingUsuarioId')
        return this.$store.state.editingUsuarioId;
      }
    },
    watch: {
      getEditingUsuarioId() {
        //console.log('updateUsuarioCmp.watch.getEditingUsuarioId')
        // NONE means new
        if (this.$store.state.editingUsuarioId == 'NONE') {
          this.usuario =
            {
              cedula: '',
              nombre: '',
              titulo: '',
              tituloAbr: '',
              especialidad: '',
              institucion: '',
              email: '',
              password: '',
              rol: this.usuario.rol,
            }
        }
        else {
          this.getUsuario();
        }
      }

    },
    created() {
      console.log('updateUsuarioCmp.created..')
      this.getUsuario();
    },


    methods: {
      guardar: function () {
        if (this.usuario.cedula == '' || this.usuario.email == ''
          || this.usuario.nombre == ''||this.usuario.cedula == ''){
          return this.$refs.notify.showNotify("FALTAN ALGUNOS DATOS QUE ESCRIBIR ", 4);
        };

        console.log('1.- guardar:', this.$store.state.editingUsuarioId);
        if (this.$store.state.editingUsuarioId == 'NONE') {
          let jsonObj = {
            cedula: this.usuario.cedula,
            nombre: this.usuario.nombre,
            titulo: this.usuario.titulo,
            tituloAbr: this.usuario.tituloAbr,
            especialidad: this.usuario.especialidad,
            institucion: this.usuario.institucion,
            email: this.usuario.email,
            password: this.usuario.password,
            rol: this.usuario.rol,
          }
          //console.log('2.-jsonObj->titulo', this.usuario.titulo,',', this.usuarioBak.titulo);
          console.log('3.-jsonObj->', jsonObj);

          const req = {
            method: 'post',
            url: process.env.urlServer + '/usuario/',
            headers: {
              token: this.$store.state.token
            },
            data: jsonObj

          };
          axios(req)
            .then((response) => {
              //console.log('En guardar hie-- success---->>> pasé ', response.data);
              this.$refs.notify.showNotify("DOCUMENTO NUEVO GUARDADO", 2.5);
              this.$store.commit('setSocketView');

            })
            .catch(err => {
              console.log('ERROR  al guardar USUARIO-- fail---->>> no pasé ', err); //err.response);
              this.$refs.notify.showNotify("ERROR AL GUARDAR: " + err, 2.5);
            });
        }
        else {

          let jsonObj = {
            cedula: this.usuario.cedula,
            nombre: this.usuario.nombre,
            titulo: this.usuario.titulo,
            tituloAbr: this.usuario.tituloAbr,
            especialidad: this.usuario.especialidad,
            institucion: this.usuario.institucion,
            email: this.usuario.email,
            password: this.usuario.password,
            rol: this.usuario.rol,
          }
          //console.log('2.-jsonObj->titulo', this.usuario.titulo,',', this.usuarioBak.titulo);
          console.log('3.-jsonObj->', jsonObj);

          const req = {
            method: 'put',
            url: process.env.urlServer + '/usuario/' + this.$store.state.editingUsuarioId,
            headers: {
              token: this.$store.state.token
            },
            data: jsonObj

          };
          axios(req)
            .then((response) => {
              //console.log('En guardar hie-- success---->>> pasé ', response.data);
              this.$refs.notify.showNotify("DOCUMENTO GUARDADO", 2.5);
              this.$store.commit('setSocketView');

            })
            .catch(err => {
              console.log('ERROR  al guardar USUARIO-- fail---->>> no pasé ', err); //err.response);
              this.$refs.notify.showNotify("ERROR AL GUARDAR: " + err, 2.5);
            });
        };
      },
      eliminar: function () {
        return true;
      }
      ,
      archiva: () => {
        return true;

      },
      modificar: (usuarioId) => {
        this.$store.commit('setusuarioId', usuarioId)


      },

      addusuario: function () {
        return true;

      },
      getUsuario: function () {
        console.log('updateUsuarioCmp.getUsuario.urlServer->', process.env.urlServer + '/usuario/' + this.$store.state.editingUsuarioId);
        //if () {

        //};
        axios.get(process.env.urlServer + '/usuario/' + this.$store.state.editingUsuarioId, {
          headers: {
            token: this.$store.state.token
          }
        })
          .then((response) => {
            this.usuario = response.data.usuario;
            this.usuarioBak = JSON.parse(JSON.stringify(response.data.usuario));

            console.log('updateUsuarioCmp.getUsuario: ', this.usuario);
            //console.log('response.data en UPDATE_usuariocmp: ', response.data);
            //this.$store.commit('setCurrentusuario', this.usuario);
          },
            (error) => {
              console.log('ERROR: updateUsuarioCmp.getUsuario:  NO EXISTE. ');
              this.err = error.response.data.error;
              //console.log('en Updateusuario->getCurrentusuario->error', this.err);
              //this.$store.commit('setCurrentusuario', undefined);
            });
      },
      //getusuarios: function () {
      //  //console.log(new Date(), '-->en usuariosCmp--> getusuarios--> this.$store.state.token:', this.$store.state.token);
      //  axios.get(urlGetusuarios, {
      //    headers: {
      //      'token': this.$store.state.token
      //    }
      //  }).then((response) => {
      //    this.usuarios = response.data.usuarios;
      //    this.totalusuarios = this.usuarios.length
      //    //console.log('En usuariosCmp-- success---->>> pasé ', new Date(), '--', this.usuarios.length);

      //  })
      //    .catch(err => {
      //      //console.log('---->>> error en Leer la lista de usuarios:' + err);
      //      this.usuario = {};
      //      //console.log('En usuariosCmp-- fail---->>> pasé ', new Date(), '--', this.usuarios.length);
      //    });
      //}

    }
  }

</script>
