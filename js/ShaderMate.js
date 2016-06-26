var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({antialias:false});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x555555)
document.body.appendChild( renderer.domElement );

var geometry = new THREE.TorusKnotGeometry( 1 , 0.3 , 64 , 32 );
// var geometry = new THREE.SphereGeometry( 1 , 12, 12 );
// var geometry = new THREE.BoxGeometry( 1,1,1 );

var dLight = new THREE.DirectionalLight( 0xFFFFFF , 0.5 );
dLight.position.set(1,1,1);
scene.add(dLight);

var aLight = new THREE.AmbientLight( 0x7F7F7F );
scene.add(aLight);

vertexShader = [
	'precision mediump float;',
	'varying vec3 vNormal;',
	'varying float vDepth;',
	'void main() ',
	'{',
		'vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;',
		'vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		// 'vDepth = (2.0 * pos.z - 0.1 - 1000.0) / (1000.0 - 0.1) / pos.w;',
		'float zFar = 1000.0;',
		'float zNear = 0.1;',
		'vDepth = 2.0*zFar*zNear / (zFar + zNear - (zFar - zNear)*(2.0*pos.z - 1.0));',
		// 'vDepth = pos.z;',
		'gl_Position = pos;',
	'}',
].join('\n');

testFragmentShader = [

	// 'precision mediump float;',

	// from vert shader
	'varying vec3 vNormal;',
	'varying float vDepth;',
	
	'void main() ',
	'{',
		'vec3 nNormal = normalize(vNormal);',
		'float NDotL = 0.0;',
		// 'for (int i = 0; i < NUM_DIR_LIGHTS; i++)',
			// 'NDotL += dot(nNormal, directionalLightDirection[i]);',
			// 'NDotL += 0.2;',
		'vec3 outCol = vec3(0.5+0.5*nNormal);',
		'gl_FragColor = vec4(outCol, 1.0);',
	'}'

].join('\n');

var material = new THREE.ShaderMaterial( {
	vertexShader: vertexShader,
	fragmentShader: testFragmentShader,
	shading: THREE.SmoothShading
} );

material.needsUpdate = true;

var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );
camera.position.z = 5;

var stats = new Stats();
stats.setMode( 0 );
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

animate();
function animate () {

	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.007;

	requestAnimationFrame(animate);
	render();
}
function render()
{
	renderer.render(scene, camera);

	stats.update();
}

function resize() {
	renderer.setSize( window.innerWidth , window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
};
window.addEventListener( 'resize', resize, false );
resize();