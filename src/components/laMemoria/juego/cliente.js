import React from 'react'
import Palabras from './components/Palabras'
import Timer from './components/Timer'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { changePagina } from '../../../actions/SettingsActions'
import history from '../../../history'
import Sound from 'react-sound'

import laMemoriaService from '../../../services/laMemoria'

const mapStateToProps = store => ({
  settings: store.settings
})

export default connect(mapStateToProps, { changePagina })(class extends React.Component {
  state = {
    palabras: [],
    currentPalabra: 0,
    currentCuadro: 0,
    contador: 0,
    tiempo: 60,
    gano: false,
    start: false,
    incorrecto: null,
    socketConfig: this.props.settings.socket.onmessage,
    bug: true
  }

  fetchPalabras = () =>
    laMemoriaService.palabras(this.props.match.params.palabras)
      .then(res => res.data)
      .then(res => {
        console.log(this.props.match.params.palabras)
        this.setState({palabras: res})
        this.props.settings.socket.send(JSON.stringify({
          action: 'PALABRAS',
          payload: res
        }))
      })

  finishJuego = (gano) => {
    this.setState({
      incorrecto: null,
      currentPalabra: gano ? 0 : this.state.currentCuadro + 1,
      currentCuadro: 0,
      start: gano,
      gano: false
    })
  }
  componentWillMount = async () => {
    this.fetchPalabras()
    await this.props.changePagina({url: this.props.match.url, nombre: 'laMemoria -> Juego'})
    setTimeout(() => 
      this.props.settings.socket.send(JSON.stringify({
        action: 'ENTRAR_A_JUEGO',
        payload: this.props.match.url
      })), 50)
    this.props.settings.socket.onmessage = req => {
      req = JSON.parse(req.data)
      switch (req.action) {
        case 'CLIENTE_CONECTADO': {
          this.props.addCliente(req.payload)
          break
        }
        case 'CONECTADO': {
          this.props.setConectado(this.refs.conectar.value)
          break
        }
        case 'CAMBIAR_PAGINA': {
          if (history.location.pathname !== (req.payload)) {
            history.push(req.payload)
          }
          break
        }
        case 'START': {
          this.handleStart()
          break
        }
        case 'CORRECTO': {
          this.handleSiguientePalabra(req.payload.currentPalabra, req.payload.currentCuadro, req.payload.contador, req.payload.gano)
          break
        }
        case 'INCORRECTO': {
          this.handleIncorrecto()
          break
        }
        case 'REFRESH': {
          this.fetchPalabras()
          break
        }
        default: {break}
      }
    }
  }

  componentWillUnmount = () => {
    this.props.settings.socket.onmessage = this.state.socketConfig
  }

  finishJuego = (gano) => {
    this.setState({
      incorrecto: null,
      currentPalabra: gano ? 0 : this.state.currentCuadro + 1,
      currentCuadro: 0,
      start: gano,
      gano: false
    })
  }

  handleSiguientePalabra = (currentPalabra, currentCuadro, contador, gano) => {
    this.setState({currentPalabra, currentCuadro, contador})
    if (gano) {
      // Se define 
      this.setState({
        currentPalabra: this.state.palabras.length,
        currentCuadro: this.state.palabras.length,
        gano: true,
        start: false
      }) 
    } 
    this.setState({incorrecto: null})
  }

  handleIncorrecto = () => {
    this.setState({incorrecto: this.state.currentPalabra, currentPalabra: 0, contador: this.state.contador - this.state.currentPalabra})
    setTimeout(() => {
      this.setState({incorrecto: null})
    }, 1000)
  }

  handleMostrarPista = () => {
    const index = this.state.currentCuadro
    this.setState({currentCuadro: null})
    setTimeout(() => {
      this.setState({currentCuadro: index})
    }, 20)
  }

  handleStart = () => {
    if ((!this.state.gano && this.state.currentPalabra > this.state.currentCuadro) || this.state.gano) {
      this.setState({currentPalabra: 0, currentCuadro: 0, contador: 0})
      this.fetchPalabras()
        .then(() =>
        this.setState({
          currentPalabra: 0,
          currentCuadro: 0,
          contador: 0,
          tiempo: 60,
          gano: false,
          start: false,
          incorrecto: null,
          cargando: false
        }))
    } else {
      this.setState({start: true})
    }
  }

  render() {
    return (
      <Grid> 
        <Row>
          {/* <Sound
            url={`/assets/SFX/correcto/${this.state.contador}.mp3`}
            volume={20}
            autoLoad={true}
            playStatus={Sound.status.PLAYING}
          /> */}
          <Col xs={12} sm={6} style={{padding: 50}}>
            <Palabras 
              palabras={this.state.palabras} 
              currentPalabra={this.state.currentPalabra} 
              incorrecto={this.state.incorrecto}
              mostrarPista={this.state.currentCuadro}
              start={this.state.start}
              gano={this.state.gano}
              />
          </Col>
          <Col xs={12} sm={6}>
            <Grid style={{padding: 50}}>
              <Row>
                <Col xs={12}>
                  <Timer 
                    sonido={Sound.status.PLAYING}
                    ticking={this.state.start} 
                    handleStartChange={this.finishJuego}
                    countPalabras={(this.state.palabras.length === 0) ? 8 : this.state.palabras.length}
                    gano={this.state.gano}
                  />
                </Col>
              </Row>
            </Grid>
          </Col>
        </Row>
      </Grid>
    )
  }
})