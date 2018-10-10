import axios from 'axios'

export default () => 
  axios.create({
    baseURL: 'http://104.131.104.212:8008/'
  })