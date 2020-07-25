require('dotenv').config();

const WebSocket = require('ws')
    wss = new WebSocket.Server({ port: process.env.PORT }),
    device={},
    browser={}
    events={},
    watchers={};

let eventCaps={}, watcherCaps={};


wss.on('connection', function connection(ws, req) {
    
    /***************************************************
     * Capture the key so we know what device this is
     * ************************************************/
    if(req.headers.origin.toLowerCase()==="espruino"){
        ws.device="espruino";
        ws.device_key=req.headers.key;
    }else{
        ws.device="browser";
        ws.device_key=req.url.replace("/","");
    }

    console.log(`Connection from ${ws.device} : ${ws.device_key} on ${new Date().toISOString()}`);

    /***************************************************
     * SEND TO BROWSER 
     * Send the message to the browser window connected
     * to the specific device
     * ************************************************/
    let sendToBrowser=(message, deviceKey)=>{
        wss.clients.forEach(function each(client) {
            
            if (client !== ws && client.device === "browser" && deviceKey===client.device_key) {

                let m = JSON.parse(message);
                let rtn = "";

                if(m[0]==="E"){
                    if(typeof events[m[1]]==="undefined"){  events[m[1]]=[];  }
                    events[m[1]].push([new Date().toISOString(),m[2]]);
                    events[m[1]]=events[m[1]].slice(-((typeof eventCaps[m[1]]==="number") ? eventCaps[m[1]] : 1));
                    rtn = JSON.stringify([m[0], m[1], events[m[1]]]);
                    
                }else if(m[0]==="W"){
                    if(typeof watchers[m[1]]==="undefined"){  watchers[m[1]]=[];  }
                    watchers[m[1]].push([new Date().toISOString(), m[2]]);
                    watchers[m[1]]=watchers[m[1]].slice(-watcherCaps[m[1]]);
                    rtn = JSON.stringify([m[0], m[1], watchers[m[1]]]);
                }else{
                    rtn=JSON.stringify(m);
                }

                client.send(rtn);
            }
        });
    };


    /***************************************************
     * SEND TO DEVICE
     * Send message to the specific device.
     * ************************************************/
    let sendToDevice=(message, deviceKey)=>{

        let m = JSON.parse(message);

        /*
            This next IF block sets the history caps for events and watchers
         */
        if(m[0]==="EVT"){            
            if(typeof m[2]==="number" && m[2]>0){
                eventCaps[m[1]]=m[2];
            }else if(typeof eventCaps[m[1]]==="undefined"){  
                eventCaps[m[1]]=1;
            }
        }else if(m[0]==="W"){            
            if(typeof m[3]==="number" && m[3]>0){
                watcherCaps[m[1]]=Number(m[3]);
            }else if(typeof watcherCaps[m[1]]==="undefined"){  
                watcherCaps[m[1]]=1;
            }
        }

        wss.clients.forEach(function each(client) {
            if (client.device === "espruino" && deviceKey===client.device_key ) {
                if(JSON.parse(message)[0]==="."){
                    client.ping(()=>{});
                }else{
                    client.send(message);
                }
                return true;
            }
        });
    };


    /***************************************************
     * New Message Arrived
     * ************************************************/
    ws.on('message', function incoming(message) {       
        switch(req.headers.origin.toLowerCase()){
            case "espruino":
                sendToBrowser(message, ws.device_key);
            break;
            default:
                sendToDevice(message, ws.device_key);
            break;
        }
    });


    // Fire an event in the browser when a device connects
    if(ws.device==="espruino"){
        sendToBrowser(JSON.stringify(["CONNECTED", ws.device_key]), ws.device_key);
    }

    // Fire an event in the browser when a device disconnects
    ws.on('close', function close(ws, req) {
        console.log(`Disconnect from ${ws.device} : ${ws.device_key} on ${new Date().toISOString()}`);
        if(ws.device==="espruino"){
            sendToBrowser(JSON.stringify(["DISCONNECTED", ws.device_key]), ws.device_key);
        }
    });

    // Fire an event in the browser when a device responds to the PING request
    ws.on('pong', function(){
        sendToBrowser(JSON.stringify([".", this.device_key]),this.device_key);
    });

});
