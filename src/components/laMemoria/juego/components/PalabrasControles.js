import React from 'react'
import classNames from 'classnames'
import { Grid, Row, Col } from 'react-flexbox-grid'

export default ({ start, mostrarPista, gano, incorrecto, palabras, currentPalabra }) => 
  <div>
    <Grid>
      {palabras.map((palabra, index) =>
        <Row center='xs' style={{padding: 8}} key={index}>
          <Col>
            <div key={index} className={classNames('cuadro-laMemoria', {'cuadro-laMemoria-activo': index === currentPalabra && start,
            'cuadro-laMemoria-correcto': index < currentPalabra,
            'cuadro-laMemoria-incorrecto': (index <= incorrecto && start && incorrecto !== null) || (!start && index < currentPalabra && !gano),
            'cuadro-laMemoria-mostrarPista': index === mostrarPista && start})}>
              <p className='palabra-laMemoria'>{palabra.palabra}</p>
            </div>
          </Col>
        </Row>
      )}
    </Grid>
  </div>