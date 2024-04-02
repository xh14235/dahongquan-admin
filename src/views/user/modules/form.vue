<template>
  <el-form
    ref="baseForm"
    :model="form"
    :rules="rules"
    status-icon
    label-width="auto"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" />
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
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { addUser, userInfo, editUser } from "@/api/user.js";
const router = useRouter();
const route = useRoute();
const baseForm = ref(null);
const editId = ref("");
let loading = ref(false);

const form = reactive({
  username: "",
  password: "",
});
const rules = {
  username: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 3, max: 20, message: "密码长度3-20", trigger: "blur" },
  ],
};

const handleSubmit = () => {
  baseForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const method = editId.value ? editUser : addUser;
      const params = {
        ...form,
        _id: editId.value || undefined,
      };
      method(params)
        .then(() => {
          ElMessage({
            message: (editId.value ? "编辑" : "添加") + "用户成功！",
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
  userInfo({ id: editId.value })
    .then((res) => {
      form.username = res.username;
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {
  const { id } = route.query;
  if (id) {
    editId.value = id;
    getDetails();
  }
});
</script>
