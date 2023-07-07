<template>
  <div class="game-room">
    <button @click="testGet()">点击测试</button>
    <ul>
      <li v-for="(message,i) in messages" :key="i">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import testApi from "@/api/testApi";
import { defineComponent, ref } from "vue";
import Pusher from "pusher-js";

const http = new testApi();
const messages = ref<Array<String>>([]);

// 监听信息
Pusher.logToConsole = true;

const pusher = new Pusher('691276eac4ced820a592', {
  cluster: 'ap1'
});

const channel = pusher.subscribe('my-channel');
channel.bind("my-event", (data: object) => {
  const currentDate = new Date();
  const currentTime = currentDate.toISOString();
  messages.value.push(JSON.stringify(data) + '' + currentTime)
});

// 发送信息
function testGet() {
  http
    .testGet()
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.log(err.message, "err");
    });
}


defineComponent({
  name: "FingerGameRoom",
});
</script>
