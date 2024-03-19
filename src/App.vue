<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { baseSetting } from "@/api/setting";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const locale = zhCn;
import { useStore } from "vuex";
const store = useStore();

// 获取基本配置
const getBaseSetting = () => {
  baseSetting().then((res) => {
    const bgUrl = res?.bgUrl || "/img/bg.jpg";
    const logoUrl = res?.logoUrl || "/img/logo.jpg";
    store.commit({
      type: "setting/BASE_SETTING",
      setting: { bgUrl, logoUrl },
    });
  });
};
getBaseSetting();
</script>

<style lang="less" scoped>
@import "//at.alicdn.com/t/c/font_4336396_dny7gyvryv.css";
</style>
