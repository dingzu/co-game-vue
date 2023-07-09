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
          <div
            class="mask"
            v-else-if="
              (fingerData.player1.state == 'choosed' &&
                fingerData.player2.state == 'choosed') ||
              (fingerData.player1.state == 'choosed' &&
                fingerData.player2.state == 'ready' &&
                fingerData.player2.turn > fingerData.player1.turn) ||
              (fingerData.player2.state == 'choosed' &&
                fingerData.player1.state == 'ready' &&
                fingerData.player1.turn > fingerData.player2.turn)
            "
          >
            <p>玩家选择了{{ transCn(player.choose || "") }}</p>
            <p>{{ winOrLose(key).text }}</p>
            <div
              class="button click-able"
              v-if="role == key && player.state == 'choosed'"
              @click="nextTurn(key)"
            >
              进入下一轮
            </div>
            <div
              class="key-text button"
              v-if="role == key && player.state == 'ready'"
            >
              等待对方
            </div>
          </div>
          <div v-else-if="player.state == 'choosed'" class="mask">
            <p v-if="key == role">
              玩家选择了{{ transCn(player.choose || "") }}
            </p>
            <p v-else>对方已完成选择</p>
          </div>
          <!--我方界面-->
          <div class="yours" v-if="role == key">
            <div class="button-group">
              <div
                class="scissors button click-able"
                :class="player.choose == 'scissors' ? 'active' : ''"
                @click="sendChoose('scissors', key)"
              >
                剪刀
              </div>
              <div
                class="stone button click-able"
                :class="player.choose == 'stone' ? 'active' : ''"
                @click="sendChoose('stone', key)"
              >
                石头
              </div>
              <div
                class="cloth button click-able"
                :class="player.choose == 'cloth' ? 'active' : ''"
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
        <p>
          胜场:
          {{ score[0] }}
        </p>
        <p>败场: {{ score[1] }}</p>
        <p>平局: {{ score[2] }}</p>
      </div>
      <router-link to="/finger/room">
        <div class="button">退出</div>
      </router-link>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { fingerApi, FingerDataType, FingerType } from "@/api/fingerApi";
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
    // score.value = message.score;
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

function nextTurn(role: "player1" | "player2") {
  // 不可连续加轮
  let otherRole: "player2" | "player1" =
    role == "player1" ? "player2" : "player1";
  if (fingerData.value[role].turn > fingerData.value[otherRole].turn) {
    return;
  }
  // 积分
  console.log("积分测试", winOrLose(role).key);
  if (winOrLose(role).key == "win") {
    score.value[0] += 1;
  } else if (winOrLose(role).key == "lose") {
    score.value[1] += 1;
  } else {
    score.value[2] += 1;
  }
  const params = {
    turn: fingerData.value[role].turn + 1,
    tableIndex: Number(nowIndex),
    role: role,
  };
  http
    .sendTurn(params)
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

function winOrLose(role: "player1" | "player2") {
  let otherRole: "player2" | "player1" =
    role == "player1" ? "player2" : "player1";
  let data = {
    key: "win",
    text: "胜利！",
  };
  if (fingerData.value.player1.choose == fingerData.value.player2.choose) {
    data.key = "eq";
    data.text = "平局";
  }
  if (
    (fingerData.value[role].choose == "cloth" &&
      fingerData.value[otherRole].choose == "scissors") ||
    (fingerData.value[role].choose == "scissors" &&
      fingerData.value[otherRole].choose == "stone") ||
    (fingerData.value[role].choose == "stone" &&
      fingerData.value[otherRole].choose == "cloth")
  ) {
    data.key = "lose";
    data.text = "技不如人";
  }
  return data;
}

function transCn(en: string) {
  if (en == "scissors") {
    return "剪刀";
  }
  if (en == "cloth") {
    return "布";
  }
  if (en == "stone") {
    return "石头";
  }
  return "";
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
      top -2px
      right -2px
      bottom -2px
      left -2px
      z-index 100
      display flex
      flex-direction column
      padding 20px
      border 1px solid #ccc
      background-color #f5f5f5
      text-align center
      gap 12px
    .button.click-able:hover
      border 1px solid #000
    .button
      padding 12px
      border 1px solid #ccc

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
  