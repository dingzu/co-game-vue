<template>
  <router-view />
</template>

<script lang="ts" setup>
import Pusher from "pusher-js";
const pusher = new Pusher("691276eac4ced820a592", {
  cluster: "ap1",
  authEndpoint: process.env.VUE_APP_API_URL + "api/pusher/auth",
});
const fingerChannel = pusher.subscribe("presence-finger-channel");
fingerChannel.bind("pusher:member_removed", (member: any) => {
  // For example
  console.log("用户下线", member);
});
</script>