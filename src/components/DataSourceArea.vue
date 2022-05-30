<template>
  <a-card title='连接池' style="width: 100%">
    <template #extra>
      <a-button type="primary" @click="showModal">
        添加
      </a-button>
    </template>
    <a-popconfirm   v-for="ds in dataSourceList" title="移除" @confirm="deletePool(ds)" @cancel="cancelDelete(ds)" cancelText='取消' okText="确定">
      <a-button  style="color:#42b983;" closable v-if="ds==='sqLite'" > {{ ds }}
        <template #icon>
          <CloseCircleOutlined v-if="ds!=='sqLite'"/>
        </template>
      </a-button>
      <a-button v-else class="sourceClass ">{{ ds }}
        <template #icon>
          <CloseCircleOutlined />
        </template>
      </a-button>
    </a-popconfirm>
  </a-card>
  <a-modal v-model:visible="visible" title="添加数据源" @ok="handleOk" @cancel="handleCancel"  :confirm-loading="confirmLoading">
    <a-form
        :model="formState"
        name="sourceData"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >
      <a-form-item
          label="连接池名称"
          name="poolName"
          :rules="[{ required: true, message: '请输入连接池名称!' }]"
      >
        <a-input v-model:value="formState.poolName"/>
      </a-form-item>

      <a-form-item
          label="数据库驱动"
          name="driverClassName"
          :rules="[{ required: true, message: '请输入数据库驱动!' }]"
      >
        <a-select v-model:value="formState.driverClassName">
          <a-select-option value="com.ibm.db2.jcc.DB2Driver">com.ibm.db2.jcc.DB2Driver</a-select-option>
          <a-select-option value="com.mysql.cj.jdbc.Driver">com.mysql.cj.jdbc.Driver</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
          label="数据库URL"
          name="url"
          :rules="[{ required: true, message: '请输入数据库URL!' }]"
      >
        <a-input v-model:value="formState.url"/>
      </a-form-item>
      <a-form-item
          label="数据库用户名"
          name="username"
          :rules="[{ required: true, message: '请输入数据库用户名!' }]"
      >
        <a-input v-model:value="formState.username"/>
      </a-form-item>
      <a-form-item
          label="数据库密码"
          name="password"
          :rules="[{ required: true, message: '请输入数据库密码!' }]"
      >
        <a-input-password autocomplete="true" v-model:value="formState.password"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">

import axios from 'axios'
import {reactive, ref, toRaw} from "vue";
import {message} from "ant-design-vue";
import { CloseCircleOutlined } from '@ant-design/icons-vue';
import { getCurrentInstance } from "vue";
const appHost = getCurrentInstance()?.appContext.config.globalProperties.$appHost
interface FormState {
  poolName: string;
  driverClassName: string;
  url: string;
  username: string;
  password: string;
}

const dataSourceList = ref([]);
//控制模态框是否显示的参数
const visible = ref<boolean>(false);
//异步控制模态框确定按钮
const confirmLoading = ref<boolean>(false);
const formState = reactive<FormState>({
  poolName: '',
  driverClassName: '',
  url: '',
  username: '',
  password: ''

});
const showModal = () => {
  visible.value = true;
};
//模态框点击确认方法
const handleOk = (e: MouseEvent) => {

  confirmLoading.value = true;
  axios.post(`http://${appHost}/datasources/add`,toRaw(formState)).then((response) => {
    //刷新一遍前端数据源列表
    dataSourceList.value = response.data
    //还原加载按钮、关闭模态框
    confirmLoading.value = false;
    visible.value = false;
    message.success("添加成功")
  })
};
const handleCancel = (e:MouseEvent)=>{
  confirmLoading.value = false;
  visible.value = false;
}
const getAllPool =()=>{
  //获得所有连接池名称
  axios.get(`http://${appHost}/datasources/getDataSources`).then((response) => {
    dataSourceList.value = response.data
  })
}
//初始化连接池列表
getAllPool();
const cancelDelete =(ds:string)=>{
  message.warning("取消移除");
}
const deletePool=(ds:string)=>{
  if(ds==='sqLite') {
    message.warning('核心连接池，不允许移除!')
    return;
  }
  axios.delete(`http://${appHost}/datasources/remove`, {params: {name:ds}}).then((response)=>{
      message.success(`成功移除连接池 ${ds} `)
  })
}
</script>

<style scoped>
.sourceClass {
  color: #4678e3;
  padding: 0 10px;
  margin: 10px;
}
</style>
