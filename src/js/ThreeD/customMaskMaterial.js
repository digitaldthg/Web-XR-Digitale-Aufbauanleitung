import * as THREE from 'three';

class CustomMaskMaterial extends THREE.MeshStandardMaterial {
  skinning = true;
  constructor() {
    super();
    this.amount = .2;
    this.transparent = true;
    this.skinning = true;
    this.metalness = 1;
    this.roughness = .5;
    this.side = THREE.DoubleSide
  }
  customProgramCacheKey = function () {
    return this.amount;
  };
  onBeforeCompile = function (shader) {

    shader.uniforms.time = {
      value: 0
    };
    shader.uniforms.dist = {
      value: 1
    };
    shader.uniforms.radius = {
      value: 0
    };
    shader.uniforms.maskOpacity = {
      value: 1
    };
    shader.uniforms.customPositionVector = {
      value: new THREE.Vector3(0, 0, 0)
    };

    shader.vertexShader = `varying vec4 vWorldPosition;
    varying vec4 vCustomPosition;
    uniform vec3 customPositionVector;
    varying vec3 vNormalW;\n` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>', ['#include <worldpos_vertex>', 'vWorldPosition = modelMatrix * vec4( transformed, 1.0 );', 'vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );', 'vCustomPosition = modelMatrix * vec4( customPositionVector, 1.0 );',].join('\n'));

    shader.fragmentShader = `varying vec4 vWorldPosition;
    varying vec4 vCustomPosition; 
    uniform float radius;
    uniform float maskOpacity;
    varying vec3 vNormalW;\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );", [

      "float distsq = abs( distance(vWorldPosition, vCustomPosition) );",
      "distsq = distsq > radius ? maskOpacity : 1.;",

      "	vec3 viewDirectionW = normalize(cameraPosition - vWorldPosition.xyz);",
      "	float fresnelTerm = dot(viewDirectionW, vNormalW);",
      "	fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);",

      "gl_FragColor = vec4( outgoingLight * fresnelTerm, distsq );",
    ].join('\n'));

    this.userData.shader = shader;
  };

  SetRadius(rad) {
    this.userData.shader.uniforms.radius.value = rad;
  }
  SetPosition(pos) {
    this.userData.shader.uniforms.customPositionVector.value.x = pos.x;
    this.userData.shader.uniforms.customPositionVector.value.y = pos.y;
    this.userData.shader.uniforms.customPositionVector.value.z = pos.z;
  }

  update() {

    if (typeof(this.userData.shader) == "undefined") {
      return;
    }

    this.userData.shader.uniforms.time.value = performance.now() / 1000;
  }

}
export default CustomMaskMaterial;
