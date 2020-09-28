import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import RobotoMSDFJSON from '../../FontMaps/Roboto-msdf.json';
import RobotoMSDFPNG from '../../FontMaps/Roboto-msdf.png';
class TextUI{
  constructor(webXRscene){
    this.webXRscene = webXRscene;

    this.Init = this.Init.bind(this);
    this.SetText = this.SetText.bind(this);
    this.SetHeadline = this.SetHeadline.bind(this);
    this.SetPosition = this.SetPosition.bind(this);

    this.Init();
  }
  Init(){

    this.container = new ThreeMeshUI.Block({
      height: .4,
      width: .4
    });
  
    this.container.position.set( .5, 0, 0 );
    this.webXRscene.Scene.add( this.container );

    this.container.set({
      fontFamily: RobotoMSDFJSON,
      fontTexture: RobotoMSDFPNG,
       alignContent : "center",
      justifyContent : "center"
    });

    this.currentHeadline = new ThreeMeshUI.Text({
      content: 'Vorhangschienen ',
      fontColor: new THREE.Color( 0x8bc34a ),
      fontSize: 0.03,
      padding : 1,
    });
    
    this.currentText = new ThreeMeshUI.Text({
      content: 'VR Tutorial',
      fontColor: new THREE.Color( 0xffffff ),
      fontSize: 0.03,
      alignContent : "center",
      justifyContent : "center"
    });
    // text.set({
    // });


    this.container.add( this.currentHeadline );
    this.container.add( this.currentText );


  }

  SetPosition(x,y,z){
    this.container.position.set(x,y + .4,z);
  }
  
  SetText(text){
    this.currentText.set({
      content : text
    });
  }

  SetHeadline(text){
    this.currentHeadline.set({
      content : text
    });
  }

  Update(){

    this.container.lookAt(this.webXRscene.Camera.instance.position);

  }

}

export default TextUI;