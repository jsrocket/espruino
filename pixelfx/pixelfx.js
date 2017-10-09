var pixelfx = function(PIN, PIXELCNT) {
  var PULSECNT=0;
  
  responder=function(cb,d){
    if(cb){cb({"success":d[0], "data":d[1], "details":d[2]});}
  };
  
  return {
    
    /********************************************************
       off
    ********************************************************/
    off:function(){
      var pixels=new Uint8ClampedArray(PIXELCNT*3);
      
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
      
      
      var interval=null,
          speed=(1000/20)*(params.time/1000),

          rStep=[],
          gStep=[],
          bStep=[],
          R=[],
          G=[],
          B=[],
          stepsRemaining=speed;
          
          pixels=new Uint8ClampedArray(PIXELCNT*3);
          
      for(var p=0; p<params.to.length; p++){  
            rStep[p]=(params.to[p][0]-params.from[p][0])/speed;
            gStep[p]=(params.to[p][1]-params.from[p][1])/speed;
            bStep[p]=(params.to[p][2]-params.from[p][2])/speed;
            R[p]=params.from[p][0];
            G[p]=params.from[p][1];
            B[p]=params.from[p][2];
      }
      
      var fromColorIndex=0;
      for(var p=0; p<pixels.length; p+=3){
          pixels[p]=params.from[fromColorIndex][0];
          pixels[p+1]=params.from[fromColorIndex][1];
          pixels[p+2]=params.from[fromColorIndex][2];
          
          fromColorIndex++;
          if(fromColorIndex>=params.from.length){
            fromColorIndex=0;
          }
      }         
      
      interval=setInterval(function(){
        for(var p=0; p<params.to.length; p++){
          
          R[p]+=rStep[p];
          G[p]+=gStep[p];
          B[p]+=bStep[p];          
        }
        
        var colorIndex=0;
        for(var p=0; p<pixels.length; p+=3){
          pixels[p]=R[colorIndex];
          pixels[p+1]=G[colorIndex];
          pixels[p+2]=B[colorIndex];
          
          colorIndex++;
          if(colorIndex>=params.to.length){
            colorIndex=0;
          }
        }         
        
        if(stepsRemaining<=0){
          clearInterval(interval);
          responder(cb,[true,null,"fade complete"]);
        }else{
          //console.log(pixels);
          require("neopixel").write(PIN, pixels);
          stepsRemaining--;
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
      
      var that=this;
      
      this.fade({
          "from":params.from,
          "to":params.to,
          "time":params.time_in
        },function(r){ 
          
          that.fade({
            "to":params.to,
            "from":params.from,
            "time":params.time_out
          },function(r){   
            
            if(PULSECNT>params.cnt){
              responder(cb,[true,null,"pulse complete"]);
              PULSECNT=0;
            }else{
              PULSECNT++;
              this.pulse();
            }
          });
        });
    },
  };
};
