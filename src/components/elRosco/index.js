import React from 'react'
import {Grid, Row, Col} from 'react-flexbox-grid'
import classnames from 'classnames'

export default class extends React.Component {
  state = {
    letras: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  }

  render() {
    return (
      <div>
        <div className="elRosco">
          {this.state.letras.map((letra, index) => 
            <div key={index} className={classnames(
              'letra-elRosco',
              {'letra-elRosco-correcto': index%2 === 0,
              'letra-elRosco-incorrecto': index%2 !== 0
            })} style={{
              left: (window.innerWidth/2 - 500) + (window.innerHeight/2 - 100)*Math.cos((2*Math.PI/this.state.letras.length)*index - Math.PI/2),
              top: (window.innerHeight/2 + 100) + (window.innerHeight/2 - 100)*Math.sin((2*Math.PI/this.state.letras.length)*index - Math.PI/2),
              height: window.innerHeight*.08,
              width: window.innerHeight*.08
            }}>
              <p style={{fontSize: window.innerHeight*.05}}>{letra}</p>
            </div>)}
        </div>
        <Grid>
          <Row>
            <Col xs={6} xsOffset={6}>
              
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}