<template>
  <el-menu
    :default-active="defaultActive"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    router
  >
    <template v-for="item of menus" :key="item.code">
      <el-sub-menu
        :index="item.code"
        v-if="item.children && item.children.length"
      >
        <template #title>
          <i class="iconfont" :class="['x-icon-' + item.icon]"></i>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="menu of item.children"
          :key="menu.path"
          :index="menu.path"
        >
          <i class="iconfont" :class="['x-icon-' + menu.icon]"></i>
          {{ menu.title }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item :index="item.code" v-else>
        <i class="iconfont" :class="['x-icon-' + item.icon]"></i>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";
const route = useRoute();

const isCollapse = ref(false);
const handleOpen = (key, keyPath) => {};
const handleClose = (key, keyPath) => {};

let defaultActive = ref("");

watch(
  () => route.path,
  (val) => {
    defaultActive.value = val;
  },
  { immediate: true }
);

const menus = computed(() => {
  const res = store.state.menu.menus;
  let list = [];
  res.forEach((item) => {
    if (!item.parent && item.showInNav) {
      list.push({
        title: item.title,
        icon: item.icon,
        code: item._id,
        children: [],
      });
    }
  });
  list.forEach((item) => {
    res.forEach((r) => {
      if (r.parent === item.title && r.showInNav) {
        item.children.push({
          title: r.title,
          icon: r.icon,
          path: r.path,
        });
      }
    });
  });
  return list;
});
</script>

<style lang="less" scoped>
.el-menu {
  height: 100%;
}
</style>
