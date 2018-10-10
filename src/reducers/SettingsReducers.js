const initialSettings = {
  socket: new WebSocket('ws://104.131.104.212:40505'),
  sesionID: null,
  clientesID: [],
  conectado: null,
  currentPage: {
    url: null,
    nombre: null,
  }
}


export default (state = initialSettings, actions) => {
  switch(actions.type) {
    case 'CHANGE_CURRENTPAGE': {
      return {
        ...state,
        currentPage: actions.payload
      }
    }
    case 'SET_ID': {
      return {
        ...state,
        sesionID: actions.payload
      }
    }
    case 'ADD_CLIENTE': {
      return {
        ...state,
        clientesID: state.clientesID.concat(actions.payload)
      }
    }
    case 'DELETE_CLIENTE': {
      let clientes = (state.clientesID).filter(cliente => cliente !== actions.payload)
      return {
        ...state,
        clientesID: clientes
      }
    }
    case 'SET_CONECTADO': {
      return {
        ...state,
        conectado: actions.payload
      }
    }
    case 'DESCONECTAR': {
      return {
        ...state,
        conectado: null
      }
    }
    default: {
      return state
    }
  }
}