# Table Of Contents
 1. [Overview](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme.md)
 2. [Websocket server](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_server.md)
 3. [Espruino Module](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_espruino.md)
 4. [Browser JS](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_browser.md)
 5. **Example 1**
----------------------------------------------

# Espurino Code

```
let deviceRC = require("https://raw.githubusercontent.com/protoroboticsgit/espruino/master/devicerc/src/device/devicerc.js").connect({
  "sid":"#####",
  "pwd":"#####",
  "key":"example1",
  "server":"publicwss.robotictheater.com",
  "disable":["exec","reboot"]
},(connected)=>{
  if(connected){
    console.log("Connected to Public WSS");
  }
});

let on=true,
  freq=1000,
  enabled=true;


let toggleLED=(on)=>{
  LED1.write(on);
  return true;
};
    
let ledBlink=()=>{
  setTimeout(()=>{
    on = !on;
    LED1.write(on);
    if(enabled){
      ledBlink();
    }
  }, freq);
};

setWatch(function(e) {
  deviceRC.event("BTNPressed","Yes it was");
}, BTN, { repeat: true, edge: 'rising' });

```

# Browser Code

```
```
