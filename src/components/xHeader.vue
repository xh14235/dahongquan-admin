<template>
  <div class="x-header">
    <div class="logo">
      <img :src="logoUrl" />
    </div>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <span class="username">
          {{ store.state.user?.userInfo?.username || "--" }}
        </span>
        <i class="iconfont x-icon-custom-user"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
const store = useStore();
import { useRouter } from "vue-router";
const router = useRouter();

const logoUrl = store.state.setting.setting.logoUrl;

const handleCommand = (command) => {
  if (command === "logout") {
    logout();
  }
};

const logout = () => {
  store.commit({
    type: "user/SET_INFO",
    token: "",
    userInfo: null,
  });

  router.push({
    path: "/user/login",
  });
};
</script>

<style lang="less" scoped>
.x-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo img {
    height: 48px;
  }
  .el-dropdown {
    color: #ffffff;
  }
}
</style>
