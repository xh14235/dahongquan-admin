<template>
  <div
    class="login-wrapper"
    :style="{
      'background-image': `url(${bgUrl})`,
    }"
  >
    <el-card>
      <template #header>
        <div class="card-header">
          <span>登录</span>
        </div>
      </template>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleSubmit(ruleFormRef)">
          登录
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { login } from "@/api/user.js";
import { menuList } from "@/api/menu.js";
import { useStore } from "vuex";
const store = useStore();
import { useRouter } from "vue-router";
const router = useRouter();

const bgUrl = store.state.setting.setting.bgUrl;

const ruleFormRef = ref(null);
const ruleForm = reactive({
  username: "",
  password: "",
});

const validateUser = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入用户名！"));
  } else {
    callback();
  }
};
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码！"));
  } else {
    callback();
  }
};
const rules = reactive({
  username: [{ validator: validateUser, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
});

const handleSubmit = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      login(ruleForm).then((res) => {
        if (res?.token && res?.username) {
          ElMessage({
            message: "登录成功！",
            type: "success",
          });
          store.commit({
            type: "user/SET_INFO",
            token: res.token,
            userInfo: {
              username: res.username,
            },
          });
          router.push({
            path: "/",
          });
          getMenuList();
          getIcons();
        }
      });
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const getMenuList = () => {
  menuList()
    .then((res) => {
      store.commit({
        type: "menu/SET_MENU",
        menus: res,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getIcons = () => {
  fetch("https://at.alicdn.com/t/c/font_4336396_dny7gyvryv.css")
    .then((res) => {
      return res.text();
    })
    .then((text) => {
      let icons = text.match(/.x-icon-(\S*):before/g).map((item) => {
        return item.replace(/.x-icon-/g, "").replace(/:before/g, "");
      });
      store.commit({
        type: "icon/SET_ICONS",
        icons,
      });
    });
};
</script>

<style lang="less" scoped>
.login-wrapper {
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-card {
    width: 500px;
  }
}
</style>
