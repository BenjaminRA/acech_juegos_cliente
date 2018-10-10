import Api from './Api'

export default {
  juegos () {
    return Api().get('juegos')
  }
}