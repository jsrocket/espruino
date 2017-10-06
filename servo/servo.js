var servo = function() {
    var CURRENTPOS=null,
        PIN=null,
        INTERVAL=null,
        INTERVALTIME=20;
  
    return {
        init:function(params, cb){  
            var initResetSteps=10,
            that=this;
    
            if(typeof params.pin==='undefined'){ console.log('Servo Init Error - missing pin'); return false; }
            if(typeof params.start_at!=='undefined'){params.pos=params.start_at;}
            if(typeof params.is_at!=='undefined'){params.pos=params.is_at;}
            if(typeof params.interval_time!='undefined'){intervalTime=params.interval_time;}
            if(typeof params.init_steps!=='undefined'){initResetSteps=params.init_steps;}
    
            PIN=params.pin;
    
            var rPos=E.clip(params.pos*3,0.01,3);
            CURRENTPOS=rPos;

            if(typeof params.is_at==='undefined'){
                INTERVAL=setInterval(function(){
                    if(initResetSteps>0){
                      digitalPulse(PIN,1,rPos);
                      initResetSteps--;
                    }else{
                      that.stop();
                      if(cb){ cb(); }
                    }
                }, INTERVALTIME);
            }else{
              if(cb){ cb(); }
            }
        },
  
        moveTo:function(pos, time, holdTime, cb){
            var rPos=E.clip(pos*3,0.01,3).toFixed(2),
                posDelta,
                moveAmt=(1000/INTERVALTIME)*(time/1000),
                that=this,
                direction='cw',
                intervalKillSwitch=500;

            rPos=parseFloat(rPos);
    
            if(PIN===null){ 
              if(cb){ cb({"success":false, "details":"servo not initialized"}); }
              return false;
            }
    
            if(CURRENTPOS>rPos){
              posDelta=CURRENTPOS-rPos;
              direction='ccw';
            }else if(CURRENTPOS<rPos){
              posDelta=rPos-CURRENTPOS;
              direction='cw';
            }else{
              posDelta=0;
              direction='';
            }
   
            INTERVAL=setInterval(function(){
                if(direction==='cw'){
                    CURRENTPOS+=(posDelta/moveAmt);
                }else{
                    CURRENTPOS-=(posDelta/moveAmt);
                }
      
                CURRENTPOS=E.clip(parseFloat(CURRENTPOS.toFixed(2)),0.01,3);
      
                if((CURRENTPOS<rPos && direction==='cw') || (CURRENTPOS>rPos && direction==='ccw')){
                    digitalPulse(PIN,1,CURRENTPOS);
                }else{
                    that.stop();
                    CURRENTPOS=rPos;
        
                    if(holdTime>0){
                      that.holdPos(holdTime, cb);
                    }else{
                      if(cb){ cb({"success":true, "pos":CURRENTPOS}); }
                      return true;
                    }
                }
      
                intervalKillSwitch--;
                if(intervalKillSwitch<=0){
                    that.stop();
                }
      
            }, INTERVALTIME);
        },
  
        holdPos:function(time,cb){
            var heldFor=0,
                that=this;
        
            INTERVAL=setInterval(function(){
                heldFor+=INTERVALTIME;
                if(heldFor>=time){
                    that.stop();
                    if(cb){ cb({"success":true, "pos":CURRENTPOS}); }
                    return true;
                }else{
                    digitalPulse(PIN,1,CURRENTPOS);
                } 
            }, INTERVALTIME);
        },
  
        getPos:function(cb){ if(cb){ cb({"success":true, "pos":CURRENTPOS}); } },

        stop:function(){ clearInterval(INTERVAL); }
  
    };
};

exports = servo;
