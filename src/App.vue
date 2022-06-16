<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import DataSourceArea from "./components/DataSourceArea.vue";
import QuerySqlArea from "./components/QuerySqlArea.vue";
import LogArea from "./components/LogArea.vue";
import TopButtons from "./components/TopButtons.vue";

</script>

<template>
  <div>
    <a-layout-header>
      <div>
        <h1 class="headerClass">动态多数据源控制台2.0
        <TopButtons />
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
          <LogArea />
        </a-col>
      </a-row>
    </a-layout-content>

  </div>
</template>

<style lang="css">

.bottomRow {
  margin-top: 2vh;
}

.headerClass {
  position: relative;
  text-align: center;
  color: aliceblue;
}
</style>
