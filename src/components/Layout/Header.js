import React from 'react'
import { connect } from 'react-redux'
import { setID, addCliente, deleteCliente, setConectado, deleteConectado } from '../../actions/SettingsActions'
import history from '../../history'

import logo from '../../logo.svg'

const setStateToProps = store => ({
  settings: store.settings
})

export default connect(setStateToProps, { setID, addCliente, deleteCliente, setConectado, deleteConectado })(class extends React.Component {

  componentWillMount = () => {
    this.props.settings.socket.onmessage = req => {
      req = JSON.parse(req.data)
      console.log(req)
      switch (req.action) {
        case 'SET_ID': {
          this.props.setID(req.payload)
          break
        }
        case 'CLIENTE_CONECTADO': {
          this.props.addCliente(req.payload)
          break
        }
        case 'CONECTADO': {
          this.props.setConectado(this.refs.conectar.value)
          break
        }
        case 'CAMBIAR_PAGINA': {
          console.log(history.location.pathname, req.payload)
          if (history.location.pathname !== (req.payload)) {
            history.push(req.payload)
          }
          break
        }
        case 'DESCONECTAR': {
          this.props.deleteConectado()
          break
        }
        case 'SCROLL': {
          window.scrollTo(0, (document.body.clientHeight - document.getElementById('contenido').offsetHeight) + req.payload*((document.body.clientHeight - document.getElementById('contenido').offsetHeight) + window.screen.height))
          break
        }
        case 'DESCONECTAR_CLIENTE': {
          this.props.deleteCliente(req.payload)
          break
        }
        default: {break}
      }
    }
  }

  handleConectar = () => {
    this.props.settings.socket.send(JSON.stringify({
      action: 'CONECTAR',
      payload: {clienteID: this.props.settings.sesionID, sesionID: this.refs.conectar.value}
    }))
  }

  componentWillUnmount = () => {
    this.props.settings.socket.close()
  }

  render () {
    return (
      <header className="App-header">
        {/* <Grid>
          <Row>
            <Col sm={12} mdOffset={2} md={2}>
              <img src={logo} className="App-logo" alt="logo" />
            </Col>
            <Col sm={12} md={4}>
              <h1 className="App-title">{this.props.settings.currentPage.nombre}</h1>
              <h1 className="App-title">ID: {this.props.settings.sesionID}</h1>
              {this.props.settings.clientesID.length > 0 ? 
              <h1 className="App-title">Clientes: {this.props.settings.clientesID.map(cliente => cliente)}</h1> :
              (this.props.settings.conectado ? <h1 className="App-title">Conectado a: {this.props.settings.conectado}</h1> : 
              <div>
                <input ref="conectar"/>
              <button onClick={this.handleConectar}>Conectar</button>
              </div>)}
            </Col>
            <Col sm={12} md={2}>
              <img src={logo} className="App-logo" alt="logo" />
            </Col>
            <Col sm={12} md={2} className="caca">
              <div className="Competencia-header">
                <p> p </p>
                <div>
                  <input ref="competencia"/>
                  <button onClick={this.handleConectar}>Conectar</button>
                </div>
                <span>Iniciar competencia</span>
              </div>
            </Col>
          </Row>
        </Grid> */}
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">{this.props.settings.currentPage.nombre}</h1>
        <h1 className="App-title">ID: {this.props.settings.sesionID}</h1>
        {this.props.settings.clientesID.length > 0 ? 
        <h1 className="App-title">Clientes: {this.props.settings.clientesID.map(cliente => cliente)}</h1> :
        (this.props.settings.conectado ? <h1 className="App-title">Conectado a: {this.props.settings.conectado}</h1> : 
        <div>
          <input ref="conectar"/>
         <button onClick={this.handleConectar}>Conectar</button>
       </div>)}
      </header>
    )
  }
})
