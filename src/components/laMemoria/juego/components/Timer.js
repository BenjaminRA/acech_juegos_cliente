import React from 'react'
import Timer from 'react-countdown-now'
import classNames from 'classnames'
import Sound from 'react-sound'
export default class extends React.Component {
  state = {
    perdiendo: false,
    perdio: false,
    tiempo: '60',
  }

  shouldComponentUpdate = (nextProps, nextState) => 
  this.props.ticking !== nextProps.ticking ||
  this.state.perdiendo !== nextState.perdiendo ||
  this.state.perdio !== nextState.perdio ||
  this.props.gano !== nextProps.gano ||
  this.props.countPalabras !== nextProps.countPalabras

  handleTimerRender = ({ minutes, seconds, completed }) => {
    this.setState({
      tiempo: seconds,
      perdio: false
    })
    if (completed) {
      this.setState({
        perdiendo: false,
        perdio: true
      })
      this.props.handleStartChange(false)
      return <span style={{fontSize:'5vw'}}>Perdiste</span>
    } else {
      (seconds === '10') && this.setState({perdiendo: true})
      return <span style={{fontSize:'5vw'}}>{minutes === '01' ? 60 : seconds}</span>
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* Sonido de cuenta regresiva */}
        {(this.props.ticking && !this.props.gano) && <Sound
          url='/assets/SFX/ticking.mp3'
          playStatus={this.props.sonido}
        />}
        {this.props.isMobile ?
        // Render version movil
        <div
        className={classNames('timer-mobile',{
          'ticking': this.props.ticking && !this.props.gano,
          'ticking-perdiendo': this.state.perdiendo,
          'timer-perdio': this.state.perdio,
          'gano': this.props.gano
        })}>
          {(this.props.ticking && !this.props.gano) ? <Timer 
            date={this.state.perdiendo ? (Date.now() + 1000*10) : (Date.now() + 1000*60)}
            renderer={this.handleTimerRender}/> : <span style={{fontSize:'5vw'}}>{this.props.gano ? this.state.tiempo : '60'}</span>}
        </div> : 
        // Render version Desktop
        <div
        className={classNames('timer',{
          'ticking': this.props.ticking && !this.props.gano,
          'ticking-perdiendo': this.state.perdiendo,
          'timer-perdio': this.state.perdio,
          'gano': this.props.gano
        })} 
        style={{height: this.props.countPalabras*70, width: this.props.countPalabras*70}}>
          {(this.props.ticking && !this.props.gano) ? <Timer 
            date={this.state.perdiendo ? (Date.now() + 1000*10) : (Date.now() + 1000*60)}
            renderer={this.handleTimerRender}/> : <span style={{fontSize:'5vw'}}>{this.props.gano ? this.state.tiempo : '60'}</span>}
        </div>}
      </React.Fragment>
    )
  }
}