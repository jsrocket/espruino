Pixelfx - A Neopixel Effects Module For The Espruino
==========================================

The Pixelfx module is meant to help take care of basic lighting effects using NeoPixels.

You can then use these basic building blocks to create more complex lighting effects specific to your project. 

Current Effects Methods
--------
### on(color)
This will simply turn on Neopixels and set them to the color defined.

To turn on all pixels the same color, simply pass in an array defining your RGB color.

```
pixelfx.on([255,0,0]);
```

If you wish to specify a different color for each pixel, pass in an array of arrays. In the example code below, if you have three pixels, they will each be set to a different color.  If you have more than three pixels, the pattern passed in will repeat to illuminate all LEDs.

```
pixelfx.on([[255,0,0],[0,50,0],[0,0,30]]);
```


### off()
Turns all pixels off.

```
pixelfx.off();
```

### blink(params, callback)

#### Params
  - **cnt** - (default: 1) - The number of times the pixels should blink.
  - **time_on** - (default: 1000) - The length of time in milliseconds that the pixel should stay on during a blink.
  - **time_off** - (default: 1000) -The length of time in milliseconds that the pixel should stay off during a blink.
  - **color**: - 
  - **blink_fx** (default: sync)  sync | sequence
    - sync
    - sequence
  
  ```
  p.blink({
    'cnt':5,
    'time_on':1000,
    'time_off':100,
    'color':[[0,50,0],[50,0,0],[0,0,50]], 
    'blink_fx':'sync'
  }, function(r){ console.log(r); });
  
  ```

### pulse

### fade

### heartbeat
