<template>
    <div style="height: 100%;width:100%;">
      <a-button type="primary" @click="getLogs">获取日志</a-button>
      <div id="log-container"
           style="height: 22vh;display: flex; overflow-y: scroll; background: #333; color: #aaa; padding: 2px;margin: 5px;">
        <a-textarea style=" background: #333; color: #aaa;" allowClear v-model:value="logText" placeholder="这里查看日志"/>
      </div>
    </div>
</template>

<script setup lang="ts">

import * as Stomp from 'stompjs/index'
 import  SockJS from 'sockjs-client'
//import * as SockJS from 'sockjs-client/dist/sockjs.min'
import {reactive, ref, toRaw} from "vue";
import axios from "axios";
import {getCurrentInstance} from "vue";


const appHost = getCurrentInstance()?.appContext.config.globalProperties.$appHost
const logText = ref('');

connectWebSocket();
function connectWebSocket() {
  const url = `http://${appHost}/get-logs-websocket`;
  let socket = new SockJS(url);
 let stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    logText.value = new Date().toLocaleString('lt-LT') + " :服务器连接成功\n"
    stompClient.subscribe('/topic/getLogs', function (greeting) {
      logText.value = logText.value + (
          `${greeting.body}`
      )
    });
  });
  //进行断线重连
  setInterval(() => {
    if (!stompClient.connected) {
      logText.value = new Date().toLocaleString('lt-LT') + ": 服务器连接已断开，正在重连...\n"
      socket = new SockJS(url);
      stompClient = Stomp.over(socket);
      stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        logText.value = new Date().toLocaleString('lt-LT') + " :服务器连接成功\n"
        stompClient.subscribe('/topic/getLogs', function (greeting) {

          logText.value = logText.value + (
              `${greeting.body}`
          )
        });
      });
    }
  }, 5000);

}

const getLogs = () => {
  axios.get(`http://${appHost}/websocket/getLogs`).then((response) => {
    console.log('发送获得日志请求')
  })
}


</script>

