<template>
  <div class="home">
    <FingerGame msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FingerGame from "@/components/FingerGame.vue"; // @ is an alias to /src

export default defineComponent({
  name: "HomeView",
  components: {
    FingerGame,
  },
});
</script>
