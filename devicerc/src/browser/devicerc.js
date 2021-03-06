let deviceRC={
    "ws":null,
    "deviceKey":"",
    "pingTimeout":null,
    "queue":{
        "variable":{},
        "function":{},
        "exec":{}
    },                    
    "connect":function(deviceKey, server){    
        this.deviceKey=deviceKey;
        let that = this;                 
        return new Promise((resolve, reject)=>{
            that.ws = new WebSocket(`${server}/${deviceKey}`);
            that.ws.onopen = (event) => {
                resolve();
            };
            that.ws.onclose = (event) => {
                setTimeout( ()=>{
                    that.connect(deviceKey, server);
                }, 5000);
            };

            that.ws.onmessage = (event) => {
                let m = JSON.parse(event.data);
                
                switch(m[0]){
                    case "VG":
                    case "VS":
                        that.queue.variable[m[1]] = m[2];
                    break;                                    
                    case "F":
                        that.queue.function[m[1]] = m[2];
                    break;
                    case "X":
                        that.queue.exec[m[1]] = m[2];
                    break;
                    case "W":
                    case "E":
                        window.dispatchEvent(new CustomEvent(m[1], {
                            detail: m[2]
                        }));
                    break;
                    case "CONNECTED":
                        window.dispatchEvent(new CustomEvent("connect", {
                            detail: m[1]
                        }));
                    break;
                    case "DISCONNECTED":
                        window.dispatchEvent(new CustomEvent("disconnect", {
                            detail: m[1]
                        }));
                    break;
                    case ".":
                        clearTimeout(that.pingTimeout);
                        let evtDetail={ detail: {} };
                        evtDetail.detail[deviceKey]=true;
                        window.dispatchEvent(new CustomEvent("pong", evtDetail));
                    break;
                }
            }
        });                
    },                   
    "variable":function(variableName, val){
        let that = this;
        return new Promise((resolve, reject) => {
            if(typeof val==="undefined"){
                that.send(["VG",variableName]);
            }else{
                that.send(["VS",variableName, val]);
            }

            let i=setInterval(()=>{
                if(typeof that.queue.variable[variableName]!=="undefined"){
                    clearInterval(i);
                    resolve(that.queue.variable[variableName]);
                    delete that.queue.variable[variableName];
                }
            },250);
        });
    },
    "function":function(functionName, params){
        let that = this;
        return new Promise((resolve, reject) => {
            that.send(["F",functionName,params]);
            let i=setInterval(()=>{
                if(typeof that.queue.function[functionName]!=="undefined"){
                    clearInterval(i);
                    resolve(that.queue.function[functionName]);                                    
                    delete that.queue.function[functionName];
                }
            },250);
        });  
    },
    "watcher":function(name, interval, cap=1){
        this.send(["W", name, interval, cap]);
    },
    "eventHistory":function(name, cap=1){
        this.send(["EVT", name, cap]);
    },
    "exec":function(id, code){
        let that = this;
        return new Promise((resolve, reject) => {
            that.send(["X", id, code]);
            let i=setInterval(()=>{
                if(typeof that.queue.exec[id]!=="undefined"){
                    clearInterval(i);
                    resolve(that.queue.exec[id]);                                    
                    delete that.queue.exec[id];
                }
            },250);
        });
        
    },
    "reboot":function(){
        this.send(["R"]);
    },
    "ping":function(){        
        let that=this;
        this.send(["."]);
        this.pingTimeout=setTimeout(()=>{
            let evtDetail={ detail: {} };
            evtDetail.detail[that.deviceKey]=false;
            window.dispatchEvent(new CustomEvent("pong", evtDetail));
        },5000);
    },
    "send":function(payload){        
        this.ws.send(JSON.stringify(payload));
    }

};
