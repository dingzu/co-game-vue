<template>
  <div>这是一个猜拳游戏</div>
  <div>你是：{{$route.params.player}}</div>
  <div>你想要出什么?</div>
  <div>
    <div @click="sendChoose('scissors')">剪刀</div>
    <div @click="sendChoose('stone')">石头</div>
    <div @click="sendChoose('cloth')">布</div>
  </div>
</template>

<script lang='ts' setup>
import testApi from "@/api/fingerApi";
import { onMounted } from "vue";
import {useRouter } from 'vue-router'
const http = new testApi();
const router = useRouter()
const player = router.currentRoute.value.params.player.toString()
interface Choose {
    turn: Number,
    player: "player1" | "player2" | string
    choose: "scissors" | "stone" | "cloth" | "no"
}
let playerData:Choose = {
  turn: 0,
  player: player,
  choose:  "no"
};

function getChoose() {
  http
    .getChoose()
    .then((result) => {
      if (result.code == "200") {
        console.log(result.data, "res,get");
      }
    })
    .catch((err) => {
      console.log(err.message, "err");
    });
}

function sendChoose(chose:"scissors" | "stone" | "cloth" | "no") {
  playerData.choose = chose
  http
    .sendChoose(playerData)
    .then((result) => {
      if (result.code == "200") {
        console.log(result.data, "res,post");
      }
    })
    .catch((err) => {});
}


onMounted(() => {

});
</script>

<style lang="stylus"></style>
  