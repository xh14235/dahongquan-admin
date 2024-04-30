import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import BlankLayout from "@/layouts/blankLayout.vue";
import DefaultLayout from "@/layouts/defaultLayout.vue";
import Home from "@/views/home/index.vue";
import UserList from "@/views/user/index.vue";
import UserForm from "@/views/user/modules/form.vue";
import MenuList from "@/views/menu/index.vue";
import MenuForm from "@/views/menu/modules/form.vue";
import ArticalCategory from "@/views/artical/category.vue";
import ArticalCategoryForm from "@/views/artical/modules/categoryForm.vue";
import ArticalList from "@/views/artical/list.vue";
import ArticalForm from "@/views/artical/modules/articalForm.vue";
import ArticalDetail from "@/views/artical/modules/articalDetail.vue";
import BaseSetting from "@/views/setting/index.vue";
import Banner from "@/views/setting/banner.vue";
import BannerForm from "@/views/setting/modules/bannerForm.vue";
import MessageList from "@/views/message/index.vue";

const baseRoutes = [
  {
    path: "/user",
    redirect: "/user/login",
    component: BlankLayout,
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "login" */ "@/views/user/login.vue"),
        meta: {
          title: "登录",
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/404",
    component: () =>
      import(/* webpackChunkName: "fail" */ "@/views/exception/404"),
  },
];
const routeList = [
  {
    path: "/",
    redirect: "/artical/list",
    component: DefaultLayout,
    children: [
      {
        path: "/home",
        component: Home,
        meta: {
          title: "首页",
          needLogin: true,
        },
      },
      {
        path: "/user/list",
        component: UserList,
        meta: {
          title: "用户列表",
          needLogin: true,
        },
      },
      {
        path: "/user/form",
        component: UserForm,
        meta: {
          title: "编辑用户",
          needLogin: true,
        },
      },
      {
        path: "/menu/list",
        component: MenuList,
        meta: {
          title: "菜单分类",
          needLogin: true,
        },
      },
      {
        path: "/menu/form",
        component: MenuForm,
        meta: {
          title: "编辑菜单",
          needLogin: true,
        },
      },
      {
        path: "/artical/category",
        component: ArticalCategory,
        meta: {
          title: "文章分类",
          needLogin: true,
        },
      },
      {
        path: "/artical/category/form",
        component: ArticalCategoryForm,
        meta: {
          title: "编辑文章分类",
          needLogin: true,
        },
      },
      {
        path: "/artical/list",
        component: ArticalList,
        meta: {
          title: "文章列表",
          needLogin: true,
        },
      },
      {
        path: "/artical/form",
        component: ArticalForm,
        meta: {
          title: "编辑文章",
          needLogin: true,
        },
      },
      {
        path: "/artical/detail",
        component: ArticalDetail,
        meta: {
          title: "文章详情",
          needLogin: true,
        },
      },
      {
        path: "/setting/base",
        component: BaseSetting,
        meta: {
          title: "菜单分类",
          needLogin: true,
        },
      },
      {
        path: "/banner",
        component: Banner,
        meta: {
          title: "banner图",
          needLogin: true,
        },
      },
      {
        path: "/banner/form",
        component: BannerForm,
        meta: {
          title: "编辑banner图",
          needLogin: true,
        },
      },
      {
        path: "/message/list",
        component: MessageList,
        meta: {
          title: "留言列表",
          needLogin: true,
        },
      },
    ],
  },
];

const routes = [...baseRoutes, ...routeList];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  if (to.meta.needLogin) {
    const token = store.state.user.token;
    if (token) {
      next();
    } else {
      next({
        path: "/user/login",
      });
    }
  } else {
    next();
  }
});

export default router;
