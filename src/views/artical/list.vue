<template>
  <el-form inline :model="formInline">
    <el-form-item label="文章分类">
      <el-select
        v-model="formInline.type"
        placeholder="请选择文章分类"
        clearable
        style="width: 200px"
      >
        <el-option
          v-for="item of categoryList"
          :key="item._id"
          :label="item.title"
          :value="item.type"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>

  <div class="btns" style="margin-bottom: 10px">
    <el-button type="primary" @click="toForm()">新增</el-button>
  </div>

  <el-table :data="articalList" style="width: 100%">
    <el-table-column prop="title" label="文章标题" />
    <el-table-column prop="code" label="文章编码" />
    <el-table-column label="文章分类">
      <template #default="scope">
        {{ getCategoryName(scope.row.category) }}
      </template>
    </el-table-column>
    <el-table-column prop="desc" label="文章简介" />
    <el-table-column label="更新时间">
      <template #default="scope">
        {{ $moment(scope.row.time).format("YYYY:MM:DD HH:mm:ss") }}
      </template>
    </el-table-column>
    <el-table-column prop="action" label="操作" width="180">
      <template #default="scoped">
        <el-button link type="primary" @click="toDetail(scoped.row)">
          详情
        </el-button>
        <el-button link type="primary" @click="toForm(scoped.row)">
          编辑
        </el-button>
        <el-button link @click="showConfirm(scoped.row._id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    :current-page="pageNo"
    :page-size="pageSize"
    :page-sizes="[10, 20, 30, 40]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <el-dialog v-model="dialogVisible" title="提示">
    <span>确认要删除文章吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import {
  articalList as listApi,
  categoryList as categoryApi,
  deleteArtical,
} from "@/api/artical";
import { useRouter } from "vue-router";
const router = useRouter();

const formInline = reactive({
  type: "",
});
const articalList = ref([]);
const categoryList = ref([]);
const dialogVisible = ref(false);
const deleteId = ref("");
let pageSize = ref(10);
let pageNo = ref(1);
let total = ref(0);

const getArticalList = () => {
  listApi({
    category: formInline.type,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
  }).then((res) => {
    articalList.value = res.datas || [];
    pageNo.value = res.pageNo;
    pageSize.value = res.pageSize;
    total.value = res.total;
  });
};
const getCategoryList = () => {
  categoryApi().then((res) => {
    categoryList.value = res;
  });
};
const getCategoryName = (code) => {
  return categoryList.value.find((item) => item.type === code)?.title || "--";
};
const handleSearch = () => {
  getArticalList();
};
const handleReset = () => {
  formInline.type = "";
  handleSearch();
};

const toForm = (row) => {
  router.push({
    path: "/artical/form",
    query: { id: row?._id },
  });
};
const toDetail = (row) => {
  router.push({
    path: "/artical/detail",
    query: { id: row?._id },
  });
};
const showConfirm = (id) => {
  dialogVisible.value = true;
  deleteId.value = id;
};
const handleClose = () => {
  deleteArtical({ id: deleteId.value })
    .then((res) => {
      if (res.success) {
        dialogVisible.value = false;
        ElMessage({
          message: "删除文章成功！",
          type: "success",
        });
        handleSearch();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

getCategoryList();
handleSearch();

const handleSizeChange = (val) => {
  pageSize.value = val;
  pageNo.value = 1;
  handleSearch();
};
const handleCurrentChange = (val) => {
  pageNo.value = val;
  handleSearch();
};
</script>

<style lang="less" scoped>
.el-pagination {
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
