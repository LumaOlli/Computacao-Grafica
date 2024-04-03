function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //redimensionando conteudo para caber em tela pequena
  window.addEventListener("resize", function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectMatrix;
  });

  //movimentação da camera
  var controleMouse = new THREE.OrbitControls(camera, renderer.domElement);
  controleMouse.update();

  //luz direcional 
  const luz1 = new THREE.DirectionalLight( 0xffffff );
  scene.add( luz1 );

  const ajudante = new THREE.DirectionalLightHelper( luz1, 10 );
  scene.add( ajudante );

  //luz ambiente
  const luz2 = new THREE.HemisphereLight(0xffffff, 0xff0000, 10);
  scene.add(luz2);

  let maquina = new THREE.Object3D();
  const loader = new THREE.GLTFLoader();

  loader.load(

    "locomotive/maquinac.gltf",

    function (maquinaScene) {
      maquina = maquinaScene.scene.children[0];
      maquinaScene.scene.children[0].scale.set(2, 2, 2);
      scene.add(maquinaScene.scene);
    }
  );

  loader.load(
    
    "rail/trilhoc.gltf", 
    
    function (trilhoScene) {
      trilho = trilhoScene.scene.children[0];
      trilhoScene.scene.children[0].scale.set(2, 2, 2);
      scene.add(trilhoScene.scene);
    }
  );

  //piso
  /*const geometry = new THREE.PlaneGeometry( 10, 10 );
  const material = new THREE.MeshBasicMaterial( {color: 0x40b620 , side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = Math.PI / 2;
  plane.position.y -= 0.02;
  scene.add( plane );*/

  //ceu  prcura outras imagens
  const geometry1 = new THREE.BoxGeometry( 10, 10, 10 );
  var cubeMaterials = [ //skybox  faces
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "img/Imagem_back.jpeg" ), side: THREE.DoubleSide }), //back side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_front.jpeg' ), side: THREE.DoubleSide }), //front side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_top.jpeg' ), side: THREE.DoubleSide }), //up side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_bottom.jpeg' ), side: THREE.DoubleSide }), //down side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_right.jpeg' ), side: THREE.DoubleSide }), //right side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'img/Imagem_left.jpeg' ), side: THREE.DoubleSide }) //left side
];
  //const material1 = new THREE.MeshBasicMaterial( {color: 0x84eae9, side: THREE.DoubleSide} );
  var cubeMaterial1 = new THREE.MeshFaceMaterial( cubeMaterials );
  const cube = new THREE.Mesh( geometry1, cubeMaterial1 );
  //plane.rotation.x = Math.PI / 2;
  //plane.position.y -= 0.01;
  cube.position.y += 4.95;
  scene.add( cube );

  camera.position.z = 5; // Afastado da cena para melhor visualização
  camera.position.y += 2;

  let t = 0;

  // Carregando áudio
  const walk = new THREE.AudioListener();
  camera.add(walk);

  // Criando som de piui
  const soundWalk = new THREE.Audio(walk);

  // Carregando arquivo de som
  const audioLoaderWalk = new THREE.AudioLoader();
  audioLoaderWalk.load("sounds/piui.mp3", function (buffer) {
    soundWalk.setBuffer(buffer);
    soundWalk.setLoop(true);
    soundWalk.setVolume(0.5);
  });

  let isSpacePressed = false;

  window.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
      isSpacePressed = true;
      soundWalk.play();
      console.log("Tecla de espaço pressionada");
    }
  });

  window.addEventListener("keyup", function (event) {
    if (event.code === "Space") {
      isSpacePressed = false;
      soundWalk.pause();
      console.log("Tecla de espaço liberada");
    }
  });
  
  function animate() {
    requestAnimationFrame(animate);

    maquina.rotation.y = -(t - Math.PI/2);
    //trem.rotation.z- = 0.01;
    //trem.rotation.z = 0.01;
    
    if (maquina) {
      const radius = 0.0001; // Raio do círculo
      const speed = 0.01; // Velocidade de rotação

      // Calcula a posição do trem ao longo do círculo
      const x = radius * Math.cos(t);
      const z = radius * Math.sin(t);

      // Define a posição do trem
      maquina.position.set(x, 0, z);

      // Incrementa o ângulo
      t += speed;

      // Mantém o ângulo dentro do intervalo [0, 2 * PI]
      if (t > 2 * Math.PI) {
        t -= 2 * Math.PI;
      }
    }

    renderer.render(scene, camera);
  }
  
  animate();
}

document.addEventListener("DOMContentLoaded", function (event) {
  init();
});