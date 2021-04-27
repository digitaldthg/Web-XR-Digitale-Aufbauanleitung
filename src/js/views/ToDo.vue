<template>
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
    
    <li v-for="todo in this.$props.mainScene.library">
      {{ todo }}
    </li>
  </ol>

 
</div>

</template>
<script>
import Vue from 'vue';

export default {
  name : "ToDo",
  props:[
    "mainScene"
  ],
  data(){
    return {
      todos: [
        { text: 'Learn JavaScript' },
        { text: 'Learn Vue' },
        { text: 'Build something awesome' }
      ]
    }
  },

};
</script>