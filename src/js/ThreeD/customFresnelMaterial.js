import * as THREE from 'three';

class CustomFresnelMaterial extends THREE.MeshBasicMaterial {
  constructor(opt = {}){
    super();
    this.transparent = true;
    this.depthTest = false;
    this.depthWrite = false;

    Object.assign(this,opt);
  }
  customProgramCacheKey = function () {
    return this.amount;
  };
  onBeforeCompile = function ( shader ) {
    
 	shader.uniforms.time = { value: 0 };
 	
    shader.vertexShader = `varying vec3 vPositionW;
		varying vec3 vNormalW;\n` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      [
        '#include <worldpos_vertex>',
        'vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);',
	    	'vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );',
      ].join( '\n' )
    );

    shader.fragmentShader = `
    varying vec3 vPositionW;
		varying vec3 vNormalW;\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
      [
      
        "	vec3 viewDirectionW = normalize(cameraPosition - vPositionW);",
        "	float fresnelTerm = dot(viewDirectionW, vNormalW);",
        "	fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);",

        "gl_FragColor = vec4(diffuseColor.rgb * fresnelTerm, fresnelTerm *diffuseColor.a );", 
      ].join( '\n' )
    );
    
    this.userData.shader = shader;
  };

  update(){

    if(typeof(this.userData.shader) == "undefined"){return;}
  }
  
}
export default CustomFresnelMaterial;