<template>
  <div class="sss">
    <div class="btns" style="margin-bottom: 10px">
      <el-button type="primary" @click="toForm(null)">新增</el-button>
    </div>

    <el-table :data="banners" style="width: 100%">
      <el-table-column prop="title" label="名称" />
      <el-table-column prop="path" label="路径" />
      <el-table-column label="描述">
        <template #default="scope">
          {{ scope.row.desc || "--" }}
        </template>
      </el-table-column>
      <el-table-column label="缩略图">
        <template #default="scope">
          <img class="banner-img" :src="scope.row.imgUrl" />
        </template>
      </el-table-column>
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
      <span>确认要删除用户吗？</span>
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
// import { ElMessage } from "element-plus";
import { bannerList, deleteBanner } from "@/api/setting.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const banners = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const deleteId = ref("");

const getBannerList = () => {
  loading.value = true;
  bannerList()
    .then((res) => {
      banners.value = [];
      banners.value.push(...res);
      loading.value = false;
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });
};
getBannerList();

const showConfirm = (id) => {
  dialogVisible.value = true;
  deleteId.value = id;
};
const handleClose = () => {
  deleteBanner({ id: deleteId.value })
    .then((res) => {
      if (res.success) {
        dialogVisible.value = false;
        ElMessage({
          message: "删除用户成功！",
          type: "success",
        });
        getBannerList();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const toForm = (row) => {
  router.push({
    path: "/banner/form",
    query: { id: row?._id },
  });
};
</script>

<style lang="less" scoped>
.banner-img {
  height: 60px;
}
</style>
