import React, { Component } from 'react'
import Header from './components/Layout/Header'
import Routes from './routes'
import { Router, Switch } from 'react-router-dom'
import history from './history'
import { Provider } from 'react-redux'
import store from './store'

import './css/laMemoria.css'
import './css/laPista.css'
import './css/layout.css'
import './css/seleccionJuegos.css'
import './css/elRosco.css'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Header/>
          <div id="contenido">
            <Router history={history}>
              <Switch>
                <Routes />
              </Switch>
            </Router>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
