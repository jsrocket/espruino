# Browser Setup

## Include Browser JS File

### 1. Include the DeviceRC browser JS file

``` 
@TODO ADD URL HERE
```

### 2. Create a new devivce
You can control multiple devices from the same page. Just create a new object for each device you want to control.
```
let myDevice = Object.create(deviceRC);
```

### 3. Connect to the websocket server

**Parameters**
 - Device Identifier: - An identifier that matches the value entered in your Espurino program.
 - Server: - The address and port for your websocket server.

**Returns**
 - A boolean value. True if connected, False if disconnected.

```
myDevice.connect("DEVICE-IDENTIFIER","ws://YOUR-SERVER:YOUR-PORT").then((connected)=>{
  // ... the rest of your code in here.
});
```

## Browser Methods

### Get On-device Variables

**Parameters**
 - Variable Name: - The name of the variable defined in your Espruino program.

**Returns**
 - The value of the variable.

```
myDevice.variable("VARIABLE-NAME").then(r=>{ console.log(r); });
```

### Set On-device Variables
**Parameters**
 - Variable Name: - The name of the variable defined in your Espruino program.
 - Value: - The new value to set the variable to. Can be any valid type.

**Returns**
 - True if successful. False if the variable does not exist.

```
myDevice.variable("VARIABLE-NAME",VALUE).then(r=>{ console.log(r); });
```

### Call On-device Functions

**Parameters**
 - Function Name: - The name of the function defined in your Espruino program.
 - Arg: (optional) - Whatever is set here will be passed into your function.

**Returns**
 - The return value of the function called.

```
myDevice.function("FUNCTION-NAME", ARG).then(r=>{ console.log(r); });
```

### Execute New Javascript On-device
You can write and execute new JS code on your device from your browser. The code sent DOES NOT persist when the device is rebooted.

**Parameters**
 - Unique ID: - An internal reference for associating the response to the proper request.
 - Code Block: - The JS code to be executed on the Espruino
 
**Returns**
- An empty string on success.  An error message on failure.

```
myDevice.exec("UNIQUE-ID", `CODE-BLOCK`).then(error =>{ console.log(error); });
```

### Register An On-device Watcher
Monitor the value of a variable or function on a specific interval.

**Parameters**
 - Function or Variable Name: - The name of the function or variable present in your Espruino code.
 - Interval (integer): - The number of milliseconds to wait inbetween polling.
 - History (integer): - The number of records to return when the watcher fires.  The default is 1.
 
**Returns**
 - The value of the function or variable

```
myDevice.watcher("FUNCTION-OR-VARIABLE-NAME", INTERVAL, HISTORY).then(r=>{ console.log(r); });
```

### Deregister An On-device Watcher
Same as registering execpt you don't pass in any parameters besides the name which nulls out the interval timer.

**Parameters**
 - Function or Variable Name: - The name of the function or variable present in your Espruino code.
 
**Returns**
 - True | False

```
myDevice.watcher("FUNCTION-OR-VARIABLE-NAME").then(r=>{ console.log(r); });
```

### Reboot The Espruino
Allows you to trigger ```E.reboot()``` the the device.

**Parameters**
 - NA
 
**Returns**
 - NA

```
myDevice.reboot();
```


### Ping Espruino
Sends a Ping request to the Espruino, which will respond with a Pong response if it is online.

**Parameters**
 - NA
 
**Returns**
 - NA

```
myDevice.ping();
```

### Setting Event History Caps
You can adjust the number of records the server holds in memory for each event.  The default value is one record per event

**Parameters**
 - Event Name: - The name of the event, matching the one set in your Espruino code.
 - CNT: - The integer value indicating the number of event records to keep on the server and return to the event handler 
 
**Returns**
 - NA

```
myDevice.eventHistory("EVENT-NAME", CNT);
```

## Browser Events

**NOTE** All events will contain the device identifier in the event.detail data parameter.

### Device Connects
Fires when a device connects the websocket server.

```
window.addEventListener("connect",(evt)=>{
 console.log("connect", evt.detail);
});
```

### Device Disconnects
Fires when a device disconnects from the websocket server.

```
window.addEventListener("disconnect",(evt)=>{
 console.log("connect", evt.detail);
});
```

### Device Pong Response
Fires when the device responds to a Ping request.

```
window.addEventListener("disconnect",(evt)=>{
 console.log("connect", evt.detail);
});
```

### Device Custom Event
Trigger custom events that will respond to on-device events like button presses, sensor triggers or any other IO event.

**Parameters**
 - Event Name: - The event name matching the one set by you Espruino code when triggering the event.

```
window.addEventListener("EVENT-NAME",(evt)=>{
 console.log("connect", evt.detail);
});
```
