ServoXT Module
===========

I built this module initially because I could not get my servos to rotate to complete 0 or 180 degrees when using the built-in Espruino servo module. I also added some other features that the main Espruino module does not have including:

 - An init funciton to set the initial starting position
 - The ability for the servo to hold a certain position before turning off
 - The ability to stop the servo motion
 - A function to get the current position the servo thinks it's at.

Methods
--------------
### connect(pin, params)

#### pin
Set the pin your servo is connected to

#### params

 - **min_pulse** - Set the minimum pulse width for your servo in milliseconds. For example the TowerPro sg90 seems to have a min pulse width of 500µs or 0.5ms
 - **max_pulse** - Set the maximum pulse width for your servo in milliseconds. For example the TowerPro sg90 seems to have a max pulse width of 2400µs or 2.4ms
 - **pos** - A number between 0 and 1. The starting point the servo will move to when you call the init function.
 
```
var servo=require('https://raw.githubusercontent.com/jsrocket/espruino/master/servoxt/servoxt.min.js').connect(A0,{
 "min_pulse":0.5, 
 "max_pulse":2.5, 
 "pos":0.5
});
```
 
---------------------------------------

### init(callback)

When you are ready to start using your servo, call the init method. It will quickly move the servo to the starting position defined when you called "connect".

```
servo.init(function(){
 // Now you are ready to use your sevo.
});
```

### move(pos, time, hold, callback)

 - **pos** - A number between 0 and 1. The position you want the servo to move to.
 - **time** - The length of time in milliseconds that the servo should take to move to the desired position.
 - **hold** - The length of time in milliseconds the servo should stay powered on and activly "hold" the current position. If set to **true** the servo will hold the position indefinitely until you call() the move() or stop method. 
 - **callback** - Will be fired once the servo has completed it's motion. 
 
```
//This will cause the servo to take 2s to move to the midpoint. It will not activly hold the position.
servo.move(0.5, 2000, 0, function(res){
  console.log(res);
});

//This will cause the servo to take half a second to move to the extreme counter-clockwise position and activly hold it for 2.5 seconds.
servo.move(1, 500, 2500, function(res){
  console.log(res);
});
```
 
### stop()

Calling this will cause the servo to stop at it's current position.

```
servo.stop();
```

### getPos()

This will return the current position of the servo.

```
var servoPosition = servo.getPos();
```

Demo
--------------

```
var servo=require('https://raw.githubusercontent.com/jsrocket/espruino/master/servoxt/servoxt.min.js').connect(A0,{"min_pulse":0.5, "max_pulse":2.5, "pos":0.5});

servo.init(function(){
  servo.move(0, 400,0, function(){
    servo.move(1, 400,0, function(){
      servo.move(0.4, 400,0, function(){
        servo.move(0.5, 100,0, function(){});
      });
    });
  });
});
```

Example JS File
--------------
You can load this JS file into the Espruino Web IDE to see how it works.

https://github.com/jsrocket/espruino/blob/master/servoxt/example.js
