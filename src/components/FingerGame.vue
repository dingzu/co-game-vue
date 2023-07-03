<template>
  <div>这是一个猜拳游戏</div>
</template>

<script lang='ts' setup>
import testApi from "@/api/testApi";
import { onMounted } from "vue";
const http = new testApi();
let params = {
  name: "jack",
  sex: "man",
};
onMounted(() => {
  http
    .findSettleList()
    .then((result) => {
      if (result.code == "200") {
        console.log(result.data, "res,get");
      }
    })
    .catch((err) => {
      console.log(err.message, "err");
    });

  http
    .addSettle(params)
    .then((result) => {
      if (result.code == "200") {
        console.log(result.data, "res,post");
      }
    })
    .catch((err) => {});
});
</script>

<style lang="stylus"></style>
  