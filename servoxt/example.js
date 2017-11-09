var servo=require('https://github.com/jsrocket/espruino/blob/master/servoxt/servoxt.min.js').connect(A0,{"min_pulse":0.3, "max_pulse":2.5, "pos":0, "interval_time":20});


servo.init(function(){
  console.log('The servo is now initialized and ready to use.');
});




/****************************************************************************************

EXAMPLE 1: Lets move the servo to the midpoint.

  servo.move(0.5, 500, 0, function(){ console.log('Finished moving'); });


===============================================


EXAMPLE 2: Lets move the servo back to 0 and then back to the midpoint.

  servo.move(0, 500, 0, function(){ 
    servo.move(0.5, 500, 0); 
  });


===============================================


EXAMPLE 3: Lets move the servo back to 0 and then back to the midpoint and how hold it for 5 seconds. 

  servo.move(0, 500, 0, function(){ 
    servo.move(0.5, 500, 5000); 
  });




===============================================


EXAMPLE 4: Lets stop the servo while it's moving and get the position

  servo.init(function(){
    servo.move(0, 2000,0, function(){
      servo.move(1, 2000,0, function(){
        servo.move(0, 2000,0, function(){
          servo.move(0.5, 200,5000, function(){});
        });
      });
    });
  });


  servo.stop(); 
  servo.getPos();


===============================================

  NOTE:
  In this example file, the pulse min and max values are set to what I find works well for TowerPro sg90 servos. 
  
  Depending on the servo you are using, you may have to increase the max pulse if you find it's not fully rotating or decrease it if you find it is trying to roate too far.


****************************************************************************************/


