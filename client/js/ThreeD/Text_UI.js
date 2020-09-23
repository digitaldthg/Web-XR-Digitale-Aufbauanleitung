import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import RobotoMSDFJSON from '../../FontMaps/Roboto-msdf.json';
import RobotoMSDFPNG from '../../FontMaps/Roboto-msdf.png';
class TextUI{
  constructor(webXRscene){
    this.webXRscene = webXRscene;

    this.Init();
  }
  Init(){

    this.container = new ThreeMeshUI.Block({
      height: 1,
      width: 1
    });
  
    this.container.position.set( 0, 1, 0 );
    this.webXRscene.Renderer.scene.add( this.container );

    this.container.set({
      fontFamily: RobotoMSDFJSON,
      fontTexture: RobotoMSDFPNG,
    });

    const text = new ThreeMeshUI.Text({
      content: 'The spiny bush viper is known for its extremely keeled dorsal scales.',
      fontColor: new THREE.Color( 0xd2ffbd ),
      fontSize: 0.08
    });
    // text.set({
    // });


    this.container.add( text );


  }


  Update(){

    this.container.lookAt(this.webXRscene.Renderer.camera.instance.position);

  }

}

export default TextUI;