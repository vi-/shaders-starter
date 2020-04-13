import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";

let camera, scene, renderer, uniforms, controls, plane;

let MyTexture = new THREE.TextureLoader().load(
  "../images/kitties.jpg",
  (texture) => {
    setup();
    animate();
  }
);

const setup = () => {
  let container = document.getElementById("three_container");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    20,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);

  var material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: "f", value: 0 },
      u_resolution: {
        type: "v2",
        value: new THREE.Vector2(
          renderer.domElement.width,
          renderer.domElement.height
        ),
      },
      u_size: {
        type: "v2",
        value: new THREE.Vector2(MyTexture.image.width, MyTexture.image.height),
      },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    // wireframe: true,
  });
  plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 16, 16), material);
  scene.add(plane);
  controls.update();

  camera.position.z = 5;
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
