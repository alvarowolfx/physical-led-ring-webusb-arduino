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

* Any ESP32 Board (I used a Lolin32).
* NEO 6M uBlox GPS module.
* Sim800L GSM module.
* 220 Ohm resistor for the LED.
* Blue and Green LED for status of the device.
* 1k Ohm resistor for the MOSFET trigger.
* IRF540N MOSFET (don’t try to use a cheap MOSFET, like the TIP120, because it cannot handle the GSM Module current needs)
* Jumpers
* Perfboard for prototype (Optional)

### Schematic

![schematic](https://raw.githubusercontent.com/alvarowolfx/asset-tracker-gcp-mongoose-os/master/schematic/AssetTracker.png)

### Setup Firebase, deploy functions and webapp

* Install firebase tools: `npm install -g firebase-tools` or `yarn global add firebase-tools`
* Install webapp dependencies: `npm install` or `yarn install`
* Build React Application: `yarn run build` or `yarn run build`
* Install functions dependencies: `cd functions && npm install` or `cd functions && yarn install`
* Associate project with Firebase: `firebase init`
* Deploy all the things: `firebase deploy`

## References

* https://github.com/mongoose-os-apps/example-rpc-c
* https://github.com/mongoose-os-libs/pppos
* GPS NMEA Tracker - https://github.com/kosma/minmea

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

### [GitHub Pages](https://pages.github.com/)

> Note: this feature is available with `react-scripts@0.2.0` and higher.

#### Step 1: Add `homepage` to `package.json`

**The step below is important!**<br>
**If you skip it, your app will not deploy correctly.**

Open your `package.json` and add a `homepage` field for your project:

```json
  "homepage": "https://myusername.github.io/my-app",
```

or for a GitHub user page:

```json
  "homepage": "https://myusername.github.io",
```

Create React App uses the `homepage` field to determine the root URL in the built HTML file.

#### Step 2: Install `gh-pages` and add `deploy` to `scripts` in `package.json`

Now, whenever you run `npm run build`, you will see a cheat sheet with instructions on how to deploy to GitHub Pages.

To publish it at [https://myusername.github.io/my-app](https://myusername.github.io/my-app), run:

```sh
npm install --save gh-pages
```

Alternatively you may use `yarn`:

```sh
yarn add gh-pages
```

Add the following scripts in your `package.json`:

```diff
  "scripts": {
+   "predeploy": "npm run build",
+   "deploy": "gh-pages -d build",
    "start": "react-scripts start",
    "build": "react-scripts build",
```

The `predeploy` script will run automatically before `deploy` is run.

If you are deploying to a GitHub user page instead of a project page you'll need to make two
additional modifications:

1. First, change your repository's source branch to be any branch other than **master**.
1. Additionally, tweak your `package.json` scripts to push deployments to **master**:

```diff
  "scripts": {
    "predeploy": "npm run build",
-   "deploy": "gh-pages -d build",
+   "deploy": "gh-pages -b master -d build",
```

#### Step 3: Deploy the site by running `npm run deploy`

Then run:

```sh
npm run deploy
```

#### Step 4: Ensure your project’s settings use `gh-pages`

Finally, make sure **GitHub Pages** option in your GitHub project settings is set to use the `gh-pages` branch:

<img src="http://i.imgur.com/HUjEr9l.png" width="500" alt="gh-pages branch setting">

#### Step 5: Optionally, configure the domain

You can configure a custom domain with GitHub Pages by adding a `CNAME` file to the `public/` folder.
