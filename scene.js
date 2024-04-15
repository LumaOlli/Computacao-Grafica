//import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

//Redimensionando conteudo para caber em tela pequena
window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectMatrix;
});

//Movimentação da camera
var controleMouse = new THREE.OrbitControls(camera, renderer.domElement);
controleMouse.update();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
document.body.appendChild( renderer.domElement );

//Create a PointLight and turn on shadows for the light
const light = new THREE.PointLight( 0xffffff, 4, 100 );
light.position.set( 5, 5, 7 );
light.castShadow = true; // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 1024; // default
light.shadow.mapSize.height = 1024; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

//fazer assim o SKYBOX!!!
//Create a sphere that cast shadows (but does not receive them)
const sphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.castShadow = true; //default is false
sphere.receiveShadow = false; //default
//scene.add( sphere );

//Luz ambiente
const luz2 = new THREE.HemisphereLight(0xffffff, 0xff0000, 0.01);
scene.add(luz2);

//Create a plane that receives shadows (but does not cast them)
const planeGeometry = new THREE.PlaneGeometry( 20, 20, 32, 32 );
//const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
const planeMaterial = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_bottom.jpeg' ), side: THREE.DoubleSide }) //down side
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
scene.add( plane );

plane.rotation.x = -Math.PI/2;
plane.position.y = -0.04;

//Create a helper for the shadow camera (optional)
const helper = new THREE.CameraHelper( light.shadow.camera );
scene.add( helper );

camera.position.z = 5;
camera.position.y = 2

let maquina = new THREE.Object3D();
const loader = new THREE.GLTFLoader();

let t = 0;

loader.load(

    "locomotive/maquinac.gltf",

    function (maquinaScene) {
      maquina = maquinaScene.scene.children[0];
      maquinaScene.scene.children[0].scale.set(2, 2, 2);
      maquina.castShadow = true;
      scene.add(maquinaScene.scene);
    }
  );

  loader.load(
    
    "rail/trilhoc.gltf", 
    
    function (trilhoScene) {
      trilho = trilhoScene.scene.children[0];
      trilhoScene.scene.children[0].scale.set(2, 2, 2);
      trilho.castShadow = true;
      scene.add(trilhoScene.scene);
    }
  );

   //Cria um cubo como parte do cenário(skybox)
  const geometry1 = new THREE.BoxGeometry( 10, 10, 10 );
  var cubeMaterials = [ 
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "img/Imagem_back.jpeg" ), side: THREE.DoubleSide }), //back side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_front.jpeg' ), side: THREE.DoubleSide }), //front side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_top.jpeg' ), side: THREE.DoubleSide }), //up side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_bottom.jpeg' ), side: THREE.DoubleSide }), //down side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_right.jpeg' ), side: THREE.DoubleSide }), //right side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_left.jpeg' ), side: THREE.DoubleSide }) //left side
  ];
 
  var cubeMaterial1 = new THREE.MeshFaceMaterial( cubeMaterials );
  const cube = new THREE.Mesh( geometry1, cubeMaterial1 );
  cube.position.y += 4.95;
  //cube.castShadow = true; //default is false
  cube.receiveShadow = true; //default
  scene.add( cube );

  //Carregando áudio
  const walk = new THREE.AudioListener();
  camera.add(walk);

  //Criando som de piui
  const soundWalk = new THREE.Audio(walk);

  //Carregando arquivo de som
  const audioLoaderWalk = new THREE.AudioLoader();
  audioLoaderWalk.load("sounds/piui.mp3", function (buffer) {
    soundWalk.setBuffer(buffer);
    soundWalk.setLoop(true);
    soundWalk.setVolume(0.5);
  });

  //Inicializa o estado da tecla de espaço
  let isSpacePressed = false;

  //Ativa quando a tecla é pressionada
  window.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
      isSpacePressed = true;
      soundWalk.play();
      console.log("Tecla de espaço pressionada");
    }
  });

  //Ativa quando uma tecla é liberada depois de ser pressionada
  window.addEventListener("keyup", function (event) {
    if (event.code === "Space") {
      isSpacePressed = false;
      soundWalk.pause();
      console.log("Tecla de espaço liberada");
    }
  });

// Variável para rastrear o modo de visualização da câmera
let topViewMode = false;

// Ativa quando uma tecla é pressionada
window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowUp":
      camera.position.z -= 0.1;
      break;
    case "ArrowDown":
      camera.position.z += 0.1;
      break;
    case "ArrowLeft":
      camera.position.x -= 0.1;
      break;
    case "ArrowRight":
      camera.position.x += 0.1;
      break;
    case "c":
    case "C":
      if (topViewMode) {
        // Volta para a câmera normal
        camera.position.set(0, 2, 5);
        camera.lookAt(0, 0, 0); // Mantém o foco no centro da cena
        topViewMode = false;
      } else {
        // Alterna para a visão superior
        camera.position.set(0, 10, 0); // Posição da câmera para a visão superior
        camera.lookAt(0, 0, 0); // Foca no centro da cena
        topViewMode = true;
      }
      break;
  }
});

  let isStopKeyPressed = true; // Inicialmente, o trem está parado

  // Ativa quando uma tecla é pressionada
  window.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // Alterna o estado da tecla de parada
      isStopKeyPressed = !isStopKeyPressed;

      if (isStopKeyPressed) {
        console.log("Tecla Enter pressionada - Parando o trem");
      } else {
        console.log("Tecla Enter pressionada - Retomando movimento do trem");
      }
    }
  });

  function animate() {
    requestAnimationFrame(animate);


    maquina.rotation.y = -(t - Math.PI/2);
    
    if (maquina) {
        // Raio do círculo
        const radius = 0.0001; 
        // Velocidade de rotação
        const speed = 0.01; 

        // Calcula a posição do trem ao longo do círculo
        const x = radius * Math.cos(t);
        const z = radius * Math.sin(t);

        // Define a posição do trem
        maquina.position.set(x, 0, z);

        // Incrementa o ângulo
        if (!isStopKeyPressed) {
        t += speed;
        }
        // Mantém o ângulo dentro do intervalo [0, 2 * PI]
        if (t > 2 * Math.PI) {
        t -= 2 * Math.PI;
        }
    }
    
  renderer.render(scene, camera);
}

animate();