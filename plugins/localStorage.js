import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    storage: window.sessionStorage
  })(store)
}

//export default ({ store }) => {
//  createPersistedState({
//    key: 'yourkey',
//    paths: [...]
//      ...
//  })(store)
//}
