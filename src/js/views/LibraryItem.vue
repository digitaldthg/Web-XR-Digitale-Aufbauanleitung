<template>
  <div class="library-items">
    <div class="item" v-for="item in $store.state.library" :key="item.name">
      <input
        type="checkbox"
        :checked="item.scene.visible"
        :model="item.scene.visible"
        v-on:input="(e) => changeVisibility(e, item)"
      />
      <button v-on:click="callItem(item)">{{ item.name }}</button>
      <button
        :key="value.name"
        v-on:click="playClip(value)"
        v-for="value in item.actions"
      >
        {{ value.name }}
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.library-items {
  padding: 1rem;
}
</style>
<script>
export default {
  props: ["mainScene", "library"],
  methods: {
    changeVisibility(e, item) {
      item.scene.visible = e.target.checked;
    },
    playClip(clip) {
      clip.play();
    },
  },
};
</script>
