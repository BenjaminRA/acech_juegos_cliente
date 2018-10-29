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
  this.props.gano !== nextProps.gano ||
  this.props.countPalabras !== nextProps.countPalabras

  handleTimerRender = ({ minutes, seconds, completed }) => {
    this.setState({tiempo: seconds})
    if (completed) {
      this.setState({
        perdiendo: false,
        perdio: false
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
        {this.props.ticking && <Sound
          url='/assets/SFX/ticking.mp3'
          playStatus={Sound.status.PLAYING}
        />}
        {this.props.isMobile ? 
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
        <div
        className={classNames('timer',{
          'ticking': this.props.ticking && !this.props.gano,
          'ticking-perdiendo': this.state.perdiendo,
          'timer-perdio': this.state.perdio,
          'gano': this.props.gano
        })} 
        style={{
          position: 'absolute',
          height: window.innerHeight/2, width: window.innerHeight/2,
          left: (window.innerHeight/3)/2,
          top: (window.innerHeight/6)
          // left: 0,
          // top: 0
          }}>
          {(this.props.ticking && !this.props.gano) ? <Timer 
            date={this.state.perdiendo ? (Date.now() + 1000*10) : (Date.now() + 1000*60)}
            renderer={this.handleTimerRender}/> : <span style={{fontSize:'5vw'}}>{this.props.gano ? this.state.tiempo : '60'}</span>}
        </div>}
      </React.Fragment>
    )
  }
}