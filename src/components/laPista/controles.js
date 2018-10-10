import React from 'react'
import CorrectoIcon from 'react-icons/lib/fa/check-circle-o'
import IncorrectoIcon from 'react-icons/lib/fa/times-circle-o'
import JugarIcon from 'react-icons/lib/fa/play'
import RefreshIcon from 'react-icons/lib/md/refresh'
import Timer from './components/Timer'
import classnames from 'classnames'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { changePagina } from '../../actions/SettingsActions'
import { isMobile } from 'react-device-detect'
import history from '../../history'

const mapStateToProps = store => ({
  settings: store.settings
})

export default connect(mapStateToProps, { changePagina })(class extends React.Component {
  state = {
    palabra: '',
    pista: '',
    usadas: [],
    tiempo: 60,
    puntaje: 0,
    start: false,
    incorrecto: null
  }

  componentWillMount = async () => {

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
        case 'PALABRA': {
          this.setState({
            palabra: req.payload.palabra,
            pista: req.payload.pista
          })
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
  }

  handleSiguientePalabra = () => {
    this.props.settings.socket.send(JSON.stringify({
      action: 'CORRECTO'
    }))
    this.setState({puntaje: this.state.puntaje+1})
  }

  handleIncorrecto = () => {
    this.props.settings.socket.send(JSON.stringify({
      action: 'INCORRECTO'
    }))
    this.setState({puntaje: this.state.puntaje-1})
  }

  handleStart = () => {
    this.props.settings.socket.send(JSON.stringify({
      action: 'START'
    }))
    this.setState({start: true, puntaje: 0})
  }

  renderMobile = () => 
    <React.Fragment>
      <Grid fluid>
        <Row>
          <Col className="cuadro-palabra-laPista-mobile">
            <span style={{fontSize: `${(-0.2*this.state.palabra.length)+3.8}em`}}><u>{this.state.palabra}</u></span>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="pista-laPista-mobile">
            <span style={{fontSize: `${(-0.2*this.state.palabra.length)+3.8}em`}}>{this.state.pista}</span>
          </Col>
        </Row>
      </Grid>
    <Timer 
      isMobile={isMobile}
      ticking={this.state.start} 
      handleStartChange={this.resetJuego}
      gano={this.state.gano}
    />
    <div className="puntaje-mobile">
      <span>{this.state.puntaje}</span>
    </div>
    {this.state.start ?
    <React.Fragment>
      <div className="boton-incorrecto-mobile" onClick={this.handleIncorrecto}>
        <IncorrectoIcon size={50}/>
      </div>
      <div className="boton-correcto-mobile" onClick={this.handleSiguientePalabra}>
        <CorrectoIcon size={50}/>
      </div>
    </React.Fragment> :
    <React.Fragment>
      <div className="boton-refresh-mobile" onClick={this.handleRefreshPalabras}>
        <RefreshIcon size={50}/>
      </div>
      <div className="boton-correcto-mobile" onClick={this.handleStart}>
        <JugarIcon size={50}/>
      </div>
    </React.Fragment> }
  </React.Fragment> 

  renderDesktop = () => 
  <Grid fluid>
    <Row>
      <Col xs={12} sm={6} style={{padding: 50}}>
        <Grid>
          <Row className="cuadro-palabra-laPista">
            <Col>
              <span><u>{this.state.palabra}</u></span>
            </Col>
          </Row>
          <Row className="pista-laPista">
            <Col xs={12}>
              <span>{this.state.pista}</span>
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
                      isMobile={isMobile}
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
          <Row center='xs'>
            {this.state.start ? 
              <React.Fragment>
                <Col xs={6}>
                  <div className="boton-incorrecto-laPista" onClick={this.handleIncorrecto}>
                    <IncorrectoIcon size={100}/>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="boton-correcto-laPista" onClick={this.handleSiguientePalabra}>
                    <CorrectoIcon size={100}/>
                  </div>
                </Col>
              </React.Fragment> :
              <Col xs={6}>
                <div className="boton-jugar-laPista" onClick={this.handleStart}>
                  <JugarIcon size={100}/>
                </div>
              </Col> 
            }
          </Row>
        </Grid>
      </Col>
    </Row> 
  </Grid>

  render() {
    return (
      <React.Fragment>
        { isMobile ? this.renderMobile() : this.renderDesktop() }
    </React.Fragment>
    )
  }
})