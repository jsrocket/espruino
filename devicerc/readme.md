# DeviceRC - Remote Control Your Espruino Over Wifi Via Websockets

## Features
 - Get & set variables 
 - Execute functions, passing in parameters and getting return values
 - Executing new code or overwriting existing on device code
 - Listen for events on the device
 - Setup watchers to monitor variables & functions on the device
 - Rebooting the device

----------------------------------------------

![](drcflow.png)

----------------------------------------------

# Table Of Contents
 1. [Websocket server (Below)](https://github.com/protoroboticsgit/espruino/tree/master/devicerc#websocket-server)
 2. Espruino Module
 3. [Browser JS](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_browser.md)
 4. [Example] (https://github.com/protoroboticsgit/espruino/tree/master/devicerc/example)
----------------------------------------------

# Websocket Server

## Install NodeJS Server

 1. Download the files in the ```/server``` directory
 2. Update the websocket ```port``` value. By default this is set to 8080. Whatever your value is, make sure the port is open on your firewall.
 3. Run ```npm install```
 4. Run the ```server.js``` under PM2 or your favorite process manager

**Note** - If you can't or don't want to run your own server, feel free to use my shared one at ```wss://shared.robotictheater.com:8080```. Be warned, it comes with no promises or guarantee of uptime.

---------------------------------------------

# Espruino Integration

## Connect To The Websocket Server
Include the deviceRC module and call ```connect``` passing the following parameters.

**Parameters**
 - sid (required): Your WIFI's SID
 - pwd (required): Your WIFI's password
 - id (required): A unique device id
 - server (required): The websocket server address
 - port (required): The websocket server port
 - disable (optional): An array containing a list of features to disable. Whatever is passed in will be be allowed to be called from the browser.
   - getvariable
   - setvariable
   - function
   - exec
   - reboot
   - watcher

**Callback**
The callback will fire anytime the connection status chnges. It will return True if connected and False if disconnected.

```
let deviceRC = require("https://raw.githubusercontent.com/protoroboticsgit/espruino/master/devicerc/device.min.js").connect({
    "sid":"YOUR-WIFI-SID",
    "pwd":"YOUR-WIFI-PASSWORD",
     "id":"DEVICE-IDENTIFIER",
     "server":"WEBSOCKET-SERVER",
     "port":WEBSOCKET-PORT,
     "disable":[]
},(connected)=>{
  if(connected){
    
  }
});
```

## Firing Events

**Parameters**
 - Event Name: - The name/label of the event that will be referenced in the browsers event listener.
 - Event Value: - The data to record along with the event.

```
deviceRC.event("EVENT-NAME", "EVENT-VALUE")
```

----------------------------------------------

