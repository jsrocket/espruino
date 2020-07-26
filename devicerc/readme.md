# DeviceRC - Remote Control Your Espruino Over Wifi Via Websockets

## Features:

### Use your web browser to remotely:
 - Get & set variables on your Espruino
 - Execute functions on your Espruino, passing in parameters and getting return values
 - Executing new code or overwriting existing code on your Espruino
 - Listen for events on on your Espruino
 - Setup watchers to monitor variables & functions on your Espruino
 - Rebooting your Espruino

----------------------------------------------

# Overview
The setup contains three components.  

 - The first is the websocket server which will join the code on your Espruino to the code on your Browser.
 - The second is the Espruino module that handles connecting to the Wifi network as well as all the websocket commands.
 - The final piece is the browser JS library that will handle all the websocket communications wraps it up into a couple simple functions and event listeners.

```
Espruino JS <-->  [Websocket Server] <---> Browser JS
```

## Important Note About Security ... 

... There is none! The websocket server in this repo has no notion of authentication or authorization. As long as your browser JS has a valid device identifier it will allow you to send commands to that device. If you will be using this in a production deployment, I would highly recommend adding your own security mechanism.

----------------------------------------------

# Table Of Contents
 1. **Overview**
 2. [Websocket Server](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_server.md)
 3. [Espruino Module](https://github.com/protoroboticsgit/espruino/tree/master/devicerc/readme_espruino.md)
 4. [Browser JS](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_browser.md)
 5. [Example](https://github.com/protoroboticsgit/espruino/tree/master/devicerc/example)


