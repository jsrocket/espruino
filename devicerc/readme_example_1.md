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
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/protoroboticsgit/espruino@master/devicerc/src/browser/devicerc.min.js"></script>
        <style> div{ margin-bottom:40px; } </style>
    </head>
    <body>
        <div>
            <button id="ledOn">LED On</button>
            <button id="ledOff">LED Off</button>
        </div>

        <div>
            <p>250ms<input type="range" min="250" max="2000" step="250" value="1000" id="blinkRate">2000ms</p>
            <button id="startBlinking">Start LED Blinking</button>
            <button id="stopBlinking">Stop LED Blinking</button>
        </div>

        <div>
            <button id="checkRate">Check Blink Rate</button>
        </div>
        
        <script>
            
            let myDevice = Object.create(deviceRC);

            myDevice.connect("mydemoapp","wss://publicwss.robotictheater.com").then(()=>{ //

                console.log("Browser connected");

           }).catch(e=>{ console.log(e); })

           
            document.getElementById("ledOn").addEventListener("click", ()=>{
                myDevice.function("toggleLED",true).then(r=>{ console.log('LED Toggled', r); });
            });

            document.getElementById("ledOff").addEventListener("click", ()=>{
                myDevice.function("toggleLED",false).then(r=>{ console.log('LED Toggled', r); });
            });

            document.getElementById("blinkRate").addEventListener("change", function(){
                myDevice.variable("blinkRate",Number(this.value)).then(r=>{ console.log('LED Toggled', r); });
            });

            document.getElementById("startBlinking").addEventListener("click", ()=>{                
                myDevice.variable("enabled",true).then(r=>{
                    if(r){
                        myDevice.function("ledBlink").then(r=>{ console.log('Blinking Started', r); });
                    }
                });
            });

            document.getElementById("stopBlinking").addEventListener("click", ()=>{                
                myDevice.variable("enabled",false).then(r=>{ console.log('LED Toggled', r); });
            });

            document.getElementById("checkRate").addEventListener("click", ()=>{                
                myDevice.variable("blinkRate").then(r=>{ alert(`Blink rate is ${r}ms`); });
            });

            window.addEventListener("BTNPressed",(e)=>{
                alert(`WOW ... at ${e.detail[0]} ${e.detail[1]}`);
            });

            window.addEventListener("disconnect",(e)=>{
               console.log("Espruino disconnected");
            });

            window.addEventListener("connect",(e)=>{
               console.log("Espruino connected");
            });

            window.addEventListener("pong",(e)=>{
               console.log("pong", e.detail, "<< This is like a hearbeat checking the Espruino's status.");
            });

            let pingInterval = setInterval(()=>{
               deviceRC.ping();
            },60000)

        </script>
    </body>
</html>

```
