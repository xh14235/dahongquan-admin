const defaultMenus = localStorage.getItem("menus")
  ? JSON.parse(localStorage.getItem("menus"))
  : [];

export default {
  namespaced: true,
  state: {
    menus: defaultMenus,
  },
  mutations: {
    SET_MENU(state, data) {
      if (data && data.menus) {
        localStorage.setItem("menus", JSON.stringify(data.menus));
        state.menus = data.menus;
      }
    },
  },
  actions: {},
};
