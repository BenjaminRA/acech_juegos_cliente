import Api from './Api'

export default {
  temas () {
    return Api().get('laMemoriaTemas')
  },

  palabras (tema) {
    return Api().get(`laMemoriaPalabras/${tema}`)
  }
}