<template>
  <div class="finger-game">
    <div class="battle-ground">
      <div
        v-for="(player, key) in fingerData"
        :key="key"
        class="player-ground"
        :class="role == key ? 'yours' : ''"
      >
        <div class="name">
          <p>{{ player.name }}</p>
        </div>
        <div class="choose" v-if="player.state != 'wait'">
          <div class="scissors button">布</div>
          <div class="stone button">石头</div>
          <div class="cloth button">布</div>
        </div>
        <div class="wait" v-else>等待玩家进入</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { fingerApi, FingerDataType } from "@/api/fingerApi";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Pusher from "pusher-js";

const route = useRoute();
const store = useStore();
const nowIndex = route.params.tableIndex;
let role = ref<"viewer" | "player1" | "player2">("viewer");
let fingerData = ref<FingerDataType>({
  player1: {
    name: "player1",
    choose: null,
    state: "wait",
    turn: 0,
    id: "",
  },
  player2: {
    name: "player2",
    choose: null,
    state: "wait",
    turn: 0,
    id: "",
  },
});

// 获取当前用户身份，默认是观众
if (store.state.finger.index == nowIndex && store.state.finger.role != null) {
  role = store.state.finger.role;
}

// 监听比赛信息
Pusher.logToConsole = true;

const pusher = new Pusher("691276eac4ced820a592", {
  cluster: "ap1",
});
const fingerChannel = pusher.subscribe("finger-channel");
const messageName = "table-detail-" + nowIndex;
// 循环监听
fingerChannel.bind(
  messageName,
  (message: { score: Array<number>; players: FingerDataType }) => {
    console.log("获取到数据", message);
    fingerData.value = message.players;
  }
);

const http = new fingerApi();

function getDetal() {
  http
    .getDetail({ index: Number(nowIndex) })
    .then((data) => {
      fingerData.value = data.players;
    })
    .catch((err) => {
      console.log(err.message, "err");
    });
}

onMounted(() => {
  getDetal();
});
</script>

<style lang="stylus">
.battle-ground
  display flex
  gap 12px
  p
    margin 0
  .player-ground
    display flex
    flex 1
    flex-direction column
    padding 12px
    border 1px solid #ccc
    gap 12px
    .choose
      display flex
      flex-direction column
      gap 12px
    .button
      padding 12px
      border 1px solid #ccc
  .player-ground.yours > .choose > .button:hover
    border 1px solid #000
    cursor pointer
</style>
  