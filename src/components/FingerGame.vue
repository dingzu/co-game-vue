<template>
  <div>场上比分，胜利 {{ game.win }},落败 {{ game.lose }},平局 {{ game.equil }}</div>
  <div>你是：{{ player }}</div>
  <div>你的对手是：{{ otherPlayer }}</div>
  <div>你想要出什么?</div>
  <div>
    <div @click="sendChoose('scissors', 'choosed')" :class="['button', isChoose('scissors')]">剪刀</div>
    <div @click="sendChoose('stone', 'choosed')" :class="['button', isChoose('stone')]">石头</div>
    <div @click="sendChoose('cloth', 'choosed')" :class="['button', isChoose('cloth')]">布</div>
  </div>
  <div class="mask" v-if="isShowMask()">
    <div>你选择了: {{ cnTrans(bothPlayer[recentPlayer].choose) }}</div>
    <div v-if="bothPlayer[otherPlayer].state == 'wait'">
      <div>等待对手选择</div>
    </div>
    <div v-else>
      <div>你的对手选择了: {{ cnTrans(bothPlayer[otherPlayer].choose) }}</div>
      <div>{{ gameOver() }}</div>
      <div class="button" @click="gameOverSet(), sendChoose(null, 'ready')"
        v-if="bothPlayer[recentPlayer].state != 'ready'">下一局</div>
      <div v-else>等待对手准备</div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { fingerApi, Choose, FingerData, FingerType, UserStateType } from "@/api/fingerApi";
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'
const http = new fingerApi();
const router = useRouter()
const player = 'player1'
const recentPlayer = player == 'player1' ? 'player1' : 'player2'
const otherPlayer = player == 'player1' ? 'player2' : 'player1'

const turn: Number = 0

// 计分器
let game = ref<{ [key: string]: number }>({
  win: 0,
  lose: 0,
  equil: 0,
})

let bothPlayer = ref<FingerData>({
  turn: turn,
  player1: {
    choose: null,
    state: 'wait'
  },
  player2: {
    choose: null,
    state: 'wait'
  }
})

function gameOver() {
  // 如果出布
  if (bothPlayer.value[recentPlayer].choose == 'cloth') {
    if (bothPlayer.value[otherPlayer].choose == 'cloth') {
      return "平局"
    }
    if (bothPlayer.value[otherPlayer].choose == 'stone') {
      return "你赢了"
    }
    if (bothPlayer.value[otherPlayer].choose == 'scissors') {
      return "你输了"
    }
  }
  // 如果出石头
  if (bothPlayer.value[recentPlayer].choose == 'stone') {
    if (bothPlayer.value[otherPlayer].choose == 'cloth') {
      return "你输了"
    }
    if (bothPlayer.value[otherPlayer].choose == 'stone') {
      return "平局"
    }
    if (bothPlayer.value[otherPlayer].choose == 'scissors') {
      return "你赢了"
    }
  }
  // 如果出剪刀
  if (bothPlayer.value[recentPlayer].choose == 'scissors') {
    if (bothPlayer.value[otherPlayer].choose == 'cloth') {
      return "你赢了"
    }
    if (bothPlayer.value[otherPlayer].choose == 'stone') {
      return "你输了"
    }
    if (bothPlayer.value[otherPlayer].choose == 'scissors') {
      return "平局"
    }
  }
}

function gameOverSet() {
  // 如果出布
  if (bothPlayer.value[recentPlayer].choose == 'cloth') {
    if (bothPlayer.value[otherPlayer].choose == 'cloth') {
      game.value.win += 1
    }
    if (bothPlayer.value[otherPlayer].choose == 'stone') {
      game.value.win += 1
    }
    if (bothPlayer.value[otherPlayer].choose == 'scissors') {
      game.value.lose += 1
    }
  }
  // 如果出石头
  if (bothPlayer.value[recentPlayer].choose == 'stone') {
    if (bothPlayer.value[otherPlayer].choose == 'cloth') {
      game.value.lose += 1
    }
    if (bothPlayer.value[otherPlayer].choose == 'stone') {
      game.value.win += 1
    }
    if (bothPlayer.value[otherPlayer].choose == 'scissors') {
      game.value.win += 1
    }
  }
  // 如果出剪刀
  if (bothPlayer.value[recentPlayer].choose == 'scissors') {
    if (bothPlayer.value[otherPlayer].choose == 'cloth') {
      game.value.win += 1
    }
    if (bothPlayer.value[otherPlayer].choose == 'stone') {
      game.value.lose += 1
    }
    if (bothPlayer.value[otherPlayer].choose == 'scissors') {
      game.value.equil += 1
    }
  }
}

function cnTrans(choose: FingerType) {
  switch (choose) {
    case 'cloth': return '布'
    case 'stone': return '石头'
    case 'scissors': return '剪刀'
    case null: return '没选还'
  }
}

function isShowMask() {
  if (bothPlayer.value[recentPlayer].state == 'wait' || bothPlayer.value[recentPlayer].choose == null) {
    return false
  }
  else {
    return true
  }
}

function isChoose(choose: FingerType) {
  if (choose == bothPlayer.value[recentPlayer].choose) {
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
      console.log('测试', bothPlayer.value)
      // 轮询，等待对方玩家选择
      if (result[otherPlayer].state == 'wait') {
        setTimeout(() => { getChoose() }, 1000)
      }
      // 轮询，等待对方玩家准备下一局
      else if (result[player].state == 'ready' && result[otherPlayer].state != 'ready') {
        setTimeout(() => { getChoose() }, 1000)
      }
    })
    .catch((err) => {
      console.log(err.message, "err");
    });
}

function sendChoose(choose: FingerType, state: UserStateType) {
  bothPlayer.value[recentPlayer].choose = choose
  bothPlayer.value[recentPlayer].state = state
  const param: Choose = {
    turn: turn,
    player: recentPlayer,
    choose: bothPlayer.value[recentPlayer].choose,
    state: bothPlayer.value[recentPlayer].state
  }
  http
    .sendChoose(param)
    .then((result) => {
      // 如果对方还没有选择，进行一次查询
      bothPlayer.value = result
      setTimeout(() => { getChoose() }, 1000)
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
  