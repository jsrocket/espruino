exports.init = function(PIN, PIXELCNT) {
  let PULSECNT=0;
  
  /*************************************************************
   * FADER
   * **********************************************************/
    let fader={
        "interval":null,
        "stepsRemaining":0,
        reset:function(){
            if(typeof this.interval==='number'){
               try{ clearInterval(this.interval); }catch(e){}
                this.interval=null;
            }
            this.stepsRemaining=0;
        }
    };
  
  /*************************************************************
   * BLINKER
   * **********************************************************/
  let blinker={
    "cnt":0,
    "time_on":1000,
    "time_off":1000,
    "pixel_colors":null,
    "blink_fx":'sync',
    "color_index":0,
    "pixel_index":0,
    "on":false,
    "cb":null,
    "timer":null,
    
    reset:function(){
        if(typeof this.timer==='number'){
            try{ clearTimeout(this.timer); }catch(e){}
            this.timer=null;
        }
        this.cnt=0;
        this.time_on=1000;
        this.time_off=1000;
        this.pixel_colors=null;
        this.blink_fx='sync';
        this.color_index=0;
        this.pixel_index=0;
        this.on=false;
        this.cb=null;
    },
    
    blink:function(){
      let pArray=new Uint8ClampedArray(PIXELCNT*3);
      
      if(this.cnt>0){
      
        switch(this.blink_fx){
          case 'random':
          break;
          case 'sequence':
            for(var p=0; p<pArray.length; p+=3){
              pArray[p]= ((this.pixel_index === (p/3)) ? this.pixel_colors[p] : 0);
              pArray[p+1]=((this.pixel_index === (p/3)) ? this.pixel_colors[p+1] : 0);
              pArray[p+2]=((this.pixel_index === (p/3)) ? this.pixel_colors[p+2] : 0);         
            } 
            
            this.pixel_index++;
            if(this.pixel_index>=PIXELCNT){
               this.pixel_index=0;
            }
            
          break;
          default: //sync
            for(var p=0; p<pArray.length; p+=3){
              pArray[p]=((this.on) ? this.pixel_colors[p] : 0);
              pArray[p+1]=((this.on) ? this.pixel_colors[p+1] : 0);
              pArray[p+2]=((this.on) ? this.pixel_colors[p+2] : 0);         
            }

            this.on=!this.on;
            
          break;
        }
        
        
        require("neopixel").write(PIN, pArray);
        this.cnt--;
        blinker.timer=setTimeout(function(){ blinker.blink();}, ((!blinker.on) ? blinker.time_on : blinker.time_off));
        
        return true;
        
      }else{        
        if(blinker.cb){
          responder(blinker.cb,[true,null,"blink complete"]);
        }

      }

    }
  };
  
  responder=function(cb,d){
    if(cb){cb({"success":d[0], "data":d[1], "details":d[2]});}
  };
  
  return {
      
    /********************************************************
       on 
    ********************************************************/
    on:function(color){
        if(typeof color[0]!=='object'){ color=[color]; }
        let pixels=new Uint8ClampedArray(PIXELCNT*3);
        
        let colorIndex=0;
        for(var p=0; p<pixels.length; p+=3){
            pixels[p]=color[colorIndex][0];
            pixels[p+1]=color[colorIndex][1];
            pixels[p+2]=color[colorIndex][2];
    
            colorIndex++;
            if(colorIndex>=color.length){ colorIndex=0; }
        }
        
        require("neopixel").write(PIN, pixels);
    },
    
    /********************************************************
       off 
    ********************************************************/
    off:function(){
      let pixels=new Uint8ClampedArray(PIXELCNT*3);
      
      blinker.reset();
      blinker.cnt=0;
      fader.reset();
      
      for(var p=0; p<pixels.length; p+=3){
          pixels[p]=0;
          pixels[p+1]=0;
          pixels[p+2]=0;
      }
      require("neopixel").write(PIN, pixels);
    },
    
    /********************************************************
       FADE
    ********************************************************/
    fade:function(params,cb){
      if(!params.from){ responder(cb,[false,null,"missing from color"]);} 
      if(typeof params.from[0]!=='object'){ params.from=[params.from]; }
      
      if(!params.to){ responder(cb,[false,null,"missing to color"]);} 
      if(typeof params.to[0]!=='object'){ params.to=[params.to]; }
      
      if(!params.time){params.time=1000;}
      
      
      fader.interval=null;
        let speed=(1000/20)*(params.time/1000),

          rStep=[],
          gStep=[],
          bStep=[],
          R=[],
          G=[],
          B=[],
          pixels=new Uint8ClampedArray(PIXELCNT*3);

        fader.stepsRemaining=speed
          
      for(var p=0; p<params.to.length; p++){  
            rStep[p]=(params.to[p][0]-params.from[p][0])/speed;
            gStep[p]=(params.to[p][1]-params.from[p][1])/speed;
            bStep[p]=(params.to[p][2]-params.from[p][2])/speed;
            R[p]=params.from[p][0];
            G[p]=params.from[p][1];
            B[p]=params.from[p][2];
      }
      
      let fromColorIndex=0;
      for(var p=0; p<pixels.length; p+=3){
          pixels[p]=params.from[fromColorIndex][0];
          pixels[p+1]=params.from[fromColorIndex][1];
          pixels[p+2]=params.from[fromColorIndex][2];
          
          fromColorIndex++;
          if(fromColorIndex>=params.from.length){
            fromColorIndex=0;
          }
      }         
      
      fader.interval=setInterval(function(){
        for(var p=0; p<params.to.length; p++){
          
          R[p]+=rStep[p];
          G[p]+=gStep[p];
          B[p]+=bStep[p];          
        }
        
        let colorIndex=0;
        for(var p=0; p<pixels.length; p+=3){
          pixels[p]=R[colorIndex];
          pixels[p+1]=G[colorIndex];
          pixels[p+2]=B[colorIndex];
          
          colorIndex++;
          if(colorIndex>=params.to.length){
            colorIndex=0;
          }
        }         
        
        if(fader.stepsRemaining<=0){
          fader.reset();
          responder(cb,[true,null,"fade complete"]);
        }else{
          require("neopixel").write(PIN, pixels);
          fader.stepsRemaining--;
        }
      },20);
    },
    
    /********************************************************
       PULSE
    ********************************************************/
    pulse:function(params,cb){
      
      if(!params.from){ responder(cb,[false,null,"missing from color"]);} 
      if(typeof params.from[0]!=='object'){ params.from=[params.from]; }
      
      if(!params.to){ responder(cb,[false,null,"missing to color"]);} 
      if(typeof params.to[0]!=='object'){ params.to=[params.to]; }
      
      if(!params.cnt){params.cnt=1;}
      
      if(!params.time_in){params.time_in=1000;}
      if(!params.time_out){params.time_out=1000;}
      
      let that=this;
      
      this.fade({
          "from":params.from,
          "to":params.to,
          "time":params.time_in
        },function(r){ 
          var theOtherThing=that;
          that.fade({
            "to":params.from,
            "from":params.to,
            "time":params.time_out
          },function(r){
              PULSECNT++;
            if(PULSECNT>=params.cnt){
              responder(cb,[true,null,"pulse complete"]);
              PULSECNT=0;
            }else{
              theOtherThing.pulse(params,cb);
            }
          });
        });
    },
    
    /********************************************************
       HEARTBEAT
    ********************************************************/
    heartbeat:function(params,cb){
      if(!params.color){ responder(cb,[false,null,"missing heartbeat color"]);} 
      if(typeof params.color[0]!=='object'){ params.color=[params.color]; }
      
      if(!params.cnt){params.cnt=1;}
      
      if(!params.rate){params.rate=1;}
      
      let that=this,
          firstBeatToColor=[],
          secondBeatToColor=[];
      
      params.color.forEach(function(color){
        firstBeatToColor.push([color[0]*0.25, color[1]*0.25, color[2]*0.25]);
        secondBeatToColor.push([color[0]*0.1, color[1]*0.1, color[2]*0.1]);
      });
      
      this.fade({
          "from":params.color,
          "to":firstBeatToColor,
          "time":350/params.rate
        },function(r){ 
          var theOtherThing=that;
          that.fade({
            "from":params.color,
            "to":secondBeatToColor,
            "time":550/params.rate
          },function(r){
              PULSECNT++;
            if(PULSECNT>=params.cnt){
              responder(cb,[true,null,"heartbeat complete"]);
              PULSECNT=0;
            }else{
              setTimeout(function(){theOtherThing.heartbeat(params,cb);},200);
            }
          });
        });
      
    },
    
    /********************************************************
       BLINK
    ********************************************************/
    blink:function(params,cb){
      blinker.reset();
      
      if(!params.color){ responder(cb,[false,null,"missing heartbeat color"]); return;} 
      if(typeof params.color[0]!=='object'){ params.color=[params.color]; }

      if(!params.cnt){params.cnt=1;}
      
      if(params.rate){ blinker.time_on=params.rate; blinker.time_off=params.rate;}else{
        if(!params.time_on){params.time_on=1000;}
        blinker.time_on=params.time_on;

        if(!params.time_off){params.time_off=1000;}
        blinker.time_off=params.time_off;
      }

      if(!params.color_fx){params.color_fx="set";}
      blinker.color_fx=params.color_fx;
      
      if(!params.blink_fx){params.blink_fx="sync";}
      blinker.blink_fx=params.blink_fx;
      
        switch(params.blink_fx){
            case 'sync':
                blinker.cnt=params.cnt*2;
            break;
            case 'sequence':
                blinker.cnt=params.cnt*PIXELCNT;
            break;
        }
      
      if(cb){ blinker.cb=cb;}

      
      
      let interval=null,      
          pixels=new Uint8ClampedArray(PIXELCNT*3);
      
      //We want to fill all the colors if the amount of color set in is less than the cnt of pixels
      let colorIndex=0;
      for(var p=0; p<pixels.length; p+=3){
        pixels[p]=params.color[colorIndex][0];
        pixels[p+1]=params.color[colorIndex][1];
        pixels[p+2]=params.color[colorIndex][2];

        colorIndex++;
        if(colorIndex>=params.color.length){ colorIndex=0; }
      }
       
      blinker.pixel_colors=pixels; 
      
      blinker.blink();
     
    }
    
  };
};
