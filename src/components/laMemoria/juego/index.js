import React from 'react'
import Palabras from './components/Palabras'
import CorrectoIcon from 'react-icons/lib/fa/check-circle-o'
import IncorrectoIcon from 'react-icons/lib/fa/times-circle-o'
import RefreshIcon from 'react-icons/lib/md/refresh'
import JugarIcon from 'react-icons/lib/fa/play'
import Timer from './components/Timer'
import classnames from 'classnames'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { changePagina } from '../../../actions/SettingsActions'
import laMemoriaService from '../../../services/laMemoria'
import Sound from 'react-sound'

const mapStateToProps = store => ({
  settings: store.settings
})

export default connect(mapStateToProps, { changePagina })(class extends React.Component {
  state = {
    palabras: [],
    // La palabra que necesita memorizar para seguir avanzando
    currentPalabra: 0,
    // La palabra que actualmente está diciendo el participante
    currentCuadro: 0,
    contador: 0,
    tiempo: 60,
    gano: false,
    start: false,
    incorrecto: null,
    cargando: false
  }

  fetchPalabras = () => 
    laMemoriaService.palabras(this.props.match.params.palabras)
      .then(res => res.data)
      .then(res => {
        this.setState({palabras: res})
        window.scrollTo(0, document.height - document.getElementById('palabras').offsetTop-10)
      })

  componentWillMount = () => {
    this.fetchPalabras()
    this.props.changePagina({url: this.props.match.url, nombre: 'laMemoria -> Juego'})
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

  handleSiguientePalabra = () => {
    // Verifica se llego a la palabra que necesita para avanzar
    if (this.state.currentCuadro === this.state.currentPalabra) {
      // Se devuelve al principio y se avanza a la siguiente palabra
      this.setState({
        contador: this.state.contador+1,
        currentPalabra: 0,
        currentCuadro: this.state.currentCuadro+1
      })
    } else this.setState({contador: this.state.contador+1, currentPalabra: this.state.currentPalabra+1}) 
    // Verifica si se llego a la ultima palabra
    if (this.state.currentPalabra === this.state.palabras.length-1) {
      // Se define 
      this.setState({
        currentPalabra: this.state.palabras.length,
        currentCuadro: this.state.palabras.length,
        gano: true,
        start: false,
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
      this.setState({cargando: true, contador: 0})
      this.fetchPalabras()
        .then(() =>
        this.setState({
          contador: 0,
          currentPalabra: 0,
          currentCuadro: 0,
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
          <Sound
            url={`/assets/SFX/correcto/${this.state.contador}.mp3`}
            volume={20}
            autoLoad={true}
            playStatus={Sound.status.PLAYING}
          />
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
              <Row center='xs'>
                <Col xs={12}>
                  <Timer 
                  sonido={Sound.status.PLAYING}
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
        </Row>
      </Grid>
    )
  }
})