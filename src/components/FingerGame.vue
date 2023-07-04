<template>
  <div>这是一个猜拳游戏</div>
  <div>你是：{{player}}</div>
  <div>你想要出什么?</div>
  <div>
    <div @click="sendChoose('scissors')" class="button">剪刀</div>
    <div @click="sendChoose('stone')" class="button">石头</div>
    <div @click="sendChoose('cloth')" class="button">布</div>
  </div>
  <div>你的对手是：{{otherPlayer}}</div>
  <div>他出了: {{bothPlayer[otherPlayer]}}</div>
</template>

<script lang='ts' setup>
import {fingerApi,Choose,ChooseBoth,fingertype} from "@/api/fingerApi";
import { onMounted,ref } from "vue";
import {useRouter } from 'vue-router'
const http = new fingerApi();
const router = useRouter()
const player = router.currentRoute.value.params.player.toString()
const otherPlayer = player=='player1'? 'player2':'player1'

const turn:Number = 0

let bothPlayer = ref<ChooseBoth>({
  turn: turn,
  player1: "wait",
  player2: "wait"
})

let playerData:Choose = {
  turn: turn,
  player: player === 'player1' ? 'player1' : player === 'player2' ? 'player2' : undefined,
  choose: "wait"
};

function getChoose() {
  http
    .getChoose()
    .then((result) => {
        bothPlayer.value = result
        getChoose()
    })
    .catch((err) => {
      console.log(err.message, "err");
    });
}

function sendChoose(chose:fingertype) {
  playerData.choose = chose
  http
    .sendChoose(playerData)
    .then((result) => {
      if (result.player2 == "no" || result.player1 == "no") {
        getChoose()
      }
    })
    .catch((err) => {});
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
</style>
  