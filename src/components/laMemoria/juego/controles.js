import React from 'react'
import PalabrasControles from './components/PalabrasControles'
import CorrectoIcon from 'react-icons/lib/fa/check-circle-o'
import IncorrectoIcon from 'react-icons/lib/fa/times-circle-o'
import JugarIcon from 'react-icons/lib/fa/play'
import RefreshIcon from 'react-icons/lib/md/refresh'
import classnames from 'classnames'
import Timer from './components/Timer'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { changePagina } from '../../../actions/SettingsActions'
import { isMobile } from 'react-device-detect'
import history from '../../../history'


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
    socketConfig: this.props.settings.socket.onmessage
  }

  componentWillMount = async () => {
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
          case 'PALABRAS': {
            if ((!this.state.gano && this.state.currentPalabra > this.state.currentCuadro) || (this.state.gano)) 
              this.setState({
                palabras: req.payload,
                currentPalabra: 0,
                currentCuadro: 0,
                contador: 0,
                tiempo: 60,
                gano: false,
                start: false,
                incorrecto: null,
                cargando: false
              })
            else this.setState({palabras: req.payload, cargando: false})
            break
          }
          default: {break}
        }
      }
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

  handleStart = () => {
    if ((!this.state.gano && this.state.currentPalabra > this.state.currentCuadro) || this.state.gano) {
      this.setState({cargando: true})
    } else {
      this.setState({start: true, currentPalabra: 0, currentCuadro: 0})
    }
    this.props.settings.socket.send(JSON.stringify({
      action: 'START'
    }))
  }

  handleSiguientePalabra = async () => {
    // Verifica si se llego a la ultima palabra
    if (this.state.currentPalabra === this.state.palabras.length-1) {
      // Se define 
      await this.setState({
        currentPalabra: this.state.palabras.length,
        currentCuadro: this.state.palabras.length,
        contador: this.state.contador+1,
        gano: true,
        start: false,
      })      
    }
    else
      // Verifica se llego a la palabra que necesita para avanzar
      if (this.state.currentCuadro === this.state.currentPalabra) {
        // Se devuelve al principio y se avanza a la siguiente palabra
        await this.setState({
          contador: this.state.contador+1,
          currentPalabra: 0,
          currentCuadro: this.state.currentCuadro+1
        })
      } else await this.setState({contador: this.state.contador+1, currentPalabra: this.state.currentPalabra+1}) 
    this.setState({incorrecto: null})
    this.props.settings.socket.send(JSON.stringify({
      action: 'CORRECTO',
      payload: {
        currentPalabra: this.state.currentPalabra,
        currentCuadro: this.state.currentCuadro,
        contador: this.state.contador,
        gano: this.state.gano
      }
    }))
  }

  handleIncorrecto = () => {
    this.props.settings.socket.send(JSON.stringify({
      action: 'INCORRECTO'
    }))
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

  handleRefreshPalabras = () => {
    this.setState({cargando: true})
    this.props.settings.socket.send(JSON.stringify({
      action: 'REFRESH'
    }))
  }

  render() {
    return (
      <Grid> 
        <Row>
          <Col xs={12} sm={6} style={{padding: 50}}>
            <PalabrasControles 
              palabras={this.state.palabras} 
              currentPalabra={this.state.currentPalabra} 
              incorrecto={this.state.incorrecto}
              mostrarPista={this.state.currentCuadro}
              start={this.state.start}
              gano={this.state.gano}
              />
          </Col>
          {isMobile ? 
          <React.Fragment>
            <Timer 
              isMobile={isMobile}
              ticking={this.state.start} 
              handleStartChange={this.finishJuego}
              countPalabras={(this.state.palabras.length === 0) ? 6 : this.state.palabras.length-2}
              gano={this.state.gano}
            />
            {this.state.start ?
            <React.Fragment>
              <span className="boton-incorrecto-mobile" onClick={this.handleIncorrecto}>
                <IncorrectoIcon size={50}/>
              </span>
              <span className="boton-correcto-mobile" onClick={this.handleSiguientePalabra}>
                <CorrectoIcon size={50}/>
              </span>
            </React.Fragment> :
            <React.Fragment>
              {((!this.state.gano && this.state.currentPalabra > this.state.currentCuadro) || (this.state.gano)) ?
              <span className={classnames('boton-refresh-mobile', {'cargando': this.state.cargando})}
                onClick={this.handleStart}>
                <RefreshIcon size={50}/>
              </span> :
              <React.Fragment>
                <span className={classnames('boton-refresh-mobile', {'cargando': this.state.cargando})}
                onClick={this.handleRefreshPalabras}>
                <RefreshIcon size={50}/>
              </span>
                <span className="boton-correcto-mobile" onClick={this.handleStart}>
                  <JugarIcon size={50}/>
                </span>
              </React.Fragment>
              }
            </React.Fragment> }
          </React.Fragment> :
          <Col xs={12} sm={6}>
            <Grid style={{padding: 50}}>
              <Row center='xs'>
                <Col xs={12}>
                  <Timer 
                    ticking={this.state.start} 
                    handleStartChange={this.finishJuego}
                    countPalabras={(this.state.palabras.length === 0) ? 6 : this.state.palabras.length-2}
                    gano={this.state.gano}
                  />
                </Col>
              </Row>
              <Row center='xs'>
                {this.state.start ? 
                  <React.Fragment>
                    <Col xs={6}>
                      <div className="boton-incorrecto" onClick={this.handleIncorrecto}>
                        <IncorrectoIcon size={'100%'}/>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="boton-correcto" onClick={this.handleSiguientePalabra}>
                        <CorrectoIcon size={'100%'}/>
                      </div>
                    </Col>
                  </React.Fragment> :
                  <Col xs={6}>
                    {((!this.state.gano && this.state.currentPalabra > this.state.currentCuadro) || (this.state.gano)) ? 
                    <div className={classnames('boton-refresh', {'cargando': this.state.cargando})} onClick={() => !this.state.cargando && this.handleStart()}>
                      <RefreshIcon size={'100%'}/>
                    </div> :
                    <div className="boton-jugar" onClick={() => this.handleStart()}>
                      <JugarIcon size={'100%'}/>
                    </div>}
                  </Col> 
                }
              </Row>
            </Grid>
          </Col>
          }
        </Row>
      </Grid>
    )
  }
})