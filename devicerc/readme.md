# DeviceRC - Remote Control Your Espruino Over Wifi Via Websockets

## Features
 - Get & set variables 
 - Execute functions, passing in parameters and getting return values
 - Executing new code or overwriting existing on device code
 - Listen for events on the device
 - Setup watchers to monitor variables & functions on the device
 - Rebooting the device

## Browser Setup

### 1. Include the DeviceRC browser JS file

### 2. Create a new devivce
```
let myDevice = Object.create(deviceRC);
```

### 3. Connect to the websocket server
```
myDevice.connect("YOUR-DEVICE-NAME","ws://YOUR-SERVER:YOUR-PORT").then(()=>{
  // ... the rest of your code in here.
});
```
## Browser Methods

### Get On-device Variables
The promise returns the variable value
```
myDevice.variable("VARIABLE-NAME").then(r=>{ console.log(r); });
```

### Set On-device Variables
Same as the get, except now you are passing in the value as the second parameter. The promise retuns TRUE if successful or FALSE if the variable does not exist.
```
myDevice.variable("VARIABLE-NAME",NEW-VALUE).then(r=>{ console.log(r); });
```
