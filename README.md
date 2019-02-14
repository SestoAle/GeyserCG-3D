# GeyserCG-3D

<p align="center">
<img  src="https://i.imgur.com/Kp82ApM.png" width="90%" height="90%"/>
</p>

The project aims to realize the geyser’s natural phenomenon caused by a water explosion through **WebGL** and **Three.js**
technologies.

The idea is to simulate the physics of water and steam particles:
* description of the motion of water particles following a parabolic trajectory;
* description of the randomic motion of steam particles in 3D space;
* creation of a pseudo-realistic scene.

The physics of the particles system is done thorough **shaders programming** with WebGL.

The project is developed by [Alessandro Sestini](https://github.com/SestoAle) and [Francesco Lombardi](https://github.com/fralomba)
## Shaders
There are two kinds of **vertex shaders**: 
* one is for water particles;
* one is for steam particles;

The ```vertex_water``` is responsible to move the water particle, following:

```javascript
<script type="x-shader/x-vertex" id="vertex_water_particles">
			
  attribute vec3 movements;
  uniform float t;
  uniform float pointDim;
  uniform float limitXZ;

  void main()
  {	

    float theta = movements.y;
    float v0r = movements.x;
    float v0y = movements.z;

    float v0x = v0r*cos(theta);
    float v0z = v0r*sin(theta);

    vec3 p = position;				

    p.x += v0x*t;
    p.y += -0.5*9.8*80.0*t*t+v0y*t;
    p.z += v0z*t;

    if(p.y < -1.0 || abs(p.x) > limitXZ || abs(p.z) > limitXZ){
      p.x = -0.1;
      p.y = -0.1;
      p.z = -0.1;
    } 

    vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
    gl_PointSize = pointDim * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
  }

</script>
```

Instead, the ```vertex_steam```moves the steam particles:
```javascript
<script type="x-shader/x-vertex" id="vertex_steam_particles">
			
  attribute vec3 movements;
  uniform float pointDim;
  uniform float t;
  uniform float limitXZ;

  void main()
  {	

    float omega = movements.x;
    float v0r = movements.y;
    float v0y = movements.z;

    vec3 p = position;				

    p.x += v0r*t*cos(omega);
    p.y += (v0y*t);
    p.z += v0r*t*sin(omega);

    if(abs(p.x) > limitXZ || abs(p.z) > limitXZ || p.y > 1200.0){
      p.x = -0.1;
      p.y = -0.1;
      p.z = -0.1;
    } 

    vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
    gl_PointSize = pointDim * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
  }

</script>
```

The fragment shader is shared between the two types of particles:

```javascript
<script type="x-shader/x-fragment" id="fragment_particles">
			
  uniform sampler2D texture_sampler;
  uniform float opacity;


  void main()
  {	

    if(opacity == 0.0){
      discard;		
    } else {
      gl_FragColor = texture2D(texture_sampler, gl_PointCoord);
      if(gl_FragColor.a < 0.5){
        discard;
      }
      gl_FragColor.a = opacity;	
    }

  }		

</script>
```

All the shaders are defined inside the ```index.html```file.

## Scene 

<p align="center">
<img  src="https://media.giphy.com/media/2wZYqyvqyeYZU3RCBX/giphy.gif" width="95%" height="95%"/>
</p>

The whole scene is set-up using Three.js; an interactable example is reachable [here](https://sestoale.github.io/GeyserCG-3D/).

Some controls have been implemented in order to let the users be able to customize their experience; an example is shown here:

<p align="center">
<img  src="https://i.imgur.com/q6BHdQ9.png" width="40%" height="40%"/>
</p>


## Report
A copy of the presentation can be found [here](https://github.com/SestoAle/GeyserCG-3D/raw/master/report/Slides3D%26CG.pdf).

## License
Licensed under the term of [MIT License](https://github.com/SestoAle/GeyserCG-3D/blob/master/LICENSE).
