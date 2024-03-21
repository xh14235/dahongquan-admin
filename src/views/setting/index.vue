<template>
  <el-form :model="form" label-width="auto">
    <el-form-item label="登录背景图">
      <el-upload
        class="avatar-uploader"
        :action="action"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleBgSuccess"
      >
        <img v-if="form.bgUrl" :src="form.bgUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <i class="iconfont x-icon-custom-user"></i>
        </el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="网站logo">
      <el-upload
        class="avatar-uploader"
        :action="action"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleLogoSuccess"
      >
        <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <i class="iconfont x-icon-custom-user"></i>
        </el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确认
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { editSetting } from "@/api/setting";
import { useStore } from "vuex";
const store = useStore();
const bgUrl = store.state.setting.setting.bgUrl;
const logoUrl = store.state.setting.setting.logoUrl;

const action =
  (process.env.VUE_APP_BASE_API || "http://127.0.0.1:3000/admin/api") +
  "/upload";
const headers = {
  Authorization: "Bearer " + store.state.user.token,
};

const loading = ref(false);

const form = reactive({
  bgUrl: "" || bgUrl,
  logoUrl: "" || logoUrl,
});

const handleSubmit = () => {
  loading.value = true;
  editSetting(form)
    .then((res) => {
      if (res && res.bgUrl && res.logoUrl) {
        store.commit({
          type: "setting/BASE_SETTING",
          setting: res,
        });
        ElMessage({
          message: "基本配置修改成功！",
          type: "success",
        });
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};
const handleBgSuccess = (response, uploadFile) => {
  if (response && response.url) {
    ElMessage({
      message: "背景图上传成功！",
      type: "success",
    });
    form.bgUrl =
      (process.env.VUE_APP_BASE_IMG_URL || "http://127.0.0.1:3000/uploads/") +
      response.url;
  }
};
const handleLogoSuccess = (response, uploadFile) => {
  if (response && response.url) {
    ElMessage({
      message: "网站logo上传成功！",
      type: "success",
    });
    form.logoUrl =
      (process.env.VUE_APP_BASE_IMG_URL || "http://127.0.0.1:3000/uploads/") +
      response.url;
  }
};
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 144px;
  height: 144px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 144px;
  height: 144px;
  text-align: center;
}
</style>
