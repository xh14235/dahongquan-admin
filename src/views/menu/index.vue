<template>
  <div class="sss">
    <div class="btns" style="margin-bottom: 10px">
      <el-button type="primary" @click="toForm()">新增</el-button>
    </div>

    <el-table :data="menus" style="width: 100%">
      <el-table-column label="父级名称">
        <template #default="scope">
          {{ scope.row.parent || "--" }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="菜单名称" />
      <el-table-column prop="order" label="菜单顺序" />
      <el-table-column prop="path" label="菜单路径" />
      <el-table-column label="菜单组件">
        <template #default="scope">
          {{ scope.row.components || "--" }}
        </template>
      </el-table-column>
      <el-table-column label="菜单图标">
        <template #default="scope">
          <i class="iconfont" :class="['x-icon-' + scope.row.icon]"></i>
        </template>
      </el-table-column>
      <el-table-column label="是否需要登录">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.needLogin" />
        </template>
      </el-table-column>
      <el-table-column label="是否缓存菜单">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.isKeep" />
        </template>
      </el-table-column>
      <el-table-column label="在导航显示">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.showInNav" />
        </template>
      </el-table-column>
      <el-table-column label="前端路由">
        <template #default="scope">
          <el-switch disabled v-model="scope.row.isFront" />
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
import { ElMessage } from "element-plus";
import { menuList, deleteMenu } from "@/api/menu.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { useStore } from "vuex";
const store = useStore();

const menus = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const deleteId = ref("");

const getMenuList = () => {
  loading.value = true;
  menuList()
    .then((res) => {
      let list = res.sort((a, b) => {
        if (getOrderNum(a.order, 0) === getOrderNum(b.order, 0)) {
          return getOrderNum(a.order, 1) - getOrderNum(b.order, 1);
        } else {
          return getOrderNum(a.order, 0) - getOrderNum(b.order, 0);
        }
      });
      menus.value = [];
      menus.value.push(...list);
      loading.value = false;
      store.commit({
        type: "menu/SET_MENU",
        menus: res,
      });
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });
};
getMenuList();

const getOrderNum = (str, num) => {
  let order = 0;
  if (str.includes("-")) {
    order = str.split("-")[num];
  } else {
    order = Number(str);
  }
  return order;
};

const showConfirm = (id) => {
  dialogVisible.value = true;
  deleteId.value = id;
};
const handleClose = () => {
  deleteMenu({ id: deleteId.value })
    .then((res) => {
      if (res.success) {
        dialogVisible.value = false;
        ElMessage({
          message: "删除用户成功！",
          type: "success",
        });
        getMenuList();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const toForm = (row) => {
  router.push({
    path: "/menu/form",
    query: { id: row?._id },
  });
};
</script>
