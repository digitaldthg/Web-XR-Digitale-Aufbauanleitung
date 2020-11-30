<template>
  <div class="notification" v-if="shouldRender()">
    <div class="notification-single" v-if="this.$store.state.currentStepMessage.Notification_1 !== null">
      <p>{{this.$store.state.currentStepMessage.Notification_1}}</p>
    </div>
    <div class="notification-single" v-if="this.$store.state.currentStepMessage.Notification_2 !== null">
      <p>{{this.$store.state.currentStepMessage.Notification_2}}</p>
    </div>
    
    <div class="notification-single warning" v-if="this.$store.state.currentStepMessage.Warning !== null">
      <p>{{this.$store.state.currentStepMessage.Warning}}</p>
    </div>
  </div>
</template>

<script>
import store from '../../store';
export default {
  name : "Notification",
  store : store,
  methods : {
    shouldRender(){

      return Object.keys(this.$store.state.currentStepMessage).length != 0;
     
    }
  }
}
</script>

<style lang="sass">

.notification {
  position: absolute;
  top: 85px;
  right: 0;
  padding: 1rem;
}

.notification-single {
  padding: 1rem;
  background: #fff;
  box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  border-radius: 10px;
  width: 250px;
  font-size: 80%;

  &.warning{
    background:#df3636;
    color:#fff;
  }
}

</style>