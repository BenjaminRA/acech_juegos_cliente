import React from 'react'
import {Grid, Row, Col} from 'react-flexbox-grid'
import classnames from 'classnames'
import Timer from './components/Timer'

export default class extends React.Component {
  state = {
    letras: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    incorrectas: [],
    correctas: [],
    pasadas: [],
    currrentLetra: 'A',
    start: false,
  }

  

  render() {
    return (
      <div>
        <div className="elRosco">
          {this.state.letras.map((letra, index) => 
            <div key={index} className={classnames(
              'letra-elRosco',
              {'letra-elRosco-correcto': this.state.correctas.includes(letra),
              'letra-elRosco-incorrecto': this.state.incorrectas.includes(letra),
              'letra-elRosco-pasada': this.state.pasadas.includes(letra)
            })} style={{
              left: (window.innerWidth/5) + (window.innerHeight/2.8)*Math.cos((2*Math.PI/this.state.letras.length)*index - Math.PI/2),
              top: (window.innerHeight/3) + (window.innerHeight/2.8)*Math.sin((2*Math.PI/this.state.letras.length)*index - Math.PI/2),
              height: window.innerHeight*.08,
              width: window.innerHeight*.08
            }} onClick={() => this.setState({correctas: !this.state.correctas.includes(letra) ? this.state.correctas.concat(letra) : []})}>
              <p style={{fontSize: window.innerHeight*.05}}>{letra}</p>
            </div>)}
            <Timer 
              ticking={this.state.start} 
              handleStartChange={this.resetJuego}
              gano={this.state.gano}
            />
        </div>
        <Grid>
          <Row end="xs">
            <Col xs={6}>
              aqui va la pista
            </Col>
          </Row>
          <Row end="xs">
            <Col xs={6}>
              aqui va la pista
            </Col>
          </Row>
          <Row end="xs">
            <Col xs={6}>
              aqui va la pista
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}