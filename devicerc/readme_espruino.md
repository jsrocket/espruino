# Table Of Contents
 1. [Websocket server](https://github.com/protoroboticsgit/espruino/tree/master/devicerc#websocket-server)
 2. **Espruino Module**
 3. [Browser JS](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_browser.md)
 4. [Example](https://github.com/protoroboticsgit/espruino/tree/master/devicerc/example)
 
 
----------------------------------------------

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
