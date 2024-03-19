const defaultToken = localStorage.getItem("token") || "";
const defaultUserInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

export default {
  namespaced: true,
  state: {
    token: defaultToken,
    userInfo: defaultUserInfo,
  },
  mutations: {
    SET_INFO(state, data) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      state.token = data.token;
      state.userInfo = data.userInfo;
    },
  },
  actions: {},
};
