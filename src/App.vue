<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import DataSourceArea from "./components/DataSourceArea.vue";
import QuerySqlArea from "./components/QuerySqlArea.vue";
import LogArea from "./components/LogArea.vue";
import {RedoOutlined} from '@ant-design/icons-vue'
import {getCurrentInstance, ref} from "vue";
import axios from "axios";
import {message} from "ant-design-vue";

const appHost = getCurrentInstance()?.appContext.config.globalProperties.$appHost
const rebootLoading = ref(false)
const reboot = () => {
  axios.get(`http://${appHost}/rest/reboot`).then((response: any) => {
    if (response.data === 1)
      message.success("重启成功");
    else message.error("重启失败")
  })
}
</script>

<template>
  <div>
    <a-layout-header>
      <div>
        <h1 class="headerClass">动态多数据源控制台2.0
          <a-button type="primary" style="float:right;z-index: 9999;margin-top: 2vh" :loading="rebootLoading"
                    @click="reboot">
            重启
            <template #icon>
              <redo-outlined/>
            </template>
          </a-button>
        </h1>
      </div>


    </a-layout-header>
    <a-layout-content>
      <a-row :gutter="[16, 16]">
        <a-col :span="4">
          <DataSourceArea/>
        </a-col>
        <a-col :span="20">
          <QuerySqlArea/>
        </a-col>
      </a-row>
      <a-row :gutter="[16, 16]" class="bottomRow">
        <a-col :span="24">
          <LogArea/>
        </a-col>
      </a-row>
    </a-layout-content>

  </div>
</template>

<style>

.bottomRow {
  margin-top: 2vh;
}

.headerClass {
  text-align: center;
  color: aliceblue;
}
</style>
