import React, { Component } from 'react';
import logo from './logo.svg';
import { SketchPicker } from 'react-color';
import { Throttle } from 'react-throttle';
import './App.css';
import { getPorts, requestPort } from './Serial';
import LedRing from './LedRing';

const numberLeds = 16;

const MODES = {
  MODE_STATIC: 0,
  MODE_BLINK: 1,
  //MODE_BREATH: 2,
  MODE_COLOR_WIPE: 3,
  MODE_COLOR_WIPE_RANDOM: 4,
  MODE_RANDOM_COLOR: 5,
  MODE_SINGLE_DYNAMIC: 6,
  MODE_MULTI_DYNAMIC: 7,
  MODE_RAINBOW: 8,
  MODE_RAINBOW_CYCLE: 9,
  MODE_SCAN: 10,
  MODE_DUAL_SCAN: 11,
  MODE_FADE: 12,
  MODE_THEATER_CHASE: 13,
  MODE_THEATER_CHASE_RAINBOW: 14,
  //MODE_RUNNING_LIGHTS: 15,
  //MODE_TWINKLE: 16,
  MODE_TWINKLE_RANDOM: 17,
  MODE_TWINKLE_FADE: 18,
  MODE_TWINKLE_FADE_RANDOM: 19,
  MODE_SPARKLE: 20,
  MODE_FLASH_SPARKLE: 21,
  MODE_HYPER_SPARKLE: 22,
  MODE_STROBE: 23,
  MODE_STROBE_RAINBOW: 24,
  MODE_MULTI_STROBE: 25,
  MODE_BLINK_RAINBOW: 26,
  MODE_CHASE_WHITE: 27,
  MODE_CHASE_COLOR: 28,
  MODE_CHASE_RANDOM: 29,
  MODE_CHASE_RAINBOW: 30,
  MODE_CHASE_FLASH: 31,
  MODE_CHASE_FLASH_RANDOM: 32,
  MODE_CHASE_RAINBOW_WHITE: 33,
  MODE_CHASE_BLACKOUT: 34,
  MODE_CHASE_BLACKOUT_RAINBOW: 35,
  MODE_COLOR_SWEEP_RANDOM: 36,
  MODE_RUNNING_COLOR: 37,
  MODE_RUNNING_RED_BLUE: 38,
  MODE_RUNNING_RANDOM: 39,
  //MODE_LARSON_SCANNER: 40,
  MODE_COMET: 41,
  MODE_FIREWORKS: 42,
  //MODE_FIREWORKS_RANDOM: 43,
  MODE_MERRY_CHRISTMAS: 44,
  MODE_FIRE_FLICKER: 45,
  MODE_FIRE_FLICKER_SOFT: 46,
  MODE_FIRE_FLICKER_INTENSE: 47
  /*
  MODE_DUAL_COLOR_WIPE_IN_OUT: 48,
  MODE_DUAL_COLOR_WIPE_IN_IN: 49,
  MODE_DUAL_COLOR_WIPE_OUT_OUT: 50,
  MODE_DUAL_COLOR_WIPE_OUT_IN: 51,
  MODE_CIRCUS_COMBUSTUS: 52,
  MODE_HALLOWEEN: 53,
  MODE_COLOR_WIPE_INVERSE: 54,
  MODE_BICOLOR_CHASE: 55,
  MODE_TRICOLOR_CHASE: 56
  */
};

class App extends Component {
  state = {
    port: null,
    searchingPorts: false,
    connected: false,
    selectedLed: 'all',
    colors: new Array(numberLeds).fill({ r: 0, g: 200, b: 0 }),
    speed: 230,
    mode: 0
  };

  componentDidMount() {
    this.setState({
      searchingPorts: true
    });
    getPorts().then(ports => {
      this.onPortsFound(ports);
    });
  }

  onPortsFound(ports) {
    if (ports.length === 0) {
      this.setState({
        port: null,
        searchingPorts: false
      });
    } else {
      const port = ports[0];
      this.setState(
        {
          port,
          searchingPorts: false
        },
        this.connect
      );
    }
  }

  connect = () => {
    const { port } = this.state;
    if (!port) {
      return;
    }
    port.connect().then(
      () => {
        this.setState(
          {
            connected: true
          },
          this.sync
        );

        port.onReceive = data => {
          /*
          let textDecoder = new TextDecoder();
          console.log(textDecoder.decode(data));
          */
        };

        port.onReceiveError = error => {
          console.error(error);
          this.onConnectClick();
        };
      },
      error => {
        console.error(error);
        this.onConnectClick();
      }
    );
  };

