# DeviceRC - Remote Control Your Espruino Over Wifi Via Websockets

## Table Of Contents
 1. **Overview**
 2. [Websocket Server](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_server.md)
 3. [Espruino Module](https://github.com/protoroboticsgit/espruino/tree/master/devicerc/readme_espruino.md)
 4. [Browser JS](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_browser.md)
 5. [Example](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_example_1.md)

----------------------------------------------

## Overview

The goal of this project is to allow you to control your Espruino from across the web. You could be in the same room or different country.

There are three components.  

 - The first is the websocket server which proxies message to and from the Espruino and your browser window.
 - The second is the Espruino module that handles connecting to the local Wifi network as well as all the websocket communications.
 - The final piece is the browser JS library that will handle all the websocket communications wraps it up into a couple simple functions and event listeners.


----------------------------------------------

## Features:

### Use your web browser to remotely:
 - Get & set variables on your Espruino
 - Execute functions on your Espruino, passing in parameters and getting return values
 - Executing new code or overwriting existing code on your Espruino
 - Listen for events on on your Espruino
 - Setup watchers to monitor variables & functions on your Espruino
 - Rebooting your Espruino

----------------------------------------------

## Important Note About Security!!

There is none! The websocket server in this repo has no notion of authentication or authorization. As long as your browser JS has a valid device identifier it will allow you to send commands to the matching device. If you will be using this in a production deployment I would highly recommend adding the security mechanism that matches your project.  

If you are using the public websocket server I made available, I would recommend using a long random string for your device identifier. If you use a common value like "myapp", there is a good chance someone else will as well and you will be interfering with each other.
