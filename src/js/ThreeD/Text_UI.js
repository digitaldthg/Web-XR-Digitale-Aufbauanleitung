import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import RobotoMSDFJSON from '../../FontMaps/Roboto-msdf.json';
import RobotoMSDFPNG from '../../FontMaps/Roboto-msdf.png';

/**
 * VR und AR Menu
 * Zeigt den jeweiligen Arbeitsschritt auf einem Panel im 3D Raum an
 */
class TextUI {
  constructor(context) {
    this.context = context;

    /**
     * Welchselt zum nächsten Arbeitsschritt und wird bei Klick auf einen XR-Controller ausgeführt
     */
    this.context.webXRScene.Events.addEventListener("mouse-down", () => {
      this.context.ChangeAnimationStep(1);
    });

    /**
     * Zeigt(AR/VR) und Versteckt(Desktop) das Menu
     */
    this.context.webXRScene.Events.addEventListener("OnChangeXRView", (mode) => {
      this.container.visible = mode.xrMode != "Desktop";

      if (mode.xrMode == "AR") {
        if (mode.session.domOverlayState.type !== "screen") {

          this.container.visible = false;

        } else {
          this.container.visible = true;
        }
      }

    });

    this.Init();
  }

  /**
   * Initiiert das Anweisungspanel und fügt es in die Scene hinzu
   */
  Init = () => {

    this.container = new ThreeMeshUI.Block({height: .4, width: .4, backgroundOpacity: 0});

    this.container.position.set(.5, 1, 0);

    this.context.webXRScene.Scene.add(this.container);

    this.container.visible = false;

    /**Text Container */
    this.textContainer = new ThreeMeshUI.Block({height: .3, width: .4});
    this.textContainer.set({fontFamily: RobotoMSDFJSON, fontTexture: RobotoMSDFPNG, alignContent: "center", justifyContent: "center"});

    this.container.add(this.textContainer);

    this.currentHeadline = new ThreeMeshUI.Text({content: 'Vorhangschienen ', fontColor: new THREE.Color(0x8bc34a), fontSize: 0.03, padding: 1});

    this.currentText = new ThreeMeshUI.Text({
      content: 'VR Tutorial',
      fontColor: new THREE.Color(0xffffff),
      fontSize: 0.03,
      alignContent: "center",
      justifyContent: "center"
    });

    this.textContainer.add(this.currentHeadline);
    this.textContainer.add(this.currentText);

  }

  /**
   * Setzt die Position des AnweisungsPanels
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  SetPosition = (x, y, z) => {
    this.container.position.set(x, (y + .4 + 1), z);
  }

  /**
   * Setzt den Fließtext 
   * @param {string} text 
   */
  SetText = (text) => {
    this.currentText.set({content: text});
  }
  /**
   * Setzt die Überschrift 
   * @param {string} text 
   */
  SetHeadline = (text) => {
    this.currentHeadline.set({content: text});
  }

  /**
   * Rotiert das Panel zum Betrachter (wird bei jedem Tick ausgeführt)
   */
  Update = () => {
    this.container.lookAt(this.context.webXRScene.Controls.GetCameraPosition());
  }

}

export default TextUI;
