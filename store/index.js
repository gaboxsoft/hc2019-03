
export const state = () => ({
  token: 'NONE',
  pacienteId: 'NONE',

  usuarioId: 'NONE',
  usuario: {},

  notaUrgenciasId: 'NONE',
  evolucionId: 'NONE',
  recetaId: 'NONE',
  ordenesMedicoId: 'NONE',

  editingUsuarioId: 'NONE',

  socketNotasUrgencias: true,
  socketEvolucion: true,
  socketDatosGenerales: true,
  socketView: true,
  huboCambio: true,

  firmaBase64:'',


  host: 'NONE',
  port: 0
});


export const getters = () => ({
  getToken(state) {
    return state.token;
  },
  getNotaUrgenciasId(state) {
    return state.notaUrgenciasId;
  },
  getEvolucionId(state) {
    return state.evolucionId;
  },
  getPacienteId(state) {
    return state.notaUrgenciasId;
  },
  getUsuarioId(state) {
    return state.usuarioId;
  },
  getUsuario(state) {
    return state.Usuario;
  },
  getSocketNotasUrgencias(state) {
    return state.socketNotasUrgencias;
  },
  getSocketDatosGenerales(state) {
    return state.socketDatosGenerales;
  },
  getServer(state) {
    return state.host + ':' + state.port;
  }
});

export const mutations = {
  setToken(state, payload) {
    state.token = payload;
  },
  setNotaUrgenciasId(state, payload) {
    state.notaUrgenciasId = payload;
  },
  setEvolucionId(state, payload) {
    state.evolucionId = payload;
  },
  setPacienteId(state, payload) {
    state.pacienteId = payload;
  },

  setRecetaId(state, payload) {
    state.recetaId = payload;
  },
  setOrdenesMedicoId(state, payload) {
    state.ordenesMedicoId = payload;
  },
  setUsuarioId(state, payload) {
    state.usuarioId = payload;
  },
  setUsuario(state, payload) {
    state.usuario = payload;
  },
  setEditingUsuarioId(state, payload) {
    state.editingUsuarioId = payload;
  },

  setHuboCambio(state) {
    state.huboCambio = !state.huboCambio;
  },

  setSocketNotasUrgencias(state) {
    state.socketNotasUrgencias = !state.socketNotasUrgencias;
  },
  setSocketDatosGenerales(state) {
    state.socketDatosGenerales = !state.socketDatosGenerales;
  },
  setSocketEvolucion(state) {
    state.socketEvolucion = !state.socketEvolucion;
  },
  setSocketView(state) {
    state.socketView = !state.socketView;
  },
  setHost(state, payload) {
    state.host = payload;
  },
  setPort(state, payload) {
    state.port = payload;
  },

  setFirmaBase64(state, payload) {
    console.log('en setFirmaBase64 payload:', payload);
    state.firmaBase64 = payload;
  }
};


