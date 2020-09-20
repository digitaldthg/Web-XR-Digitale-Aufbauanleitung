module.exports = `<div class="library-item">
    <div v-for="item of this.$props.mainScene">
      {{item.name}}
    </div>
  </div>`