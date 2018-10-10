import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { changePagina } from '../../actions/SettingsActions'

import juegosService from '../../services/juegos'

const mapStateToProps = store => ({
  settings: store.settings
})

export default connect(mapStateToProps, { changePagina })(class extends React.Component {

  state = {
    juegos: []
  }

  handleClick = juego => {
    // if(juego !== 'laMemoria') {
    //   if (this.props.settings.conectado) {
    //     this.props.history.push(juego + '/controles')
    //   } else if (this.props.settings.clientesID.length > 0) {
    //     this.props.history.push(juego + '/cliente')
    //   } else this.props.history.push(juego)
    // }
    // else this.props.history.push(juego)
    if(juego !== 'laMemoria') {
      if (this.props.settings.conectado) {
        this.props.history.push('/juegos/' + juego + '/controles')
      } else if (this.props.settings.clientesID.length > 0) {
        this.props.history.push('/juegos/' + juego + '/cliente')
      } else this.props.history.push('/juegos/' + juego)
    }
    else this.props.history.push('/juegos/' + juego)
  }

  componentWillMount = async () => {
    console.log(this.props.settings.socket)
    await this.props.changePagina({url: this.props.match.url, nombre:'Selección de juegos'})
    setTimeout(() => 
      this.props.settings.socket.send(JSON.stringify({
        action: 'CAMBIAR_PAGINA',
        payload: this.props.match.url
      })), 1000)
    juegosService.juegos()
      .then(res => res.data)
      .then(res => {
        this.setState({juegos: res})
        document.getElementById('contenido').scrollIntoView()
      }
    )
  }

  

  render () {
    return (
      <Grid fluid style={{paddingTop: 22}}>
        <Row>
          {this.state.juegos.map(juego => 
            <Col xs={12} md={4} key={juego.id} id={'juego' + juego.id}>
              <div className='juego' onClick={() => this.handleClick(juego.juego)}>
                <p>{juego.juego}</p>
              </div>
           </Col>
          )}
        </Row>
      </Grid>
    )
  }
})