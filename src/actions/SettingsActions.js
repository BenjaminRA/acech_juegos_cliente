export const setID = id => dispatch => {
  return dispatch({
    type: 'SET_ID',
    payload: id
  })
}

export const addCliente = id => dispatch => {
  return dispatch({
    type: 'ADD_CLIENTE',
    payload: id
  })
}

export const deleteCliente = id => dispatch => {
  return dispatch({
    type: 'DELETE_CLIENTE',
    payload: id
  })
}

export const setConectado = id => dispatch => {
  return dispatch({
    type: 'SET_CONECTADO',
    payload: id
  })
}

export const deleteConectado = () => dispatch => {
  return dispatch({
    type: 'DESCONECTAR'
  })
}

export const changePagina = pagina => dispatch => {
  return dispatch({
    type: 'CHANGE_CURRENTPAGE',
    payload: pagina
  })
}