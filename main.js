/*
Nicholas G Bennett

Vite used for dependancy management 
Not Deepweb compliant: WebGL

Demo written for Herrara 
*/

//Import Section
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MouseMeshInteraction } from './three_mmi.js';

//Creation of various objects and settings used during rendering.
//Boilerplate
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const scene = new THREE.Scene();

let selectedCoords = "";
const header = document.getElementById("cords");

const camera = new THREE.PerspectiveCamera( 125, sizes.width / sizes.height, 0.1, 1000 );
//For the renderer, make sure to target the same class as the Canvas Tag in your Index.HTML
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.domElement.addEventListener("click", onclick, true);

const mmi = new MouseMeshInteraction(scene, camera);

//Add an Event Listener so that if the window resizes, the canvas also resizes
//Boilerplate
window.addEventListener('resize', () =>{
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//Set Render and camera, default is middle of screen
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(25);
camera.position.setY(25);


const floorGeometery = new THREE.BoxGeometry(120,-1,120);
const floorTexture = new THREE.TextureLoader().load('air-photo.jpeg');
const floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture});

const floor = new THREE.Mesh(floorGeometery, floorMaterial);
floor.position.set(0,-1,0);
scene.add(floor);

//A light source will illuminate a given non basic object
//Point lights have a given position and shine light from that direction
const gridHelper = new THREE.GridHelper(120, 50);
scene.add(gridHelper);

//Ambient Light cast light equally across the scene
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight)

//Instance Orbit controls to enable camera movement
const controls = new OrbitControls( camera, renderer.domElement );
controls.maxDistance = 65;
controls.minDistance = 15;
controls.maxPolarAngle = Math.PI * 0.35;

//Create background "stars"
function addStar(){
  //Geometry and Material
  const sphereGeometry = new THREE.SphereBufferGeometry(0.55, 100, 100);
  const sphereMaterial = new THREE.MeshStandardMaterial( { color: 'white' });
  const star = new THREE.Mesh( sphereGeometry, sphereMaterial );

  //Create random positions for the star, then place it in the scene 
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(50));
  star.name = "X = " + x + " Y = " + z;
  star.position.set(x,0,z);
  mmi.addHandler(star.name, "click", function(mesh){
    console.log(star.name);
    selectedCoords = star.name;
  })
  scene.add(star);
}
//I literally did not know this worked lmao
Array(50).fill().forEach(addStar);

//Texture allows you to grab an image and use it as the texture of a given object, or feature
//If you are loading this externally, you may need to Async, and start this elsewhere in the code and get a call back function when loading is complete.
const spaceTexture = new THREE.TextureLoader().load('blue-sky.png');
//Set the background to the texture of your choice.
scene.background = spaceTexture;

//Create a recursive animation loop, this is where the rendering happens
//Changes happen every single call, changing the parameters here will "animate" your code
function animate(){
  requestAnimationFrame(animate);

  mmi.update();

  //Update controls
  controls.update();

  if(selectedCoords != ""){
    header.innerHTML = "Coordinates: " + selectedCoords;
  }


  // .render is draw
  renderer.render( scene, camera );
}
//Call the animation
animate();