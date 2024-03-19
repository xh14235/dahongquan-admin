const defaultIcons = localStorage.getItem("icons")
  ? JSON.parse(localStorage.getItem("icons"))
  : [];

export default {
  namespaced: true,
  state: {
    icons: defaultIcons,
  },
  mutations: {
    SET_ICONS(state, data) {
      if (data && data.icons) {
        localStorage.setItem("icons", JSON.stringify(data.icons));
        state.icons = data.icons;
      }
    },
  },
  actions: {},
};
