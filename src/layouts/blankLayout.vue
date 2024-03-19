<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="keepAlive.value" />
    </keep-alive>
    <component :is="Component" v-if="!keepAlive.value" />
  </router-view>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
let keepAlive = ref(false);

const router = useRouter();
watch(
  () => router,
  (newVal) => {
    keepAlive = newVal.currentRoute.value.meta.keepAlive || false;
  },
  { immediate: true }
);
</script>

<style scoped></style>
