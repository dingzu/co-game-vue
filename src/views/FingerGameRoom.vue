<template>
  <div class="game-room">
    <div class="mask" v-if="isMask">
      <p>请稍候</p>
    </div>
    <p class="label">输入你的昵称</p>
    <input type="text" v-model="userName" />
    <!-- 桌子 -->
    <div v-for="(table, i) in tableList" :key="i" class="table">
      <p class="name">桌号 {{ i + 1 }}</p>
      <div class="player player1">
        <p>玩家1: {{ table.player1 == null ? "等待中" : table.player1 }}</p>
        <div
          class="button"
          v-if="table.player1 == null"
          @click="enterTable('player1', i)"
        >
          进入
        </div>
      </div>
      <div class="player player2">
        <p>玩家2: {{ table.player2 == null ? "等待中" : table.player2 }}</p>
        <div
          class="button"
          v-if="table.player2 == null"
          @click="enterTable('player2', i)"
        >
          进入
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fingerApi, TablelistType, EnterUserType } from "@/api/fingerApi";
import { defineComponent, onMounted, ref } from "vue";
import Pusher from "pusher-js";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const store = useStore();

const router = useRouter();

const http = new fingerApi();
let tableList = ref<TablelistType>([]);
let userName = ref<String>("我莫得名字");
let isMask = ref<Boolean>(false);

// 监听游戏桌情况
Pusher.logToConsole = true;

const pusher = new Pusher("691276eac4ced820a592", {
  cluster: "ap1",
});
const fingerChannel = pusher.subscribe("finger-channel");
// 循环监听
fingerChannel.bind("table-list", (message: TablelistType) => {
  console.log("获取到数据", message);
  tableList.value = message;
});

// 发送信息
function getTableList() {
  http
    .getTableList()
    .then((data: TablelistType) => {
      tableList.value = data;
      console.log("获取到游戏桌情况:", data);
    })
    .catch((err) => {
      console.log(err.message, "err");
    });
}

function enterTable(role: "player1" | "player2", index: number) {
  if (tableList.value[index][role] == null) {
    isMask.value = false;
    const param: EnterUserType = {
      tableIndex: index,
      userName: userName.value,
      role: role,
    };
    http
      .enterTable(param)
      .then((data) => {
        if (data.access == true) {
          alert("进入房间");
          console.log(index);
          store.commit("setFinger", { index: index, role: role });
          fingerChannel.unbind("table-list"); // 停止监听
          router.push({
            name: "table",
            params: {
              tableIndex: index,
            },
          });
        } else {
          alert("有人捷足先登了");
        }
        isMask.value = false;
      })
      .catch((err) => {
        console.log(err.message, "err");
      });
  }
}

defineComponent({
  name: "FingerGameRoom",
});

onMounted(() => {
  getTableList();
});
</script>

<style lang="stylus">
.game-room
  background #ccc
  .mask
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    background rgba(0, 0, 0, .8)
    p
      margin 80px auto
      color #fff
      text-align center
      font-size 20px
  input
    box-sizing border-box
    margin 0 0 12px 0
    padding 12px
    width 100%
  p
    margin 0
    font-size 14px
    &.label
      margin-bottom 12px
      font-size 14px
  padding 12px
  .table
    display flex
    flex-direction column
    box-sizing border-box
    margin-top 12px
    padding 12px
    width 100%
    background #fff
    gap 12px
  .player
    display flex
    flex-direction raw
    align-items center
    gap 12px
  .button
    padding 8px
    border 1px solid #ccc
    border-radius 4px
    font-size 14px
    &:hover
      border 1px solid #000
      cursor pointer
</style>
