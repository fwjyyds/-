<script setup lang="ts">

import { ipcRenderer, contextBridge, ipcMain, IpcMainInvokeEvent } from 'electron'
import axios from 'axios'
import { onMounted, ref } from 'vue';
import { ElButton, ElMessage } from 'element-plus';
import { useUserStore } from '../stores/blogtext';
import { useRouter } from 'vue-router';
import type { dataContent } from '../types/data';





import io from 'socket.io-client';

const userstore = useUserStore()
import { socket } from '../App.vue'
import { useLtsStore } from '../stores/lts';
const ltsstore = useLtsStore()
const tip = (mod, mess) => {
  let config = { plain: true, message: mess }
  if (mod === 1) {
    config['type'] = 'success'
  }
  else if (mod === 2) {
    config['type'] = 'info'
  }
  else if (mod === 3) {
    config['type'] = 'warning'
  }
  else if (mod === 4) {
    config['type'] = 'error'
  }
  ElMessage(config)
}

// let script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = 'http:localhost:3010/socket.io/socket.io.js';
//     document.body.appendChild(script);

 const getltslist = async (id) => {
  await axios.post('http://localhost:3010/getnote', { userid: id, fun: 3 }).then((res) => {

    if (res.data.code === '1') {

      tip(1, '群聊获取成功')
      ltsstore.setltslist(res.data.res)

    }
    else {
      //失败
      tip(4, '群聊获取失败')
    }

  })
}









// let res = ref()

// const getdata = async (query: string) => {

//   res.value=  new Promise<any>((resolve, reject) => {
//     window.Electron.ipcRenderer.invoke('baidu', query).then((res) => {
//       console.log(res)
//       resolve(res)
//     }).catch((err) => {
//       reject(err)
//     })
//   })
//   console.log('asd',res.value)
// }
// getdata('12345')

//变量管理
let accountvalue = ref(''), passvalue = ref('')
const router = useRouter()
//密码验证
const vertifypass = async (a, p) => {
  await axios.post('http://localhost:3010/login', { username: accountvalue.value, password: passvalue.value }).then((res: { data: dataContent, status: Number, statusText: String, headers: Object, config: Object }) => {

    if (res.data.code === '1') {
      tip(1, '登陆成功')

      socket.on('loginsuccess', () => {
        tip(1, '网路链接成功')
        userstore.setcurrentuser(res.data.user)
     
        getltslist(userstore.currentuser.username)
        localStorage.setItem('ws_token', JSON.stringify(res.data.token))
        router.push('/main')
        socket.off('loginsuccess')
        socket.off('loginerror')
      })
      socket.on('loginerror', () => {
        tip(3, '已经登陆了')
        socket.off('loginsuccess')
        socket.off('loginerror')
      })

      socket.emit('login', {
        user: res.data.user
      })
    }
    else {
      tip(3, res.data.msg)
    }

  })



}


</script>

<template>
  <div class="flex1 bg1">
    <img
      src="https://tse1-mm.cn.bing.net/th/id/OIP-C.PmryuaVAInYu2qLhWeMiYwHaI3?w=89&h=90&c=1&rs=1&qlt=90&r=0&pid=InlineBlock"
      alt="" class="img1 mt10">
    <input class="input1 mt10" v-model="accountvalue" placeholder="account" type="text">
    <input class="input1 mt10" v-model="passvalue" placeholder="password" type="password">
    <!-- <div style="display: flex; ">    <input class="input10 mt10" type="checkbox" name="" id="">
    <span style="color:#ffffff;font-size: 0.8em;">已阅读并且同意服务协议和隐私协议</span>  </div> -->

    <button class="button1 mt10" @click="vertifypass(accountvalue, passvalue)">登录</button>

    <!-- <span class="span1">扫码登陆</span><span class="span1">忘记密码</span><span class="span1">注册账号</span> -->
  </div>

</template>

<style lang="scss">
@import '../assets/normal.scss';
</style>
