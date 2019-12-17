<template>

  <div class="fixed-bottom footer">
    <span class="bg-info">versión 1.0.2 (2019)</span>
    <span>|</span>
    <span class="bg-info">MÉDICO: {{usuario.nombre}}</span>
    <span>|</span>
    <span class="bg-info">{{usuario.rol}}</span>
  </div>
</template>

<script>
  let axios = require('axios');
  let moment = require('moment');
  moment.locale('es');
  export default
    {
      name: 'footerCmp'
      ,
      data: () => {
        return {
          paciente: {},
          usuario: {},
          drTratante: {}
        }
      },
      computed: {
        getFechaHora: function () {
          axios.get(process.env.urlServer + '/fechaHora', { headers: { token: this.getToken } })
            .then((response) => { return moment(response.data.fechaHora).format('YYYY-MM-ddTHH:mm:ss'); },
              (error) => { this.err = error.response.data.error; return new Date(); });
        },
        //hoy: () => {
        //  //return date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
        //  return getFechaHora();
        //},
        getToken: function () {
          return this.$store.state.token;
        },

        getPacienteId: function () {
          return this.$store.state.pacienteId
        },
        getUsuarioId: function () {
          return this.$store.state.usuarioId;
        }
      },
      watch: {
        getUsuarioId() {
          this.getUsuario();
        }
      },
      created() {
        this.getUsuario();
      },
      methods: {
        getDrTratante: function () {
          this.token = this.getToken;
          console.log('\r\n\r\nDr. Tratante: ', this.paciente.usuarioSe);
          axios.get(process.env.urlServer + '/usuario/' + this.paciente.usuarioSe, {
            headers: {
              token: this.getToken
            }
          })
            .then((response) => {
              this.drTratante = response.data.usuario;
            },
              (error) => {
                this.err = error.response.data.error;
                return { nombre: 'UPPS! no ubico el Médico.' };
              });
        },


        getUsuario: function () {
          this.token = this.getToken;
          if (this.getUsuarioId==='NONE') {
            return this.usuario = {};
          };
          axios.get(process.env.urlServer + '/usuario/' + this.getUsuarioId, {
            headers: {
              token: this.getToken
            }
          })
            .then((response) => {
              this.usuario = response.data.usuario;
              // Lee al paciente
              axios.get(process.env.urlServer + '/paciente/' + this.$store.state.pacienteId, {
                headers: {
                  token: this.getToken
                }
              })
                .then((response) => {
                  this.paciente = response.data.paciente;
                  // Lee a su médico tratante
                  axios.get(process.env.urlServer + '/usuario/' + this.paciente.usuarioSe, {
                    headers: {
                      token: this.getToken
                    }
                  })
                    .then((response) => {
                      this.drTratante = response.data.usuario;
                    },
                      (error) => {
                        this.err = error.response.data.error;
                        return { nombre: 'UPPS! no ubico el Médico.' };
                      });

                },
                  (error) => {
                    this.err = error.response.data.error;
                    return { nombre: 'Abra un expediente.' };
                  });


            },
              (error) => {
                this.err = error.response.data.error;
                return { nombre: 'UPPS! no ubico el usuario.' };
              });
        },
      }
    }
</script>

<style scoped>
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: dodgerblue;
    color: white;
    text-align: center;
  }
</style>
