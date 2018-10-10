import React from 'react'
import { Route } from 'react-router-dom'
import SeleccionJuego from './components/SeleccionJuego'
import laMemoria from './components/laMemoria'
import laMemoriaJuego from './components/laMemoria/juego'
import laMemoriaCliente from './components/laMemoria/juego/cliente'
import laMemoriaControles from './components/laMemoria/juego/controles'
import laPista from './components/laPista'
import laPistaCliente from './components/laPista/cliente'
import laPistaControles from './components/laPista/controles'
import ahorcado from './components/ahorcado'
import elRosco from './components/elRosco'

export default () =>
  // <React.Fragment>
  //   <Route path='' component={SeleccionJuego} exact/>
  //   <Route path='/laMemoria' component={laMemoria} exact/>
  //   <Route path='/laMemoria/:palabras' component={laMemoriaJuego} exact/>
  //   <Route path='/laMemoria/:palabras/cliente' component={laMemoriaCliente}/>
  //   <Route path='/laMemoria/:palabras/controles' component={laMemoriaControles}/>
  //   <Route path='/laPista' component={laPista} exact/>
  //   <Route path='/laPista/cliente' component={laPistaCliente}/>
  //   <Route path='/laPista/controles' component={laPistaControles}/>
  //   <Route path='/Ahorcado' component={ahorcado}/>
  //   <Route path='/elRosco' component={elRosco}/>
  // </React.Fragment>
  <React.Fragment>
    <Route path='/juegos' component={SeleccionJuego} exact/>
    <Route path='/juegos/laMemoria' component={laMemoria} exact/>
    <Route path='/juegos/laMemoria/:palabras' component={laMemoriaJuego} exact/>
    <Route path='/juegos/laMemoria/:palabras/cliente' component={laMemoriaCliente}/>
    <Route path='/juegos/laMemoria/:palabras/controles' component={laMemoriaControles}/>
    <Route path='/juegos/laPista' component={laPista} exact/>
    <Route path='/juegos/laPista/cliente' component={laPistaCliente}/>
    <Route path='/juegos/laPista/controles' component={laPistaControles}/>
    <Route path='/juegos/Ahorcado' component={ahorcado}/>
    <Route path='/juegos/elRosco' component={elRosco}/>
  </React.Fragment>