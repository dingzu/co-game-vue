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
        <div class="choose">
          <div class="scissors button">布</div>
          <div class="stone button">石头</div>
          <div class="cloth button">布</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import {
  fingerApi,
  Choose,
  FingerDataType,
  FingerType,
  UserStateType,
} from "@/api/fingerApi";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const route = useRoute();
const store = useStore();
console.log(store.state.finger, route.params.tableIndex);
let role = ref<"viewer" | "player1" | "player2">("viewer");
let fingerData = ref<FingerDataType>({
  player1: {
    name: "player1",
    choose: null,
    state: "wait",
    turn: 0,
  },
  player2: {
    name: "player2",
    choose: null,
    state: "wait",
    turn: 0,
  },
});

// 获取当前用户身份，默认是观众
if (
  store.state.finger.index == route.params.tableIndex &&
  store.state.finger.role != null
) {
  role = store.state.finger.role;
}

const http = new fingerApi();

onMounted(() => {});
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
  