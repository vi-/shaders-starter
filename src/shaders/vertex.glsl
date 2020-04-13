varying vec3 vUv;
uniform vec2 u_size;
uniform float time;
uniform vec2 u_resolution;


void main() {
  vUv = position;
  vUv.z = vUv.z + time; 
  vec4 modelViewPosition = modelViewMatrix * vec4(vUv.xyz, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}