import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { changePagina } from '../../actions/SettingsActions'
import { isMobile } from 'react-device-detect'
import AvisoMobile from '../Layout/avisoMobile'

import laMemoriaService from '../../services/laMemoria'

const mapStateToProps = store => ({
  settings: store.settings
})

export default connect(mapStateToProps, { changePagina })(class extends React.Component {
  state = {
    temas: [],
    open: false
  }

  componentWillMount = async () => {
    laMemoriaService.temas()
      .then(res => res.data)
      .then(res => {
        this.setState({temas: res})
        document.getElementById('contenido').scrollIntoView()
      })
      await this.props.changePagina({url: this.props.match.url, nombre: 'laMemoria'}
    )
    setTimeout(() => 
      this.props.settings.socket.send(JSON.stringify({
        action: 'CAMBIAR_PAGINA',
        payload: this.props.match.url
      })), 50)
  }

  handleTemaClick = url => {
      if (this.props.settings.conectado) {
        this.props.history.push(url + '/controles')
      } else if (this.props.settings.clientesID.length > 0) {
        this.props.history.push(url + '/cliente')
      } else if (isMobile) {
        this.setState({open: true})
      } else this.props.history.push(url)
  }

  handleClose = () => this.setState({open: false})



  render() {
    return (
      <React.Fragment>
        <AvisoMobile open={this.state.open} handleClose={this.handleClose}/>
        <Grid fluid>
          <Row style={{marginTop: 10}}>
            {this.state.temas.map(tema => 
            <Col xs={6} md={4} lg={3} key={tema.id}>
              {/* <div key={tema.id} className='tema-laMemoria' onClick={() => this.handleTemaClick(`laMemoria/${tema.id}`)}>
                <p className='tema-laMemoria-texto'>{tema.tema}</p>
              </div> */}
              <div key={tema.id} className='tema-laMemoria' onClick={() => this.handleTemaClick(`/juegos/laMemoria/${tema.id}`)}>
                <p className='tema-laMemoria-texto'>{tema.tema}</p>
              </div>
            </Col>)}
          </Row>
        </Grid>
      </React.Fragment>
    )
  }
})