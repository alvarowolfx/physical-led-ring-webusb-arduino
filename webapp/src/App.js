import React, { Component } from 'react';
import logo from './logo.svg';
import { SketchPicker } from 'react-color';
import './App.css';
import { getPorts, requestPort } from './Serial';
import LedRing from './LedRing';

const numberLeds = 16;

class App extends Component {
  state = {
    port: null,
    searchingPorts: false,
    connected: false,
    selectedLed: 'all',
    colors: new Array(numberLeds).fill({ r: 0, g: 200, b: 0 })
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
          let textDecoder = new TextDecoder();
          console.log(textDecoder.decode(data));
        };
        port.onReceiveError = error => {
          console.error(error);
        };
      },
      error => {
        console.error(error);
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

  sendColor(index, color) {
    const { port } = this.state;
    if (!port) {
      return;
    }
    let view = new Uint8Array(4);
    let rgb = color;
    view[0] = index;
    view[1] = rgb.r;
    view[2] = rgb.g;
    view[3] = rgb.b;
    port.send(view);
  }

  sync = () => {
    const { colors, selectedLed } = this.state;
    if (selectedLed === 'all') {
      this.sendColor(255, colors[0]);
      return;
    }

    for (let i = 0; i < colors.length; i++) {
      this.sendColor(i, colors[i]);
    }
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
    this.sendColor(index, rgb);

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

  onLedClickWithIndex = (e, index) => {
    this.setState({
      selectedLed: index
    });
  };

  render() {
    const { connected, selectedLed, colors } = this.state;
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
            <SketchPicker
              color={selectedColor}
              onChangeComplete={this.handleColorChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
