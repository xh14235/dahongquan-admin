<template>
  <el-form
    ref="baseForm"
    :model="form"
    :rules="rules"
    status-icon
    label-width="auto"
  >
    <el-form-item label="名称" prop="title">
      <el-input v-model="form.title" placeholder="请输入菜单名称" />
    </el-form-item>
    <el-form-item label="路径" prop="path">
      <el-input v-model="form.path" placeholder="请输入菜单路径" />
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input
        v-model="form.desc"
        placeholder="请输入描述"
        :rows="3"
        type="textarea"
      />
    </el-form-item>
    <el-form-item label="banner图" prop="imgUrl">
      <el-upload
        class="avatar-uploader"
        :action="action"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleSuccess"
      >
        <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <i class="iconfont x-icon-custom-user"></i>
        </el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        确认
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { addBanner } from "@/api/setting.js";
import store from "@/store";
const route = useRoute();
const router = useRouter();
const baseForm = ref(null);
let loading = ref(false);

const form = reactive({
  title: "",
  path: "",
  desc: "",
  imgUrl: "",
});
const rules = computed(() => {
  return {
    title: [{ required: true, message: "请输入名称", trigger: "blur" }],
    path: [{ required: true, message: "请输入路径", trigger: "blur" }],
    desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
    imgUrl: [{ required: true, message: "请上传图片", trigger: "blur" }],
  };
});

const action =
  (process.env.VUE_APP_BASE_API || "http://127.0.0.1:3000/admin/api") +
  "/upload";

const headers = {
  Authorization: "Bearer " + store.state.user.token,
};

const handleSubmit = () => {
  baseForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const params = {
        ...form,
      };
      addBanner(params)
        .then(() => {
          ElMessage({
            message: "添加banner图成功！",
            type: "success",
          });
          handleCancel();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

const handleCancel = () => {
  router.back();
};

const handleSuccess = (response, uploadFile) => {
  if (response && response.url) {
    ElMessage({
      message: "banner图图上传成功！",
      type: "success",
    });
    form.imgUrl =
      (process.env.VUE_APP_BASE_IMG_URL || "http://127.0.0.1:3000/uploads/") +
      response.url;
  }
};
</script>

<style lang="less" scoped>
.icons-box {
  width: 100%;
  display: flex;
  .iconfont {
    margin: 15px;
    cursor: pointer;
    &.active {
      color: #258dde;
    }
  }
}
</style>
