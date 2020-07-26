# Table Of Contents
 1. [Overview](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme.md) 
 2. [Websocket server](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_server.md)
 3. **Espruino Module**
 4. [Browser JS](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_browser.md)
 5. [Example](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_example_1.md)
 
 
----------------------------------------------

# Espruino Integration

## Module Code

Location 
[https://github.com/protoroboticsgit/espruino/tree/master/devicerc/src/device](https://github.com/protoroboticsgit/espruino/tree/master/devicerc/src/device)


```
https://raw.githubusercontent.com/protoroboticsgit/espruino/master/devicerc/device.js
```

or minified

```
https://raw.githubusercontent.com/protoroboticsgit/espruino/master/devicerc/device.min.js
```

----------------------------------------------

## Connect To The Websocket Server
Include the deviceRC module and call ```connect``` passing the following parameters.

**Parameters**
 - sid (required): Your WIFI's SID
 - pwd (required): Your WIFI's password
 - key (required): A unique device identifier
 - server (required): The websocket server address
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
    "key":"DEVICE-IDENTIFIER",
    "server":"WEBSOCKET-SERVER",
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
deviceRC.event("EVENT-NAME", "EVENT-VALUE");
```
