<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <x-header />
    </el-header>
    <el-container>
      <el-aside class="app-aside">
        <x-nav />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import XHeader from "@/components/xHeader.vue";
import XNav from "@/components/xNav.vue";
</script>

<style lang="less">
.app-container {
  .app-header {
    background: @mainColor;
  }
}
.app-aside {
  width: 300px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>
