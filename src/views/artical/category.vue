<template>
  <div class="sss">
    <div class="btns" style="margin-bottom: 10px">
      <el-button type="primary" @click="toForm()">新增</el-button>
    </div>

    <el-table :data="categories" style="width: 100%">
      <el-table-column prop="title" label="类型名称" />
      <el-table-column prop="type" label="类型code" />
      <el-table-column prop="action" label="操作" width="180">
        <template #default="scoped">
          <el-button link type="primary" @click="toForm(scoped.row)">
            编辑
          </el-button>
          <el-button link @click="showConfirm(scoped.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="提示">
      <span>确认要删除文章分类吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleClose">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { categoryList, deleteCategory } from "@/api/artical.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { useStore } from "vuex";
const store = useStore();

const categories = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const deleteId = ref("");

const getCategoryList = () => {
  loading.value = true;
  categoryList()
    .then((res) => {
      categories.value = [];
      categories.value.push(...res);
      loading.value = false;
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });
};
getCategoryList();

const showConfirm = (id) => {
  dialogVisible.value = true;
  deleteId.value = id;
};
const handleClose = () => {
  deleteCategory({ id: deleteId.value })
    .then((res) => {
      if (res.success) {
        dialogVisible.value = false;
        ElMessage({
          message: "删除文章分类成功！",
          type: "success",
        });
        getCategoryList();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const toForm = (row) => {
  router.push({
    path: "/artical/category/form",
    query: { id: row?._id },
  });
};
</script>
