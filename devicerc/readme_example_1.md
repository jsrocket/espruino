# Table Of Contents
 1. [Overview](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme.md)
 2. [Websocket server](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_server.md)
 3. [Espruino Module](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_espruino.md)
 4. [Browser JS](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_browser.md)
 5. **Example 1**

----------------------------------------------

# Overview

This example will illustrate how to:

 - Get variables from your Espruino
 - Set variables on your Espruino
 - Call functions on your Espruino
 - Listen for events from your Espruino

----------------------------------------------

# Espurino Code

 1. Copy and paste this code into your Espruino IDE.
 2. Enter in your Wifi SID and Password as well as this devices unique identifier.
 3. Flash the code to your Espruino
 4. Move on to the Browser section below. 

```
let deviceRC = require("https://raw.githubusercontent.com/protoroboticsgit/espruino/master/devicerc/src/device/devicerc.js").connect({
  "sid":"#####",
  "pwd":"#####",
  "key":"#####",
  "server":"publicwss.robotictheater.com",
  "disable":[]
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

 1. Copy and paste the following code into an HTML page locally.
 2. Replace "#####" with your unique device identifier that you used in your Espruino code.
 3. Open the html page in your browser, open the developer console and start playing around. 

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
            <p>
                Faster<input type="range" min="250" max="2000" step="250" value="1000" id="blinkRate">Slower
            </p>
            <button id="startBlinking">Start LED Blinking</button>
            <button id="stopBlinking">Stop LED Blinking</button>
        </div>

        <div>
            <button id="checkRate">Check Blink Rate</button>
        </div>
        
        <script>
            
            let myDevice = Object.create(deviceRC);
            

            myDevice.connect("#####","wss://publicwss.robotictheater.com").then(()=>{ //

                console.log("Browser connected to myDevice");

            }).catch(e=>{ console.log(e); });

           
            /**************************************
            If you have multiple devices that you want to control on a single page, simply create a new device object.
            *******************************************

            let mySecondDevice = Object.create(deviceRC);
            mySecondDevice.connect("myseconddemoapp","wss://publicwss.robotictheater.com").then(()=>{ //
                console.log("Browser connected to mySecondDevice");
            }).catch(e=>{ console.log(e); });

            ***************************/

           
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
               console.log("pong", e.detail);
            });

            // You can setup an interval that ping/pongs the device to act as a heartbeat to makesure its still online and connected.
            let pingInterval = setInterval(()=>{
                myDevice.ping();
            },60000)

        </script>
    </body>
</html>

```
