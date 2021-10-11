const AnimationMixin = {
  methods : {
    /**
     * Spielt den Anweisungsschritt ab und zeigt den dazugehörigen Content an
     */
    playClip(clipName) {

      var mainScene = this.$store.state.mainScene;
      mainScene.PlayActionByName(clipName);
      this.currentStep = mainScene.currentStep;
      
      this.headline = clipName;
      this.title = this.$store.state.StaticContent[clipName].Title;
      this.text = this.$store.state.StaticContent[clipName].Description;

      this.toolsNeeded = this.filterTools(
        this.$store.state.StaticContent[clipName]
      );
    },
    /**
     * 
     * @param {number} dir Anwendungsschritt (+1 vor, -1 zurück)
     */
    ChangeAnimationStep(dir) {
      var message = this.$store.state.mainScene.ChangeAnimationStep(dir);
      
      this.currentStep = this.$store.state.mainScene.currentStep;
      this.headline = message.clipName;
      this.text = message.Description;
      this.title = message.Title;

      this.toolsNeeded = this.filterTools(message);

      this.$store.commit("SetCurrentStep", message);
    },
    filterTools(stepInfo) {
      var toolKeyName = ["Tool_1", "Tool_2", "Tool_3", "Tool_4", "Tool_5"];
      var tools = [];
      toolKeyName.forEach((key) => {
        if (stepInfo[key]) {
          tools.push(stepInfo[key]);
        }
      });

      return tools;
    },
  }
}

export default AnimationMixin;