  onConnectClick = () => {
    const { port } = this.state;
    if (port) {
      port.disconnect();
      this.setState({
        connected: false,
        port: null
      });
    } else {
      requestPort()
        .then(port => {
          this.onPortsFound([port]);
        })
        .catch(error => {
          console.log('Request Port: ', error);
        });
    }
  };

  sendData(code, { r, g, b }) {
    const { port } = this.state;
    if (!port) {
      return;
    }
    let view = new Uint8Array(4);
    view[0] = code;
    view[1] = r;
    view[2] = g;
    view[3] = b;
    port.send(view);
  }

  sendMode(mode) {
    this.sendData(254, { r: mode, g: 0, b: 0 });
  }

  sendSpeed(speed) {
    this.sendData(253, { r: speed, g: 0, b: 0 });
  }

  sync = () => {
    const { colors, selectedLed, mode, speed } = this.state;
    if (selectedLed === 'all') {
      this.sendData(255, colors[0]);
    } else {
      for (let i = 0; i < colors.length; i++) {
        this.sendData(i, colors[i]);
      }
    }
    this.sendMode(mode);
    this.sendSpeed(speed);
  };

  onAllOff = () => {
    this.setState(
      {
        colors: new Array(numberLeds).fill({ r: 0, g: 0, b: 0 }),
        selectedLed: 'all'
      },
      this.sync
    );
  };

  onToggleAll = () => {
    this.setState({
      selectedLed: 'all'
    });
  };

  handleColorChange = ({ rgb }) => {
    const { selectedLed } = this.state;

    const index = selectedLed === 'all' ? 255 : selectedLed;
    this.sendData(index, rgb);

    if (selectedLed === 'all') {
      const colors = new Array(numberLeds).fill(rgb);
      this.setState({
        colors
      });
    } else {
      const colors = [
        ...this.state.colors.slice(0, selectedLed),
        rgb,
        ...this.state.colors.slice(selectedLed + 1)
      ];
      this.setState({
        colors
      });
    }
  };

  onModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
    this.sendMode(mode);
  };

  onSpeedChange = e => {
    const speed = e.target.value;
    this.setState({ speed });
    this.sendSpeed(speed);
  };

  onLedClickWithIndex = (e, index) => {
    /* DO NOTHING FOR NOW
    this.setState({
      selectedLed: index
    });
    */
  };

  render() {
    const { connected, selectedLed, colors, speed, mode } = this.state;
    let selectedColor = null;
    if (selectedLed === 'all') {
      selectedColor = colors[0];
    } else {
      selectedColor = colors[selectedLed];
    }
    return (
      <div className="app">
        <header>
          <img src={logo} className="logo" alt="logo" />
          <h1 className="title">Welcome to React + WebUSB Demo</h1>
        </header>
        <div className="container">
          <br />
          <div>
            <button onClick={this.onConnectClick}>
              {connected ? 'Disconnect' : 'Connect'}
            </button>
            <button onClick={this.onAllOff}>All Off</button>
            {selectedLed !== 'all' && (
              <button onClick={this.onToggleAll}>Select All</button>
            )}
            <br />
            <label>Animation: </label>
            <select onChange={this.onModeChange} value={mode}>
              {Object.keys(MODES).map(mode => {
                return (
                  <option key={mode} value={MODES[mode]}>
                    {mode}
                  </option>
                );
              })}
            </select>
            <br />
            <label>Speed: </label>
            <input
              type="range"
              min="200"
              max="255"
              value={speed}
              onChange={this.onSpeedChange}
            />
            <label>{speed}</label>
          </div>
          {selectedLed === 'all' && <h4> All leds selected </h4>}
          {selectedLed !== 'all' && <h4> Led {selectedLed} selected </h4>}
          <div className="led-control">
            <LedRing
              circleSize={16}
              colors={colors}
              selectedLed={selectedLed}
              onLedClickWithIndex={this.onLedClickWithIndex}
            />
            <br />
            <Throttle time="200" handler="onChange">
              <SketchPicker
                color={selectedColor}
                onChange={this.handleColorChange}
              />
            </Throttle>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
