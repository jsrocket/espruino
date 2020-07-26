# Table Of Contents
 1. [Overview](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme.md)
 2. **Websocket server**
 3. [Espruino Module](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_espruino.md)
 4. [Browser JS](https://github.com/protoroboticsgit/espruino/blob/master/devicerc/readme_browser.md)
 5. [Example](https://github.com/protoroboticsgit/espruino/tree/master/devicerc/example)
----------------------------------------------

# Websocket Server

## Install NodeJS Server

 1. Download the files in the ```/server``` directory
 2. Create a ```.env``` file containing the ```PORT``` value you want the ws server to listen on.
 3. Run ```npm install```
 4. Run the ```server.js``` under PM2 or your favorite process manager
 5. I recommend putting [nginx in front of your ws server as a proxy](https://www.nginx.com/blog/websocket-nginx/)

**Note** - If you can't or don't want to run your own server, feel free to use my shared one at ```wss://publicwss.robotictheater.com```. Be warned, I will do my best but this server comes with no promises or guarantees of uptime. If you want a guarantee of uptime, [I'm always available for hire](mailto:ken@kensapps.com).
