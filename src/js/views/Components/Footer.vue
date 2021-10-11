<template>
  <footer>
    <div class="footer-inner">
      <div class="footer-content">
        <button class="nav-buttons" v-on:click="ChangeAnimationStep(-1)">
          <Prev />
        </button>
      </div>

      <div class="footer-content flex-height footer-main">
        <div class="footer-content-inner flex-width">
          <div class="footer-content-message">
            <h3>{{ title }}</h3>
            <p>{{ " " + text }}</p>
          </div>
          <div class="footer-content-icons" v-if="toolsNeeded.length > 0">
            <div class="icon" v-for="tool in toolsNeeded" v-bind:key="tool">
              <Hammer v-if="tool == 'Hammer'" />
              <Zange v-if="tool == 'Zange'" />
              <Schraubenschluessel
                v-if="tool == 'Schraubenschlüssel/Ratsche SW 13 mm'"
              />
              <Imbus v-if="tool == 'ISK 8 mm'" />
              <span class="tool-name">{{ tool }}</span>
            </div>
          </div>
        </div>
        <div
          class="footer-content-nav "
          v-if="this.$store.state.library.VorhangSchiene"
        >
          <button
            :class="
              'footer-content-nav-items nav-item-' +
                index +
                ' active-' +
                (index <= currentStep)
            "
            v-for="(step, index) in this.stepsInOrder()"
            v-bind:key="step.js_name"
            v-on:click="playClip(step.js_name)"
          >
            <span class="_hidden">{{ step.js_name }}</span>
          </button>
        </div>
      </div>
      <div class="footer-content">
        <button class="nav-buttons" v-on:click="ChangeAnimationStep(1)">
          <Next />
        </button>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  pointer-events: all;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content-message {
  margin-right: 1rem;
  flex: 1;

  p,
  h3 {
    font-size: 14px;
    display: inline;
  }
}

.footer-content-message,
.footer-content-icons {
  padding: 1rem;
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.tool-name {
  font-size: 80%;
  text-align: center;
  display: inline-block;
  width: 100%;
  color: #666;
  max-width: 160px;
}

.footer-content-icons {
  display: flex;
}
.footer-inner {
  padding: 1rem;
  background: #fff;
  border-radius: 100px;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  justify-content: space-between;
  display: flex;
  width: 80%;
  margin-bottom: 1rem;
}
.footer-main {
  flex: 2;
  margin: 0 1rem;
}
.footer-content-nav {
  width: 100%;
  height: 15px;
  display: flex;
}
.footer-content-nav {
  padding: 0.2rem;
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
}
.footer-content-nav-items {
  height: 100%;
  flex: 1;
  border: 1px solid #ccc;
  margin-right: 5px;
  border-radius: 3px;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    background: #eee;
  }

  &.active-true {
    border: 1px solid #484848;
    background: #484848;
  }
}

.flex-height {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.flex-width {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.nav-buttons {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 25px;
    height: 25px;
  }
}
</style>
<script>
import Prev from "../../Icons/prev.svg";
import Next from "../../Icons/next.svg";
import Hammer from "../../Icons/icon__Hammer.svg";
import Zange from "../../Icons/icon__Zange.svg";
import Schraubenschluessel from "../../Icons/icon__Schraubenschluessel.svg";
import Imbus from "../../Icons/icon__Imbus.svg";
import StaticContent from "../../../Content/StaticContent";
import AnimationMixins from '../../mixins/AnimationMixin';

export default {
  name: "Footer",
  mixins:[AnimationMixins],
  components: {
    Prev,
    Next,
    Hammer,
    Zange,
    Schraubenschluessel,
    Imbus,
  },
  data() {
    return {
      headline: "",
      title: "Hallo und willkommen",
      text: "im Vorhangschienen XR Tutorial",
      toolsNeeded: [],
      currentStep: -1,
      stepsInOrder: () => {
        var steps = [];
        Object.keys(StaticContent).map((step) => {
          steps[StaticContent[step].Schritt - 1] = StaticContent[step];
        });
        return steps;
      },
      steps: [
        "Schienenteile",
        "Zugwagen",
        "Zweilaufradwagen",
        "Umlenkrolle",
        "Abstandshalter",
        "Feststeller",
        "Rohrhaken",
      ],
    };
  },
};
</script>
