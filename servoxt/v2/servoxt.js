exports.connect = function (pin,options) {
  var interval, currentPos;
  var offs = 1, mul = 1;
  const INTERVALTIME=20;

  if (options && options.range) {
    mul = options.range;
    offs = 1.5-(mul/2);
  }

    return {
        move:function(pos, time, holdTime,  callback) {
            let that=this;
            if (time===undefined) time = 1000;
            var amt = 0;
            if (currentPos===undefined) currentPos = pos;
            if (interval)
            clearInterval(interval);
            var initial = currentPos;
            interval = setInterval(function() {
                if (amt>1) {
                    clearInterval(interval);
                    interval = undefined;
                    amt = 1;
                    if(typeof holdTime!=="undefined" && holdTime!==null && holdTime>0){
                        if(holdTime===true){
                            that.hold(holdTime);
                            if(callback){ callback(); }
                        }else{
                            that.hold(holdTime, callback);
                        }
                        
                    }else if(callback){
                        callback();
                    }                    
                }
                currentPos = pos*amt + initial*(1-amt);
                digitalPulse(pin, 1, offs+E.clip(currentPos,0,1)*mul);
                amt += 1000.0 / (20*time);
            }, INTERVALTIME);
        },
        hold:function(time, cb){
            let heldFor=0;
            interval = setInterval(function() {
                heldFor+=INTERVALTIME;

                if(heldFor<time && time===true){
                    digitalPulse(pin, 1, offs+E.clip(currentPos,0,1)*mul);                    
                }else{
                    clearInterval(interval);
                    interval = undefined;
                    if(cb){ cb(); }
                }
            }, INTERVALTIME);
        },
        stop:function(){ try{ clearInterval(interval); interval=null; }catch(e){ console.log('clearInterval Error',e); } }
    };
};
