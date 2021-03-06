
//Random value between range 
function random_range(a,b){
	
	return (b-a)*Math.random() + a;
	
}

//Loading texture particles
var texture_water_drop = new THREE.TextureLoader().load('texture/water_drop1.png');
var texture_steam_drop = new THREE.TextureLoader().load('texture/steam_drop.png');
//Default particles value
var waterDropDim = 8.0;
var steamDropDim = 8.0;
var waterOpacity = 1.0;
var steamOpacity = 0.5;
var v0y_water = 1000;
var v0y_steam = 300;
var jMax_water = 70;

//Create the particles
function create_particles_water(n, sigma){
	
	var jMax_steam = 100 - jMax_water;
	var A = 5;
	//Inizializing the buffers
	var vertices_water = new Float32Array(n*jMax_water*3);
	var movements_water = new Float32Array(n*jMax_water*3);
	var vertices_steam = new Float32Array(n*jMax_steam*3);
	var movements_steam = new Float32Array(n*jMax_steam*3);
	var theta;
	var rp;
	var x;
	var z;
	
	var particleGeometry_water = new THREE.BufferGeometry();
	var particleGeometry_steam = new THREE.BufferGeometry();
	
	for(var i=0; i<n; i++){
		
		var z = (A/n)*(n-i);
		
		//External radius
		var R = Math.sqrt(-2*(sigma^2)*Math.log(z/A));
		
		//Internal Radius
		if(i==0){
			r = 0;
		}else{
			var zp = (A/n)*(n-i+1);
			var r = Math.sqrt(-2*(sigma^2)*Math.log(zp/A));
		}
		
		if(i == 0){
			
		} else {
			for(var j=0; j<jMax_water; j++){
				theta = random_range(0,2*Math.PI);
	            rp = random_range(r,R);
	
	            x = rp*Math.cos(theta);
	            z = rp*Math.sin(theta);
	             
	            vertices_water[i*jMax_water*3 + j*3] = x;
	            vertices_water[i*jMax_water*3 + j*3 + 1] = 0;
	            vertices_water[i*jMax_water*3 + j*3 + 2] = z;
	            
	            movements_water[i*jMax_water*3 + j*3] = random_range(0,150);
	            movements_water[i*jMax_water*3 + j*3 + 1] = theta;
	            movements_water[i*jMax_water*3 + j*3 + 2] = random_range(500,v0y_water);

			}
			
			for(var j=0; j<jMax_steam; j++){
				theta = random_range(0,2*Math.PI);
	            rp = random_range(r,R);
	
	            x = rp*Math.cos(theta);
	            z = rp*Math.sin(theta);
	             
	            vertices_steam[i*jMax_steam*3 + j*3] = x;
	            vertices_steam[i*jMax_steam*3 + j*3 + 1] = 0;
	            vertices_steam[i*jMax_steam*3 + j*3 + 2] = z;
	            
	            movements_steam[i*jMax_steam*3 + j*3] = random_range(0,2*Math.PI);
	            movements_steam[i*jMax_steam*3 + j*3 + 1] = random_range(0,150);
	            movements_steam[i*jMax_steam*3 + j*3 + 2] = random_range(1,v0y_steam);
				
			}
		}
	}
	
	//Binding buffers to the shaders
	particleGeometry_water.addAttribute('position', new THREE.BufferAttribute(vertices_water, 3));
	particleGeometry_water.addAttribute('movements', new THREE.BufferAttribute(movements_water, 3));
	
	particleGeometry_steam.addAttribute('position', new THREE.BufferAttribute(vertices_steam, 3));
	particleGeometry_steam.addAttribute('movements', new THREE.BufferAttribute(movements_steam, 3));
	
	//Inizializing uniforms variable for each type of particles
    var uniforms_water = {
		t: {value: 0.0},
		texture_sampler: {type: 't', value: texture_water_drop},
		pointDim: {value: waterDropDim},
		opacity: {value: waterOpacity},
		limitXZ: {value: cubeSize/2},
	};
	
	var uniforms_steam = {
		t: {value: 0.0},
		texture_sampler: {type: 't', value: texture_steam_drop},
		opacity: {value: steamOpacity},
        pointDim: {value: steamDropDim},
        limitXZ: {value: cubeSize/2},
    };
	
	//Inizializing custom shaders
	particleMaterial_water = new THREE.ShaderMaterial({  
		uniforms: uniforms_water,
		vertexShader: document.getElementById('vertex_water_particles').textContent,
		fragmentShader: document.getElementById('fragment_particles').textContent,
		blending: THREE.AdditiveBlending,
		transparent: true,
		alphaTest: 0.5
	});
	
	particleMaterial_steam = new THREE.ShaderMaterial({  
		uniforms: uniforms_steam,
		vertexShader: document.getElementById('vertex_steam_particles').textContent,
		fragmentShader: document.getElementById('fragment_particles').textContent,
		blending: THREE.AdditiveBlending,
		transparent: true,
		alphaTest: 0.5
	}); 
	
	//Adding particles to the scene
	var particlePoints_water = new THREE.Points( particleGeometry_water, particleMaterial_water );
	var particlePoints_steam = new THREE.Points( particleGeometry_steam, particleMaterial_steam );
	particlePoints_steam.sortParticles = true;
	particlePoints_water.sortParticles = true;
	ground.add(particlePoints_water);
	ground.add(particlePoints_steam);
	
	return [particlePoints_water, particlePoints_steam];
	
}






