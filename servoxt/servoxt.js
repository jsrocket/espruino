/* See the file LICENSE for copying permission. 
   
   Yet another servo module. Yes, I know it's pretty verbose but I'm not too worried about that and I will address that if space becomes an issue. 
*/

exports.connect = function (PPIN, PARAMS) {
    var CURRENTPOS=0,
        PIN=PPIN,
        INTERVAL=null,
        INTERVALTIME=20,
        MINPULSE=0,
        MAXPULSE=1
        
        if(PARAMS && typeof PARAMS.min_pulse!=='undefined'){ MINPULSE=PARAMS.min_pulse; }
        if(PARAMS && typeof PARAMS.max_pulse!=='undefined'){ MAXPULSE=PARAMS.max_pulse; }
        if(PARAMS && typeof PARAMS.interval_time!=='undefined'){ INTERVALTIME=PARAMS.interval_time; }
        if(PARAMS && typeof PARAMS.pos!=='undefined'){ CURRENTPOS=E.clip(PARAMS.pos*MAXPULSE,MINPULSE,MAXPULSE); }
        
  
    return {
        init:function(cb){  
            var initResetSteps=30,
            that=this;

            INTERVAL=setInterval(function(){
                if(initResetSteps>0){
                    digitalPulse(PIN,1,CURRENTPOS);
                    initResetSteps--;
                }else{
                    that.stop();
                    if(cb){ cb(); }
                }
            }, INTERVALTIME);
        },
  
        move:function(pos, time, holdTime, cb){
            if(INTERVAL!==null){ this.stop(); }
            
            var rPos=E.clip(pos*MAXPULSE,MINPULSE,MAXPULSE).toFixed(2),
                posDelta,
                moveAmt=(1000/INTERVALTIME)*(time/1000),
                that=this,
                direction='cw',
                intervalKillSwitch=5000;

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
      
                CURRENTPOS=E.clip(parseFloat(CURRENTPOS.toFixed(2)),MINPULSE,MAXPULSE);
      
                if((CURRENTPOS<rPos && direction==='cw') || (CURRENTPOS>rPos && direction==='ccw')){
                    digitalPulse(PIN,1,CURRENTPOS);
                }else{
                    that.stop();
                    CURRENTPOS=rPos;
        
                    if(holdTime===true){
                        that.holdPos(holdTime, cb);
                        if(cb){ cb({"success":true, "pos":CURRENTPOS}); }
                    }else if(holdTime>0){
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
                if(heldFor>=time && time!==true){
                    that.stop();
                    if(cb){ cb({"success":true, "pos":CURRENTPOS}); }
                    return true;
                }else{
                    digitalPulse(PIN,1,CURRENTPOS);
                } 
            }, INTERVALTIME);
        },
  
        getPos:function(){ return parseFloat((CURRENTPOS/MAXPULSE).toFixed(2)); },

        stop:function(){ try{ clearInterval(INTERVAL); INTERVAL=null; }catch(e){ console.log('clearInterval Error'); } }
  
    };
};
