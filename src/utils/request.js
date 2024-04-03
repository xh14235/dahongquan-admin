import axios from "axios";
import store from "@/store";
import router from "@/router";
// import { ElMessage } from "element-plus";

const axiosRequest = ({ baseURL, timeout = 10000 }) => {
  const instance = axios.create({
    baseURL,
    timeout,
  });

  instance.interceptors.request.use(
    (config) => {
      if (store.state.user?.token) {
        config.headers.Authorization = "Bearer " + store.state.user.token;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return Promise.resolve(response.data);
    },
    (err) => {
      if (err.response.data.message) {
        ElMessage({
          message: err.response.data.message,
          type: "error",
        });
        if (err.response.data.status === 401) {
          router.push("/user/login");
        }
        return;
      }
      return Promise.reject(err);
    }
  );

  return instance;
};

const request = axiosRequest({
  baseURL: process.env.VUE_APP_BASE_API || "http://127.0.0.1:3000/admin/api",
});

export default request;
