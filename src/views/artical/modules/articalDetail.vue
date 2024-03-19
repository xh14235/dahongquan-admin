<template>
  <div v-loading="loading">
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">
          {{ detail.title || "--" }}
        </span>
      </template>
    </el-page-header>
    <div class="artical-wrap" v-if="detail.title">
      <div class="artical-category">
        {{ "文章分类：" + getCategoryName(detail.category) }}
      </div>
      <div class="artical-desc">{{ "文章简介：" + detail.desc }}</div>
      <div class="artical-content" v-html="detail.content"></div>
    </div>
    <el-empty v-else description="暂无内容" />
  </div>
</template>

<script setup>
import { articalInfo, categoryList as categoryApi } from "@/api/artical.js";
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
const router = useRouter();
let loading = ref(false);
const editId = ref("");
const detail = reactive({
  title: "",
  type: "",
  components: "",
});

const categoryList = ref([]);
const getCategoryList = () => {
  categoryApi().then((res) => {
    categoryList.value = res;
  });
};

const getDetails = () => {
  articalInfo({ id: editId.value })
    .then((res) => {
      detail.title = res.title;
      detail.category = res.category;
      detail.desc = res.desc;
      detail.content = res.content;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getCategoryName = (code) => {
  return categoryList.value.find((item) => item.type === code)?.title || "--";
};

const goBack = () => {
  router.back();
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
