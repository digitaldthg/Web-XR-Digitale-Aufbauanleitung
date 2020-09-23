import * as THREE from 'three';

class CustomMaterial extends THREE.MeshStandardMaterial {
  constructor(){
    super();
    this.amount = .5;
    this.transparent = true;
    this.skinning = true;
  }
  customProgramCacheKey = function () {
    return this.amount;
  };
  onBeforeCompile = function ( shader ) {
    
 	shader.uniforms.time = { value: 0 };
 	shader.uniforms.dist = { value: 1 };
 	shader.uniforms.radius = { value: .75 };
 	shader.uniforms.customPositionVector = { value: new THREE.Vector3(0,0,0) };
  
   console.log(shader.vertexShader);

  shader.vertexShader = 'uniform float time;uniform vec3 customPositionVector;\nvarying float distFromCenter;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <fog_vertex>',
      [
       '#include <fog_vertex>',
        // `float theta = sin( time + position.y ) / ${ this.amount.toFixed( 1 ) };`,
        // 'float c = cos( theta );',
        // 'float s = sin( theta );',
        // 'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
        //'vec3 transformed = vec3( position );',
        'vNormal = vNormal;',
        'vec4 wPos = modelMatrix * skinned * vec4(transformed,1.0);',
        'vec3 worldPos = (modelMatrix * vec4( skinned.xyz, 1.0 ) ).xyz;',
        'vec3 wPosTransform = transformed.xyz + wPos.xyz;',
        
        
        'vec3 localCustomPositionVector = (projectionMatrix * modelMatrix *vec4(customPositionVector,1.0)).xyz;',
        
        'distFromCenter = distance(worldPos.xyz , localCustomPositionVector);'

        //'gl_Position = projectionMatrix * mvPosition;'
        //"gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;",
        //'customPositionVector = projectionMatrix * modelViewMatrix * vec4(position, 1.0);'
      ].join( '\n' )
    );

    shader.fragmentShader = 'uniform vec3 customPositionVector;uniform float radius;varying float distFromCenter;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
      [
      
        "float distsq = abs( distFromCenter );",
        "distsq = distsq > radius ? 0.2 : 1.;",

        // "vec4 custom_pos = vec4(customPositionVector,1.0);",
        // "float dist = distance(worldPosition,custom_pos);",
        // "dist = pow(dist, 6.) / 25.;",
        // "vec3 d = (worldPosition - customPositionVector);",
        // "float distsq = (worldPosition.x - customPositionVector.x) * (worldPosition.x - customPositionVector.x) + (worldPosition.y - customPositionVector.y) * (worldPosition.y - customPositionVector.y) + (worldPosition.z - customPositionVector.z) * (worldPosition.z - customPositionVector.z);",
        // "distsq = distance(worldPosition, customPositionVector);",
        //"distsq *= dist;",
        // "float _dist = abs(distsq);",
        // "_dist = _dist > dist ? 1. : 0.;",
        //"distsq = length(d) / .0001;",//diffuseColor.a
        "gl_FragColor = vec4( outgoingLight, distsq );",//diffuseColor.a * 
      ].join( '\n' )
    );
    
    this.userData.shader = shader;
  };

  update(){
    //const shader = this.userData.shader;

    if(typeof(this.userData.shader) == "undefined"){return;}
    //console.log(this.userData.shader.uniforms);
    this.userData.shader.uniforms.time.value = performance.now() / 1000;
    //this.userData.shader.uniforms.customPositionVector.value = new THREE.Vector3( 0, 0 ,0);
    //this.userData.shader.uniforms.dist.value = window.dist;
    //this.userData.shader.uniforms.radius.value = window.radius;
  }
  
}
export default CustomMaterial;