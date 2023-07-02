<template>
  <div>这是一个猜拳游戏</div>
</template>
  
<script lang="ts">
import { defineComponent, inject } from "vue";
export default defineComponent({
  name: "FingerGame",
  mounted() {
    this.$axios.get("/barry").then((res) => {});
  },
});
</script>
<style lang="stylus"></style>
  