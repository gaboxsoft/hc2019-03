<template>
  <div id="headerCmp" class="contanier fixed-top margin-bottom:200px">
    <b-navbar class="ml-auto "
              toggleable="md"
              type="dark"
              variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <a class="navbar-brand"
         href="/">
        <img src="~/assets/logoMSI-262x702.png"
             style="width: 100px; ">
      </a>
      <b-collapse is-nav
                  id="nav_collapse">
        <b-navbar-nav>


          <b-nav-item-dropdown text="RECEPCIÓN"
                               right>
            <b-dropdown-item href="/RegistroPaciente">Pacientes</b-dropdown-item>
            <b-dropdown-item href="/ContratoServicios">Contrato Prestación Servicios</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="VALORACIÓN"
                               left>
            <!--<b-dropdown-item disabled href="#">Consentimiento Informado</b-dropdown-item>-->
            <b-dropdown-item href="/hojaInicialExpediente">Hoja Inicial Expediente</b-dropdown-item>
            <b-dropdown-item href="/HistoriaClinica">História Clínica</b-dropdown-item>
            <b-dropdown-item href="/notaUrgencias">Nota de Urgencias</b-dropdown-item>
            <b-dropdown-item href="/CartaConsent">Carta de consentimiento informado</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="CUIDADOS"
                               right>
            <b-dropdown-item disabled href="#">Hoja de Urgencias</b-dropdown-item>
            <b-dropdown-item href="/ordenesMedico">Órdenes Médico </b-dropdown-item>
            <b-dropdown-item disabled href="#">Estudios</b-dropdown-item>
            <b-dropdown-item href="/notaUrgencias">Notas de Urgencia</b-dropdown-item>
            <b-dropdown-item href="/Evolucion">Hoja de Evolución Paciente</b-dropdown-item>
            <b-dropdown-item href="/MedicoTratante">Médicos Tratantes</b-dropdown-item>
            <b-dropdown-item href="/Receta">Recetario</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="HOSPITALIZACIÓN"
                               right>
            <b-dropdown-item href="/ordenesMedico">Órdenes Médico</b-dropdown-item>
            <b-dropdown-item href="/Evolucion">Hoja de Evolución Paciente</b-dropdown-item>
            <b-dropdown-item disabled href="#">Historia Clínica Recién Nacido</b-dropdown-item>
            <b-dropdown-item disabled href="#">Registro Clínico Meonatolgía</b-dropdown-item>
            <b-dropdown-item href="/responsivaRN">Responsiva Mamá - Recién nacido</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="PROC.QUIRÚGICO"
                               right>
            <b-dropdown-item href="/MedicoTratante">Médicos Tratantes</b-dropdown-item>
            <b-dropdown-item href="/ProgQuirurgica">Programación Quirúrgica</b-dropdown-item>
            <b-dropdown-item href="/ConsentimientoInformado">Consentimiento Anestésia</b-dropdown-item>
            <b-dropdown-item href="/AltoRiesgo">Consentimiento Alto Riesgo</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="CIRUGÍA" 
                               right>
            <b-dropdown-item disabled href="#">Registro Anestésia</b-dropdown-item>
            <b-dropdown-item href="SolicitudPiezas">Estudio Piezas Anatomopatológicas</b-dropdown-item>
            <b-dropdown-item href="/ordenesMedico">Órdenes Médico</b-dropdown-item>
            <b-dropdown-item href="/Evolucion">Hoja Evolución Paciente</b-dropdown-item>
            <b-dropdown-item disabled href="#">Hoja Quirúgica</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="EGRESO"
                               right>
            <b-dropdown-item disabled href="#">Por Mejoría</b-dropdown-item>
            <b-dropdown-item href="/AltaVoluntaria ">Voluntario</b-dropdown-item>
            <b-dropdown-item disabled href="#">Por Traslado</b-dropdown-item>
            <b-dropdown-item disabled href="#">Por Defunción</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-show="rol==='ADMIN_ROL'" text="ADMIN" right>
            <b-dropdown-item href="/UsuariosPage">Usuarios</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template slot="button-content">
              <em>Sesión</em>
            </template>
            <b-dropdown-item href="/login">Abrir</b-dropdown-item>
            <b-dropdown-item href="/logout">Cerrar</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <pacienteTagCmp />
  </div>
</template>
<script>

  import pacienteTagCmp from '~/components/pacienteTagCmp';

  import axios from 'axios';
  export default
    {
      name: 'headerCmp',

      components: {
        pacienteTagCmp
      },
      
      data() {
        return {
          rol:''
        }
      },

      computed: {
        getRol () {
          return this.$store.state.usuario.rol;
        }
      },

      watch: {
        getRol() {
          this.rol = this.$store.state.usuario.rol;
        }
      },

      created() {
        this.rol = this.getRol;
      },
      methods: {
        logout() {
          this.$store.commit('setToken', 'NONE');
          this.$store.commit('setPacienteId', 'NONE');
          this.$store.commit('setUsuarioId', 'NONE');
          this.$store.commit('setUsuario', {});
          this.token = 'NONE';
          this.usuarioLogin = usuarioVacio;
          alert('Sesión cerrrada!');
        }
      }
    }
</script>

