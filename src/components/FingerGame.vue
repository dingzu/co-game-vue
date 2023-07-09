<template>
  <div class="finger-game">
    <div class="battle-ground">
      <div v-for="(player, key) in fingerData" :key="key" class="player-ground">
        <div class="name">
          <p>{{ player.name }}</p>
        </div>
        <div class="choose">
          <!--遮挡-->
          <div class="mask" v-if="player.state == 'wait'">没有玩家</div>
          <div class="mask" v-else-if="fingerData.player1.state == 'wait'">
            等待 player1
          </div>
          <div class="mask" v-else-if="fingerData.player2.state == 'wait'">
            等待 player2
          </div>
          <!--我方界面-->
          <div class="yours" v-if="role == key">
            <div class="button-group">
              <div
                class="scissors button click-able"
                :class="player.choose == 'scissors'"
                @click="sendChoose('scissors', key)"
              >
                剪刀
              </div>
              <div
                class="stone button click-able"
                :class="player.choose == 'stone'"
                @click="sendChoose('stone', key)"
              >
                石头
              </div>
              <div
                class="cloth button click-able"
                :class="player.choose == 'cloth'"
                @click="sendChoose('cloth', key)"
              >
                布
              </div>
            </div>
          </div>
          <!--对方界面-->
          <div class="anti" v-else>
            <div
              class="mask"
              style="z-index: 99"
              v-if="
                fingerData.player1.turn == fingerData.player2.turn &&
                (fingerData.player1.state == 'ready' ||
                  fingerData.player2.state == 'ready')
              "
            >
              等待对方选择
            </div>
            <div class="button-group">
              <div class="scissors button">剪刀</div>
              <div class="stone button">石头</div>
              <div class="cloth button">布</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-set">
      <div class="content">
        <p>{{ fingerData.player1.name }} 胜利: {{ score[0] }}</p>
        <p>{{ fingerData.player2.name }} 胜利: {{ score[1] }}</p>
        <p>平局: {{ score[2] }}</p>
      </div>
      <router-link to="/finger/room">
        <div class="button">退出</div>
      </router-link>
    </div>
  </div>
</template>

<script lang='ts' setup>
import {
  fingerApi,
  FingerDataType,
  FingerType,
  UserStateType,
} from "@/api/fingerApi";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Pusher from "pusher-js";

const route = useRoute();
const router = useRouter();
const store = useStore();
const nowIndex = route.params.tableIndex;
let role = ref<"viewer" | "player1" | "player2">("viewer");
let score = ref<Array<number>>([0, 0, 0]);
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
const pusher = new Pusher("691276eac4ced820a592", {
  cluster: "ap1",
  authEndpoint: process.env.VUE_APP_API_URL + "api/pusher/auth",
});
const fingerChannel = pusher.subscribe("presence-finger-channel");
const messageName = "table-detail-" + nowIndex;
// 监听
fingerChannel.bind(
  messageName,
  (message: { score: Array<number>; players: FingerDataType }) => {
    console.log("获取到数据", message, store.state.finger.role);
    fingerData.value = message.players;
    score.value = message.score;
    if (
      store.state.finger.role == "player1" &&
      store.state.pusherId != message.players.player1.id
    ) {
      router.push({
        name: "room",
      });
      store.commit("setFinger", { index: -1, role: "viewer" });
      alert("你断开了游戏");
    }
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

function leaveTable() {
  http
    .leaveTable({ id: store.state.pusherId })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err.message, "err");
    });
}

function sendChoose(choose: FingerType, role: "player1" | "player2") {
  // 如果轮次不一样，则退出
  if (fingerData.value.player1.turn != fingerData.value.player2.turn) {
    return;
  }
  // 如果不在 ready 状态，则退出
  if (fingerData.value[role].state != "ready") {
    return;
  }
  // 如果轮次一样，发送数据
  const params = {
    turn: fingerData.value[role].turn,
    tableIndex: Number(nowIndex),
    role: role,
    choose: choose,
  };
  fingerData.value[role].state = "choosed";
  http
    .sendChoose(params)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err.message, "err");
    });
}

function sendHeartbeat() {
  console.log("心跳检查");
  if (store.state.pusherId) {
    http.sendHeartbeat({ userId: store.state.pusherId }).catch((err) => {
      console.log(err.message, "err");
    });
  } else {
    console.log("pusherId is not defined");
  }
}

let heartbeatIntervalId: number | undefined;

onMounted(() => {
  try {
    getDetal();
  } catch (err) {
    console.log("Error in getDetal:", err);
  }
  heartbeatIntervalId = setInterval(sendHeartbeat, 1 * 1000);
});

onBeforeUnmount(() => {
  leaveTable();
  clearInterval(heartbeatIntervalId);
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
    .choose, .button-group
      position relative
      display flex
      flex-direction column
      gap 12px
    .mask
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      z-index 100
      padding 20px
      border 1px solid #ccc
      background-color #f5f5f5
      text-align center
    .button.click-able:hover
      border 1px solid #000
    .button
      padding 12px
      border 1px solid #ccc
      &.active, &.active:hover
        background #ccc
        color #fff

.user-set
  margin-top 12px
  a
    color #000
    text-decoration none
  .button
    padding 12px
    border 1px solid #ccc
    text-align center
    &:hover
      border 1px solid #000
      cursor pointer
  .content
    margin-bottom 12PX
    padding 12px
    border 1px solid #ccc
</style>
  