const defaultSetting = localStorage.getItem("baseSetting")
  ? JSON.parse(localStorage.getItem("baseSetting"))
  : {
      bgUrl: "/img/bg.jpg",
      logo: "/img/logo.png",
    };

export default {
  namespaced: true,
  state: {
    setting: defaultSetting,
  },
  mutations: {
    BASE_SETTING(state, data) {
      localStorage.setItem("baseSetting", JSON.stringify(data.setting));
      state.setting = data.setting;
    },
  },
  actions: {},
};
