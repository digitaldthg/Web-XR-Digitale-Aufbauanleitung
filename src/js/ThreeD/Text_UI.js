import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import RobotoMSDFJSON from '../../FontMaps/Roboto-msdf.json';
import RobotoMSDFPNG from '../../FontMaps/Roboto-msdf.png';
class TextUI{
  constructor(context){
    this.context = context;

    console.log(this.context);
    this.Init = this.Init.bind(this);
    this.SetText = this.SetText.bind(this);
    this.SetHeadline = this.SetHeadline.bind(this);
    this.SetPosition = this.SetPosition.bind(this);

    this.context.webXRScene.Events.addEventListener("mouse-down",()=>{
      this.context.ChangeAnimationStep(1);
    });
    this.context.webXRScene.Events.addEventListener("OnChangeXRView",(mode)=>{
      this.container.visible = mode.xrMode != "Desktop";

      if(mode.xrMode == "AR"){
        if(mode.session.domOverlayState.type !== "screen"){

          this.container.visible = false;

        }else{
          this.container.visible = true;
        }
      }

      console.log(mode);
    });

    this.Init();
  }
  Init(){

    this.container = new ThreeMeshUI.Block({
      height: .4,
      width: .4,
      backgroundOpacity :0
    });
  
    this.container.position.set( .5, 1, 0 );

    console.log(this.context.webXRScene.Scene);

    this.context.webXRScene.Scene.add( this.container );

    console.log(this.container);
    this.container.visible = false;

    /**Text Container */
    this.textContainer = new ThreeMeshUI.Block({
      height: .3,
      width: .4
    });
    this.textContainer.set({
      fontFamily: RobotoMSDFJSON,
      fontTexture: RobotoMSDFPNG,
      alignContent : "center",
      justifyContent : "center"
    });

    this.container.add(this.textContainer);

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


    this.textContainer.add( this.currentHeadline );
    this.textContainer.add( this.currentText );


    /** */
    this.nav_container = new ThreeMeshUI.Block({
      height: .1,
      width: .4,
      backgroundOpacity : 0

    });
  
    //this.container.position.set( .5, 0, 0 );
    this.container.add( this.nav_container );

    this.nav_container.set({
      fontFamily: RobotoMSDFJSON,
      fontTexture: RobotoMSDFPNG,
      alignContent : "center",
      justifyContent : "center",
  		contentDirection: 'row-reverse',
    });

    const buttonOptions = {
      default : {
        state : "idle",
        attributes: {
          width: 0.1,
          height: 0.05,
          justifyContent: 'center',
          alignContent: 'center',
          offset: 0.05,
          margin: 0.02,
          //borderRadius: 0.075,
          fontSize : .02,
          backgroundColor: new THREE.Color( 0x777777 )
        }
      },
      selected: {
        state: "selected",
        attributes :{
          offset: 0.06,
          backgroundColor: new THREE.Color( 0x777777 ),
          fontColor: new THREE.Color( 0x222222 )
        }
      },
      hovered :{
        state: "hovered",
        attributes: {
          offset: 0.055,
          backgroundColor: new THREE.Color( 0xff0000 ),
          backgroundOpacity: 1,
          fontColor: new THREE.Color( 0xffffff )
        }
      },
    };


    /**VR Buttons */
    this.buttonNext = new ThreeMeshUI.Block( buttonOptions.default.attributes );
    this.buttonPrevious = new ThreeMeshUI.Block( buttonOptions.default.attributes );

    this.buttonNext.isUI = true;
    this.buttonPrevious.isUI = true;
    // Add text to buttons

    this.buttonNext.add(
      new ThreeMeshUI.Text({ content: "next" })
    );
    this.buttonNext.setupState(buttonOptions.default);
    this.buttonNext.setupState(buttonOptions.hovered);
    this.buttonNext.setupState(Object.assign(buttonOptions.selected,{

        onSet: ()=> { this.context.ChangeAnimationStep(1);}
    }));
    

    this.buttonPrevious.add(
      new ThreeMeshUI.Text({ content: "previous" })
    );
    this.buttonPrevious.setupState(buttonOptions.default);
    this.buttonPrevious.setupState(buttonOptions.hovered);
    this.buttonPrevious.setupState(Object.assign(buttonOptions.selected,{
        onSet: ()=> { this.context.ChangeAnimationStep(-1);}
    }));
    
    // this.nav_container.add( this.buttonNext, this.buttonPrevious );
// 
    // this.context.webXRScene.Controls.ActiveObjects.push(this.buttonNext);
    // this.context.webXRScene.Controls.ActiveObjects.push(this.buttonPrevious);
   
  }

  SetPosition(x,y,z){
    let offset = 1;//this.context.webXRScene.Controls.GetCurrentXRMode() != "Desktop" ? 1 : 1;
    this.container.position.set(x,( y + .4 + 1),z);
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

    this.container.lookAt(this.context.webXRScene.Controls.GetCameraPosition());

  }

}

export default TextUI;