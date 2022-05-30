<template>
  <a-card title='查询语句' style="width: 100%;height:100%" >
    <template #extra>
      <a-button type="primary" @click="showModal">
        添加
      </a-button>
    </template>
    <a-table sticky :columns="columns" :data-source="sqlData" bordered :scroll="{ y: 400,x:300 }"
             :pagination="{pageSize:5}" style="height:50vh">
      <template
          #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      >
        <div style="padding: 8px">
          <a-input
              ref="searchInput"
              :placeholder="`搜索 ${column.title}`"
              :value="selectedKeys[0]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="(e:any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="handleSearchTable(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
              type="primary"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="handleSearchTable(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon>
              <SearchOutlined/>
            </template>
            搜索
          </a-button>
          <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
            重置
          </a-button>
        </div>
      </template>
      <template #customFilterIcon="{ filtered }">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }"/>
      </template>
      <template #bodyCell="{ column, text,record }">
        <template v-if="column.key === 'action'">
          <div>
          <span v-if="editableData[record.key]">
            <a-typography-link @click="editCancel(record.key)">取消</a-typography-link>
             <a-divider type="vertical"/>
            <a-popconfirm title="确定保存?" @confirm="editSave(record.key) " cancelText='取消' okText="确定">
              <a>保存</a>
            </a-popconfirm>
          </span>
            <span v-else>
            <a @click="edit(record.key)">编辑</a>
              <a-divider type="vertical"/>
                <a @click="copySql(record)">复制URL</a>
              <a-divider type="vertical"/>
                <a-popconfirm @confirm="deleteSql(column,record)" @cancel="cancelDelete(record)" cancelText='取消'
                              okText="确定">
                         <a>删除</a>
                </a-popconfirm>
          </span>

          </div>
        </template>
        <template v-if="column.key==='name'">
          <span>
            {{text}}
          </span>
        </template>
        <template v-if="['poolName', 'sqlText','comment'].includes(column.dataIndex)">
            <a-input
                v-if="editableData[record.key]"
                v-model:value="editableData[record.key][column.dataIndex]"
                style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>

        </template>
        <template v-if="['name','poolName', 'sqlText','comment'].includes(column.dataIndex)">
        <span>
          <a @click="Clone(text)">
           <copy-outlined style="margin-left: 5px"/>
          </a>
          </span>
        </template>
      </template>

    </a-table>
  </a-card>
  <a-modal v-model:visible="visible" title="添加SQL" @ok="handleOk" @cancel="handleCancel"
           :confirm-loading="confirmLoading">
    <a-form
        :model="formState"
        name="sqlData"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
    >
      <a-form-item
          label="sql别名"
          name="name"
          :rules="[{ required: true, message: '请输入sql别名!' }]"
      >
        <a-input v-model:value="formState.name"/>
      </a-form-item>
      <a-form-item
          label="连接池名称"
          name="poolName"
          :rules="[{ required: true, message: '请输入连接池名称!' }]"
      >
        <a-select v-model:value="formState.poolName">
          <a-select-option v-for="pool in dataSourceListNoSqlite" :value="pool">{{ pool }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
          label="sql语句"
          name="sqlText"
          :rules="[{ required: true, message: '请输入sql语句,并确保sql语句正确!' }]"
      >
        <a-textarea v-model:value="formState.sqlText" autoSize allowClear/>
      </a-form-item>
      <a-form-item
          label="备注"
          name="comment"
      >
        <a-input v-model:value="formState.comment"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import axios from 'axios'
import {message} from "ant-design-vue";
import {reactive, ref, toRaw, UnwrapRef} from "vue";
import {SearchOutlined, CopyOutlined} from '@ant-design/icons-vue';
import {getCurrentInstance} from "vue";
import {cloneDeep} from 'lodash-es';
import {  copy } from '../util/utils'
const appHost = getCurrentInstance()?.appContext.config.globalProperties.$appHost
const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const editableData: UnwrapRef<Record<string, FormState>> = reactive({});
const searchInput = ref();

const columns = [
  {
    title: 'SQL别名',
    dataIndex: 'name',
    key: 'name',
    width: 160,
    customFilterDropdown: true,
    onFilter: (value: any, record: any) =>
        record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: '连接池',
    dataIndex: 'poolName',
    key: 'poolName',
    width: 150,
    customFilterDropdown: true,
    onFilter: (value: any, record: any) =>
        record.poolName.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: 'SQL语句',
    dataIndex: 'sqlText',
    key: 'sqlText',
    width: 600,
    resizable: true,
    customFilterDropdown: true,
    onFilter: (value: any, record: any) =>
        record.sqlText.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: '备注',
    key: 'comment',
    dataIndex: 'comment',
    width: 250
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 178,
  },
];

interface FormState {
  key: string
  name: string;
  poolName: string;
  sqlText: string;
  comment: string;
}

const formState = reactive<FormState>({
  key: '',
  name: '',
  poolName: '',
  sqlText: '',
  comment: ''
});
//控制模态框是否显示的参数
const visible = ref<boolean>(false);
const showModal = () => {
  visible.value = true;
};
//异步控制模态框确定按钮
const confirmLoading = ref<boolean>(false);
const sqlData = ref();
const dataSourceList = ref([]);
const dataSourceListNoSqlite = ref([]);
//模态框点击确认方法-添加sql语句
const handleOk = (e: MouseEvent) => {
  confirmLoading.value = true;
  if(formState.poolName==='sqLite'){
    message.error('不允许对sqLite数据库进行操作');
    return;
  }
  axios.post(`http://${appHost}/sqlite/add`, toRaw(formState)).then((response) => {
    if (response.data === 1) {
      message.success("添加成功");
      visible.value = false;
      getSqlInfo(); //如果新增成功，刷新列表
    } else {
      message.error("添加失败")
    }
    confirmLoading.value = false;
  })
}
//模态框取消
const handleCancel = (e: MouseEvent) => {
  confirmLoading.value = false;
  visible.value = false;
}
//获得所有连接池名称
const getAllPool = () => {
  axios.get(`http://${appHost}/datasources/getDataSources`).then((response:any) => {
     dataSourceList.value = response.data
    let temp:[] = toRaw(response.data)
     for (let i = 0; i < temp.length; i++) {
       if(temp[i]!=='sqLite')
         dataSourceListNoSqlite.value.push(temp[i]);
     }
  })
}
//获得所有sql信息
const getSqlInfo = () => {
  //获得存储的sql语句信息
  axios.get(`http://${appHost}/sqlite/getList`).then((response) => {
    sqlData.value = response.data;
    for (let i = 0; i < sqlData.value.length; i++) {
      sqlData.value[i].key = i;
    }
  })
}
//初始化
getSqlInfo();
getAllPool();
const deleteSql = (column: any, record: any) => {
  axios.delete(`http://${appHost}/sqlite/remove`, {params: {name: record.name}}).then((response) => {
    message.success(`成功删除SQL ${record.name} `)
    getSqlInfo();
  })
}
//删除sql方法
const cancelDelete = (record: any) => {
  message.warning(`取消删除SQL ${record.name} `)
}
//一键复制
const copySql = async (record: any) => {
  let url = `http://${appHost}/rest/query/` + record.name
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(url)
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    // 使text area不在viewport，同时设置不可见
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    new Promise<void>((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    })
  }
  message.success('已复制:' + url);
}
const Clone = (text: string) => {
  copy(text).then((res:any) => {
    message.success(res)
  })
};
//表格搜索
const handleSearchTable = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;

};
//重置搜索
const handleReset = (clearFilters: (arg0: { confirm: boolean; }) => void) => {
  clearFilters({confirm: true});
  state.searchText = '';
};
//编辑行点击事件
const edit = (key: string) => {
  editableData[key] = cloneDeep(sqlData.value.filter((item: { key: string; }) => key === item.key)[0]);
};
//编辑确认保存
const editSave = (key: string) => {

  Object.assign(sqlData.value.filter((item: { key: string; }) => key === item.key)[0], editableData[key]);
  let url = `http://${appHost}/sqlite/update`;
  axios.post(url, toRaw(editableData[key])).then((response) => {
    if (response.data === 1) {
      message.success('更新成功');
    }
    else{
      message.error('更新失败');
    }
  })
  delete editableData[key];
};
//取消编辑
const editCancel = (key: string) => {
  delete editableData[key];
};
</script>

<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
.ant-table-pagination.ant-pagination {
  margin: 0 !important;
}
.ant-table-wrapper{
  height: 54vh;
}
</style>
