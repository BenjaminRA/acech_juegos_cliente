import React from 'react'
import Timer from './components/Timer'
import classnames from 'classnames'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { changePagina } from '../../actions/SettingsActions'
import history from '../../history'

import laPistaService from '../../services/laPista'

const mapStateToProps = store => ({
  settings: store.settings
})

export default connect(mapStateToProps, { changePagina })(class extends React.Component {
  state = {
    palabra: '',
    espacios: [],
    usadas: [],
    pista: '',
    tiempo: 60,
    puntaje: 0,
    start: false,
    mostrar: false
  }

  fetchPalabra = () =>
    laPistaService.palabra(this.state.usadas)
      .then(res => res.data)
      .then(res => {
        this.setState({
          palabra: res.palabra,
          pista: res.pista,
          usadas: this.state.usadas.concat(res.id)
        })
        this.setEspacios()
        this.props.settings.socket.send(JSON.stringify({
          action: 'PALABRA',
          payload: res
        }))
      })

  setEspacios = () => {
    let espacios = []
    while (espacios.length < this.state.palabra.length/2.5) {
      let index = Math.floor(Math.random()*this.state.palabra.length)
      while (espacios.includes(index)) index = Math.floor(Math.random()*this.state.palabra.length)
      espacios.push(index)
    }
    this.setState({espacios})
  }

  componentWillMount = async () => {
    this.fetchPalabra()
    await this.props.changePagina({url: this.props.match.url, nombre: 'laPista -> Juego'})
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
          this.setState({start: true, puntaje: 0})
          break
        }
        case 'CORRECTO': {
          this.handleSiguientePalabra()
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

  resetJuego = async () => {
    this.setState({
      currentPalabra: 0,
      currentCuadro: 0,
      incorrecto: null,
      start: false,
      gano: false
    })
    this.fetchPalabra()
  }

  handleSiguientePalabra = () => {
    this.setState({puntaje: this.state.puntaje+1, mostrar: true, correcto: true})
    setTimeout(() => {
      this.fetchPalabra()
        .then(() => this.setState({mostrar: false, correcto: false}))
    }, 1000);

  }

  handleIncorrecto = () => {
    this.setState({puntaje: this.state.puntaje-1, mostrar: true, incorrecto: true})
    setTimeout(() => {
      this.fetchPalabra()
        .then(() => this.setState({mostrar: false, incorrecto: false}))
    }, 1000);
  }
  
  render() {
    return (
      <Grid fluid> 
        <Row>
          <Col xs={12} sm={6} style={{padding: 50}}>
            <Grid>
              <Row className="cuadro-palabra-laPista">
                {(this.state.palabra.split('')).map((letra, index) => 
                  <Col key={index}>
                    {(this.state.espacios.includes(index) || !this.state.start) && !this.state.mostrar ? 
                    <span style={{fontSize: `${(-0.2*this.state.palabra.length)+3.8}em`}}>_</span> : <span style={{fontSize: `${(-0.2*this.state.palabra.length)+3.8}em`}}>{letra}</span>}
                  </Col>
                )}
              </Row>
              <Row className="pista-laPista">
                <Col xs={12}>
                  {this.state.start ? 
                  <span>{this.state.pista}</span> :
                  <span></span>}
                </Col>
              </Row>
            </Grid>
          </Col>
          <Col xs={12} sm={6}>
            <Grid style={{padding: 50}}>
              <Row center='xs'>
                <Col xs={12}>
                  <Grid>
                    <Row>
                      <Col xs={6}>
                        <Timer 
                          ticking={this.state.start} 
                          handleStartChange={this.resetJuego}
                          gano={this.state.gano}
                        />
                      </Col>
                      <Col xs={6} className={classnames('puntaje', {
                        'correcto': this.state.correcto,
                        'incorrecto': this.state.incorrecto
                      })}>
                        <span>
                          {this.state.puntaje} <br/> Puntos
                        </span>
                      </Col>
                    </Row>
                  </Grid>
                </Col>
              </Row>
            </Grid>
          </Col>
        </Row>
      </Grid>
    )
  }
})