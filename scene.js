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

  const luz1 = new THREE.HemisphereLight(0xffffff, 0xff0000, 10);
  scene.add(luz1);

  let maquina = new THREE.Object3D();
  const loader = new THREE.GLTFLoader();

  loader.load(

    "locomotive/maquina2.gltf",

    function (maquinaScene) {
      maquina = maquinaScene.scene.children[0];
      maquinaScene.scene.children[0].scale.set(1, 1, 1);
      scene.add(maquinaScene.scene);
    }
  );

  loader.load(
    
    "rail/trilho.gltf", 
    
    function (trilhoScene) {
      trilho = trilhoScene.scene.children[0];
      trilhoScene.scene.children[0].scale.set(1, 1, 1);
      scene.add(trilhoScene.scene);
    }
  );

  loader.load(
    
    "wagon/vagao.gltf", 
    
    function (vagaoScene) {
      vagao = vagaoScene.scene.children[0];
      vagaoScene.scene.children[0].scale.set(1, 1, 1);
      scene.add(vagaoScene.scene);
    }
  );

  camera.position.z = 3; // Afastado da cena para melhor visualização

  let t = 0;

  function animate() {
    requestAnimationFrame(animate);

    maquina.rotation.y = -(t - Math.PI/2);
    //trem.rotation.z- = 0.01;
    //trem.rotation.z = 0.01;
    
    if (maquina) {
      const radius = 0.95; // Raio do círculo
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