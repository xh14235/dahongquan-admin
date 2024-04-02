<template>
  <el-form
    ref="baseForm"
    :model="form"
    :rules="rules"
    status-icon
    label-width="auto"
  >
    <el-form-item label="文章分类" prop="category">
      <el-select v-model="form.category" placeholder="请选择文章分类">
        <el-option
          v-for="item of categoryList"
          :key="item._id"
          :label="item.title"
          :value="item.type"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入文章标题" />
    </el-form-item>
    <el-form-item label="文章编码" prop="code">
      <el-input v-model="form.code" placeholder="请输入文章编码" />
    </el-form-item>
    <el-form-item label="缩略图" prop="imgUrl">
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
    <el-form-item label="文章简介" prop="desc">
      <el-input
        v-model="form.desc"
        placeholder="请输入文章简介"
        :rows="3"
        type="textarea"
      />
    </el-form-item>
    <el-form-item label="更新时间" prop="time">
      <el-date-picker
        v-model="form.time"
        type="datetime"
        placeholder="请选择更新时间"
      />
    </el-form-item>
    <el-form-item label="详细内容" prop="content">
      <Tinymce v-model="form.content" @change="handleChange" width="100%" />
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
// import { ElMessage } from "element-plus";
import Tinymce from "@/components/Tinymce/Tinymce.vue";
import { reactive, ref, onMounted, computed } from "vue";
import store from "@/store";
import { useRouter, useRoute } from "vue-router";
import {
  addArtical,
  articalInfo,
  editArtical,
  categoryList as categoryApi,
} from "@/api/artical.js";
const route = useRoute();
const router = useRouter();
const baseForm = ref(null);
let loading = ref(false);
const editId = ref("");

const form = reactive({
  title: "",
  code: "",
  category: "",
  imgUrl: "",
  desc: "",
  content: "",
  time: new Date(),
});
const rules = computed(() => {
  return {
    title: [{ required: true, message: "请输入文章名称", trigger: "blur" }],
    code: [
      {
        required: form.category === "intro",
        message: "请输入文章编码",
        trigger: "blur",
      },
    ],
    category: [{ required: true, message: "请输入文章分类", trigger: "blur" }],
    desc: [{ required: true, message: "请输入文章简介", trigger: "blur" }],
    content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
  };
});

const action =
  (process.env.VUE_APP_BASE_API || "http://127.0.0.1:3000/admin/api") +
  "/upload";

const headers = {
  Authorization: "Bearer " + store.state.user.token,
};

const categoryList = ref([]);
const getCategoryList = () => {
  categoryApi().then((res) => {
    categoryList.value = res;
  });
};

const handleChange = (content) => {
  // console.log(content);
};

const handleSubmit = () => {
  baseForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const method = editId.value ? editArtical : addArtical;
      const params = {
        ...form,
        _id: editId.value || undefined,
      };
      method(params)
        .then(() => {
          ElMessage({
            message: (editId.value ? "编辑" : "添加") + "文章成功！",
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

const getDetails = () => {
  articalInfo({ id: editId.value })
    .then((res) => {
      form.title = res.title;
      form.code = res.code;
      form.time = res.time || new Date();
      form.category = res.category;
      form.desc = res.desc;
      form.content = res.content;
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleSuccess = (response, uploadFile) => {
  if (response && response.url) {
    ElMessage({
      message: "缩略图上传成功！",
      type: "success",
    });
    form.imgUrl =
      (process.env.VUE_APP_BASE_IMG_URL || "http://127.0.0.1:3000/uploads/") +
      response.url;
  }
};

onMounted(() => {
  getCategoryList();
  const { id } = route.query;
  if (id) {
    editId.value = id;
    getDetails();
  }
});
</script>

<style lang="less" scoped>
:deep(.ck-editor) {
  width: 100%;
}
</style>
