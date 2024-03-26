import { createApp, createVNode } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/style/tailwind.css";
import "@/assets/style/preflight.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { resizeWindow } from "@/utils/window";
import moment from "moment";

const app = createApp(App);

app.config.globalProperties.$moment = moment;

app.use(ElementPlus);
app.use(store).use(router);

// 初始化方法
const init = () => {
  // 如果登陆了，请求菜单
};

init();

app.mount("#app");
// 先登录

// 使用iconfont.cn图标，elementplus图标暂时不用
// // 引入element图标
// import * as Icons from "@element-plus/icons-vue";
// // 全局注册
// Object.keys(Icons).forEach((key) => {
//   app.component(key, Icons[key]);
// });
// // Icon自定组件
// const Icon = (props) => {
//   const { icon } = props;
//   return createVNode(Icons[icon]);
// };
// app.component("Icon", Icon);

// resizeWindow();
