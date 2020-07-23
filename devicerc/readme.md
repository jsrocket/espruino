# DeviceRC - Remote Control Your Espruino Over Wifi Via Websockets

## Features
 - Get & set variables 
 - Execute functions, passing in parameters and getting return values
 - Executing new code or overwriting existing on device code
 - Listen for events on the device
 - Setup watchers to monitor variables & functions on the device
 - Rebooting the device

----------------------------------------------

## Install NodeJS Server

 1. Download the files in the ```/server``` directory
 2. Update the websocket ```port``` value. By default this is set to 8080. Whatever your value is, make sure the port is open on your firewall.
 3. Run ```npm install```
 4. Run the ```server.js``` under PM2 or your favorite process manager

**Note** - If you can't or don't want to run your own server, feel free to use my shared one at ```wss://shared.robotictheater.com:8080```. Be warned, it comes with no promises or guarantee of uptime.

----------------------------------------------

## Include Browser JS File

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

### Call On-device Function
You can pass in an optional parameter to your function of any JS data type. The promise returns the value of the functions return.
```
myDevice.function("FUNCTION-NAME", [OPTIONAL-PARAM]).then(r=>{ console.log(r); });
```
