import React from 'react';
import './stylesheet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';


const projectName = '25 + 5 Clock';

var startTime;
var updatedTime;
var difference;
var tInterval;
var savedTime;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      minutes: '25',
      seconds: '00',
      timeTotal: 1500,
      timeLeft: 1500,
      running: "nah",
      timerLabel: "Session"
    };
    this.breakIncrement = this.breakIncrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.clocker = this.clocker.bind(this);
    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
    this.decrementTime = this.decrementTime.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.getShowTime = this.getShowTime.bind(this);
    this.changeOver = this.changeOver.bind(this);
  }
  breakIncrement(e) {
    if (this.state.breakLength < 60) {
      this.setState({
        breakLength: this.state.breakLength + 1
      });
    }
  };
  breakDecrement(e) {
    if (this.state.breakLength > 1) {
      this.setState({
        breakLength: this.state.breakLength - 1
      });
    }
  };
  sessionIncrement(e) {
    if (this.state.sessionLength < 60) {
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        minutes: +(this.state.minutes) < 9
                 ? '0' + String(+(this.state.minutes) + 1)
                 : String(+(this.state.minutes) + 1),
        timeTotal: (this.state.sessionLength + 1) * 60,
        timeLeft: (this.state.sessionLength + 1) * 60
      });
    }
  };
  sessionDecrement(e) {
    if (this.state.sessionLength > 1) {
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        minutes: +(this.state.minutes) <= 10
                 ? '0' + String(+(this.state.minutes) - 1)
                 : String(+(this.state.minutes) - 1),
        timeTotal: (this.state.sessionLength - 1) * 60,
        timeLeft: (this.state.sessionLength - 1) * 60
      }); 
    }
  };
  start() {
    if (this.state.running == "nah") {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  };
  startTimer() {
    this.setState({
      running: "yeah"
    });
    startTime = new Date().getTime();
    tInterval = setInterval(this.getShowTime, 1000);
  };
  pauseTimer() {
    this.setState({
      running: "nah",
      timeTotal: this.state.timeLeft
    });
    clearInterval(tInterval);
  };
  getShowTime(){
    updatedTime = new Date().getTime();
    difference =  updatedTime - startTime - 1000;
    var minutesPassed = Math.floor((difference % 3600000) / 60000);
    var secondsPassed = Math.floor((difference % (60000)) / 1000);
    var newTime = this.state.timeTotal - (difference / 1000);
    var minutes = Math.floor(newTime / 60);
    var seconds = Math.floor(newTime - (minutes * 60));
    this.setState({
      minutes: minutes < 10 ? '0' + String(minutes) : minutes,
      seconds: seconds < 10 ? '0' + String(seconds) : seconds,
      timeLeft: Math.floor(newTime)
    });
    if (this.state.minutes == '00' && this.state.seconds == '00' || newTime <= 0) {
      this.audioBeep.play();
    }
    if (newTime <= 0) {
      this.changeOver();
    }
  };
  changeOver() {
    this.pauseTimer();
    if (this.state.timerLabel == "Session") {
      this.setState({
        timerLabel: "Break",
        timeTotal: this.state.breakLength * 60,
        timeLeft: this.state.breakLength * 60,
        minutes: this.state.breakLength < 10 ? '0' + String(this.state.breakLength) : this.state.sessionLength,
        seconds: '00'
      });
    } else {
      this.setState({
        timerLabel: "Session",
        timeTotal: this.state.sessionLength * 60,
        timeLeft: this.state.sessionLength * 60,
        minutes: this.state.sessionLength < 10 ? '0' + String(this.state.sessionLength) : this.state.sessionLength,
        seconds: '00'
      });
    }
    this.startTimer();
  }
  decrementTime() {
    this.setState({
      seconds: this.state.seconds < 1 ? 59
               : +(this.state.seconds) - 1
    })
  }
  clocker() {
    let minutes = this.state.minutes;
    let seconds = this.state.seconds;
    this.setState({
      minutes: minutes < 10 ? '0' + String(minutes) : minutes,
      seconds: seconds < 10 ? '0' + String(seconds) : seconds
    });
  };
  reset() {
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    clearInterval(tInterval);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      minutes: '25',
      seconds: '00',
      timeTotal: 25 * 60,
      timeLeft: 25 * 60,
      running: "nah",
      timerLabel: "Session"
    });
  }
  render() {
    return (
      <div id="app">
        <h1 id="title">25 + 5 Clock</h1>
        <div id="inc-holder">
          <Lengths 
            breakLength={this.state.breakLength}
            sessionLength={this.state.sessionLength}
            breakIncrement={this.breakIncrement}
            breakDecrement={this.breakDecrement}
            sessionIncrement={this.sessionIncrement}
            sessionDecrement={this.sessionDecrement}
            />
        </div>
        <div id="clock">
          <h1 id="timer-label">{this.state.timerLabel}</h1>
          <h1 id="time-left">{this.state.minutes}:{this.state.seconds}</h1>
          <button id="start_stop" className="under-button" onClick={this.start}>
            {this.state.running == "nah" ? <FontAwesomeIcon icon={faPlay} size='4x' /> : <FontAwesomeIcon icon={faPause} size='4x' />}
          </button>
          <button id="reset" className="under-button" onClick={this.reset}>
            <FontAwesomeIcon icon={faSyncAlt} size='4x' />
          </button>
        </div>
        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    )
  }
}

class Lengths extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="length-container">
        <div id="break-container">
          <h2 id="break-label" className="length-label">Break Length</h2>
          <button id="break-increment" className="button-up" onClick={this.props.breakIncrement}><FontAwesomeIcon icon={faArrowUp} size="2x" /></button>
          <h2 id="break-length">{this.props.breakLength}</h2>
          <button id="break-decrement" className="button-down" onClick={this.props.breakDecrement}><FontAwesomeIcon icon={faArrowDown} size="2x" /></button>
        </div>
        <div id="session-container">
          <h2 id="session-label" className="length-label">Session Length</h2>
          <button id="session-increment" className="button-up" onClick={this.props.sessionIncrement}><FontAwesomeIcon icon={faArrowUp} size="2x" /></button>
          <h2 id="session-length">{this.props.sessionLength}</h2>
          <button id="session-decrement" className="button-down" onClick={this.props.sessionDecrement}><FontAwesomeIcon icon={faArrowDown} size="2x" /></button>
        </div>
      </div>
    )
  }
}

export default App;