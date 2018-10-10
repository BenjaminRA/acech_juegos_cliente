import Api from './Api'

export default {
  palabra (usadas) {
    return Api().post('laPista', usadas)
  }
}