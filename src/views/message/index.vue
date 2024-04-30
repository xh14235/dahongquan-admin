<template>
  <el-form inline :model="formInline">
    <el-form-item label="关键词">
      <el-input v-model="formInline.keyword" placeholder="请输入关键词" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="messageList" style="width: 100%">
    <el-table-column prop="name" label="姓名" />
    <el-table-column label="单位">
      <template #default="scope">
        {{ scope.row.unit || "--" }}
      </template>
    </el-table-column>
    <el-table-column prop="tel" label="电话" />
    <el-table-column prop="content" label="留言" />
    <el-table-column label="时间">
      <template #default="scope">
        {{ $moment(scope.row.time).format("YYYY:MM:DD HH:mm:ss") }}
      </template>
    </el-table-column>
    <el-table-column prop="action" label="操作" width="100">
      <template #default="scoped">
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
    <span>确认要删除留言吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
// import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { messageList as listApi, deleteMessage } from "@/api/message";

const formInline = reactive({
  keyword: "",
});
const messageList = ref([]);
const deleteId = ref("");
let pageSize = ref(10);
let pageNo = ref(1);
let total = ref(0);
const dialogVisible = ref(false);

const getMessageList = () => {
  listApi({
    keyword: formInline.keyword,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
  }).then((res) => {
    messageList.value = res.datas || [];
    pageNo.value = res.pageNo;
    pageSize.value = res.pageSize;
    total.value = res.total;
  });
};
const handleSearch = () => {
  getMessageList();
};
const handleReset = () => {
  formInline.keyword = "";
  handleSearch();
};

const showConfirm = (id) => {
  dialogVisible.value = true;
  deleteId.value = id;
};
const handleClose = () => {
  deleteMessage({ id: deleteId.value })
    .then((res) => {
      if (res.success) {
        dialogVisible.value = false;
        ElMessage({
          message: "删除留言成功！",
          type: "success",
        });
        handleSearch();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

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
.banner-img {
  height: 60px;
}
</style>
