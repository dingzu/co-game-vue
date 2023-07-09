<template>
  <router-view />
</template>

<script lang="ts" setup>
import Pusher from "pusher-js";
import { useStore } from "vuex";
const store = useStore();
const pusher = new Pusher("691276eac4ced820a592", {
  cluster: "ap1",
  authEndpoint: process.env.VUE_APP_API_URL + "api/pusher/auth",
});

// Pusher.logToConsole = true;

pusher.connection.bind("connected", function () {
  const pusherId = pusher.connection.socket_id;
  console.log("生成ID首页", pusherId);
  store.commit("setPusherId", pusherId);
});

const fingerChannel = pusher.subscribe("presence-finger-channel");
fingerChannel.bind("pusher:member_removed", (member: any) => {
  // For example
  console.log("用户下线", member);
});
</script>