<template>
  <el-form
    ref="baseForm"
    :model="form"
    :rules="rules"
    status-icon
    label-width="auto"
  >
    <el-form-item label="类型名称" prop="title">
      <el-input v-model="form.title" placeholder="请输入类型名称" />
    </el-form-item>
    <el-form-item label="类型code" prop="type">
      <el-input v-model="form.type" placeholder="请输入类型code" />
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
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { addCategory, categoryInfo, editCategory } from "@/api/artical.js";
const route = useRoute();
const router = useRouter();
const baseForm = ref(null);
let loading = ref(false);
const editId = ref("");

const form = reactive({
  title: "",
  type: "",
});
const rules = computed(() => {
  return {
    title: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
    type: [{ required: true, message: "请输入类型code", trigger: "blur" }],
  };
});

const parentList = ref([]);

const handleSubmit = () => {
  baseForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const method = editId.value ? editCategory : addCategory;
      const params = {
        ...form,
        parent:
          parentList.value.find((item) => item._id === form.parent)?.title ||
          "",
        _id: editId.value || undefined,
      };
      method(params)
        .then(() => {
          ElMessage({
            message: (editId.value ? "编辑" : "添加") + "菜单成功！",
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
  categoryInfo({ id: editId.value })
    .then((res) => {
      form.title = res.title;
      form.type = res.type;
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
