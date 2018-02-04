# Physical Led Ring controlled via a Browser - A WebUSB and Arduino experiment.

## Overview

IoT Project that shows how to connect a microcontroller directly to the Browser. This project uses WebUSB specification, a Arduino Micro/Leonardo and a NeoPixel Ring that is controlled by the web interface made with ReactJS.

WebApp: https://alvarowolfx.github.io/physical-led-ring-webusb-arduino

### Upload firmware to Arduino

I used Platform.io to write this project. I recommend to use it with the Visual Studio Code IDE.

* [Visual Studio Code](https://code.visualstudio.com/)
* [Platform.io](https://platformio.org)
* [Platform.io VSCode Plugin](http://docs.platformio.org/en/latest/ide/vscode.html)

### BOM

* An Arduino board with a ATMega32u4 microcontroller.
  * It's needed because this chip has native USB support.
* 16 Leds Neopixel Ring.
* Jumpers

### Schematic

![schematic](https://raw.githubusercontent.com/alvarowolfx/physical-led-ring-webusb-arduino/master/schematic/PhysicalLedRingWebUSB.png)

## References

* https://github.com/mongoose-os-apps/example-rpc-c
* https://github.com/mongoose-os-libs/pppos
* GPS NMEA Tracker - https://github.com/kosma/minmea

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
