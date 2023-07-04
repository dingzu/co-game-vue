<template>
  <div>这是一个猜拳游戏</div>
  <div>你是：{{ player }}</div>
  <div>你的对手是：{{ otherPlayer }}</div>
  <div>你想要出什么?</div>
  <div>
    <div @click="sendChoose('scissors')" :class="['button', isChoose('scissors')]">剪刀</div>
    <div @click="sendChoose('stone')" :class="['button', isChoose('stone')]">石头</div>
    <div @click="sendChoose('cloth')" :class="['button', isChoose('cloth')]">布</div>
  </div>
  <div class="mask" v-if="isShowMask(recentPlayer)">
    <div>你选择了: {{ bothPlayer[recentPlayer] }}</div>
    <div v-if="bothPlayer[otherPlayer] == 'wait' || bothPlayer[otherPlayer] == 'ready'">
      <div>等待对手选择</div>
    </div>
    <div v-else>
      <div>你的对手选择了: {{ bothPlayer[otherPlayer] }}</div>
      <div class="button" @click="sendChoose('ready')">下一局</div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { fingerApi, Choose, ChooseBoth, fingertype } from "@/api/fingerApi";
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'
const http = new fingerApi();
const router = useRouter()
const player = router.currentRoute.value.params.player.toString()
const recentPlayer = player == 'player1' ? 'player1' : 'player2'
const otherPlayer = player == 'player1' ? 'player2' : 'player1'

const turn: Number = 0

let bothPlayer = ref<ChooseBoth>({
  turn: turn,
  player1: "wait",
  player2: "wait"
})

// let playerData = ref<Choose>({
//   turn: turn,
//   player: player === 'player1' ? 'player1' : player === 'player2' ? 'player2' : undefined,
//   choose: "wait"
// });

function isShowMask(player: 'player1' | 'player2') {
  if (bothPlayer.value[player] == "wait" || bothPlayer.value[player] == "ready") {
    return false
  }
  else {
    return true
  }
}

function isChoose(choose: fingertype) {
  if (choose == bothPlayer.value[recentPlayer]) {
    return 'active'
  } else {
    return ''
  }
}

function getChoose() {
  http
    .getChoose()
    .then((result) => {
      bothPlayer.value = result
      // setTimeout(() => { getChoose() }, 1000)
    })
    .catch((err) => {
      console.log(err.message, "err");
    });
}

function sendChoose(choose: fingertype) {
  bothPlayer.value[recentPlayer] = choose
  const param: Choose = {
    turn: turn,
    player: recentPlayer,
    choose: bothPlayer.value[recentPlayer]
  }
  http
    .sendChoose(param)
    .then((result) => {
      if (result.player2 == "wait" || result.player1 == "wait") {
        // setTimeout(() => { getChoose() }, 1000)
      }
    })
    .catch((err) => { });
}


onMounted(() => {
  getChoose()
});

</script>

<style lang="stylus">
.button
  padding 20px
  border 1px solid #000
  margin 20px 0
  &:hover
    cursor pointer
  &.active
    background-color #000
    color #fff
.mask
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  background-color rgba(0,0,0,.9)
  color #fff
  text-align center
  padding 80px
</style>
  