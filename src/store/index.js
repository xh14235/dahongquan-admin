import { createStore } from "vuex";
import user from "./modules/user";
import menu from "./modules/menu";
import icon from "./modules/icon";
import setting from "./modules/setting";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    menu,
    icon,
    setting,
  },
});
