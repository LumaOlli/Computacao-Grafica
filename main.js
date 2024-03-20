import * as THREE from 'three';
import { GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00});
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );


const luz1 = new THREE.HemisphereLight(0xffffff , 0xff0000, 10);
scene.add(luz1);

const loader = new GLTFLoader();

let trem =null;

loader.load(
	// resource URL
	'modelo/asteroide.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );
		gltf.scene.children[0].scale.set(0.5, 0.5, 0.5);
		trem = gltf.scene.children[0];

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

camera.position.z = 5;

let t = 0;


function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x = 0.01;
	cube.rotation.y = 0.01;
	
	t +=0.5;
	let angulo = 0.04*t;
	trem.position.z = 1*Math.sin(angulo);
	trem.position.x = 5*Math.cos(angulo);


	if(trem){
		//trem.rotation.x +=0.01;
		trem.rotation.y = -angulo;

	}

	renderer.render( scene, camera );
}
animate();
