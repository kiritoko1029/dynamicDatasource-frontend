<template>
  <div style="float: right">
    <a-dropdown placement="bottom">
      <a-button type="primary" style="margin-right: 3vw">文档</a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a target="_blank" rel="help" :href="'http://'+appHost+'/doc'">
              离线接口文档(knife4j)
            </a>
          </a-menu-item>
          <a-menu-item>
            <a target="_blank" rel="help" :href="'http://'+appHost+'/offlinedoc'">
              离线接口文档(ApiPost)
            </a>
          </a-menu-item>
          <a-menu-item>
            <a target="_blank" rel="help" :href="'http://'+appHost+'/onlinedoc'">
              在线接口文档(ApiPost)
            </a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-button type="primary" style="margin-right:3vw;z-index: 9999;margin-top: 2vh" :loading="rebootLoading"
              @click="reboot">
      重启
      <template #icon>
        <redo-outlined/>
      </template>
    </a-button>
  </div>

</template>

<script setup lang="ts">
import {RedoOutlined} from '@ant-design/icons-vue'
import {getCurrentInstance, ref} from "vue";
import axios from "axios";
import {MenuProps, message,DropdownProps} from "ant-design-vue";

const appHost = getCurrentInstance()?.appContext.config.globalProperties.$appHost
const rebootLoading = ref(false)
const reboot = () => {
  axios.get(`http://${appHost}/rest/reboot`).then((response: any) => {
    if (response.data === 1)
      message.success("重启成功");
    else message.error("重启失败")
  })
}
const handleMenuClick: MenuProps['onClick'] = e => {
  console.log('click', e);
};
</script>

<style scoped>

</style>
