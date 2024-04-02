<template>
  <el-form
    ref="baseForm"
    :model="form"
    :rules="rules"
    status-icon
    label-width="auto"
  >
    <el-form-item label="父级菜单" prop="parent">
      <el-select v-model="form.parent" clearable placeholder="请选择父级菜单">
        <el-option
          v-for="item in parentList"
          :key="item._id"
          :label="item.title"
          :value="item._id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="菜单名称" prop="title">
      <el-input v-model="form.title" placeholder="请输入菜单名称" />
    </el-form-item>
    <el-form-item label="菜单顺序" prop="order">
      <el-input v-model="form.order" placeholder="请输入菜单顺序" />
    </el-form-item>
    <el-form-item label="菜单路径" prop="path">
      <el-input v-model="form.path" placeholder="请输入菜单路径" />
    </el-form-item>
    <el-form-item label="菜单组件" prop="components">
      <el-input
        :disabled="form.parent ? false : true"
        v-model="form.components"
        placeholder="请输入菜单组件"
      />
    </el-form-item>
    <el-form-item label="菜单图标" prop="icon">
      <el-popover placement="bottom-start" :width="'35%'" trigger="hover">
        <template #reference>
          <el-input readonly v-model="form.icon" placeholder="请选择菜单图标" />
        </template>
        <div class="icons-box">
          <i
            class="iconfont"
            :class="['x-icon-' + item, item === form.icon ? 'active' : null]"
            v-for="item of iconsList"
            :key="item"
            @click="chooseIcon(item)"
          ></i>
        </div>
      </el-popover>
    </el-form-item>
    <el-form-item label="是否需要登录" prop="needLogin">
      <el-switch v-model="form.needLogin" />
    </el-form-item>
    <el-form-item label="缓存菜单" prop="isKeep">
      <el-switch v-model="form.isKeep" />
    </el-form-item>
    <el-form-item label="在导航显示" prop="showInNav">
      <el-switch v-model="form.showInNav" />
    </el-form-item>
    <el-form-item label="前端路由" prop="isFront">
      <el-switch v-model="form.isFront" />
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
import { addMenu, parentMenuList, menuInfo, editMenu } from "@/api/menu.js";
import store from "@/store";
const route = useRoute();
const router = useRouter();
const baseForm = ref(null);
let loading = ref(false);
const editId = ref("");

const form = reactive({
  parent: "",
  title: "",
  order: "0",
  path: "",
  components: "",
  icon: "setting",
  needLogin: true,
  isKeep: false,
  showInNav: true,
  isFront: false,
});
const rules = computed(() => {
  return {
    title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    order: [{ required: true, message: "请输入菜单顺序", trigger: "blur" }],
    path: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
    // components: form.parent
    //   ? [{ required: true, message: "请输入菜单组件", trigger: "blur" }]
    //   : [],
    icon: [{ required: true, message: "请选择菜单图标", trigger: "blur" }],
  };
});

const iconsList = store.state.icon?.icons || [];

const parentList = ref([]);
const getParentList = () => {
  parentMenuList().then((res) => {
    parentList.value = [];
    parentList.value.push(...res);
  });
};

// const parentOrder = ref(null);
// const changeParent = (value) => {
//   parentList.value.forEach((item) => {
//     if (item._id === value) {
//       parentOrder.value = item.order;
//     }
//   });
// };

const handleSubmit = () => {
  baseForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const method = editId.value ? editMenu : addMenu;
      let order;
      if (form.parent) {
        parentList.value.forEach((item) => {
          if (item._id === form.parent) {
            order = String(item.order) + "-" + String(form.order);
          }
        });
      } else {
        order = String(form.order);
      }
      const params = {
        ...form,
        parent:
          parentList.value.find((item) => item._id === form.parent)?.title ||
          "",
        _id: editId.value || undefined,
        order,
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
  menuInfo({ id: editId.value })
    .then((res) => {
      form.parent =
        parentList.value.find((item) => item.title === res.parent)?._id ||
        undefined;
      form.title = res.title;
      form.path = res.path;
      // form.order = res.order;
      form.components = res.components;
      form.icon = res.icon;
      form.needLogin = res.needLogin;
      form.isKeep = res.isKeep;
      form.showInNav = res.showInNav;
      form.isFront = res.isFront;
      form.order = form.parent ? res.order.split("-")[1] : res.order;
    })
    .catch((err) => {
      console.log(err);
    });
};

const chooseIcon = (icon) => {
  form.icon = icon;
};

onMounted(() => {
  getParentList();
  const { id } = route.query;
  if (id) {
    editId.value = id;
    getDetails();
  }
});
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
