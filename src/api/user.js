import request from "@/utils/request";

const api = {
  addUser: "addUser",
  userList: "userList",
  userInfo: "userInfo",
  editUser: "editUser",
  deleteUser: "deleteUser",
  login: "login",
};

export const userList = (params) => {
  return request({
    url: api.userList,
    method: "GET",
    params,
  });
};

export const addUser = (data) => {
  return request({
    url: api.addUser,
    method: "POST",
    data,
  });
};

export const editUser = (data) => {
  return request({
    url: api.editUser,
    method: "PUT",
    data,
  });
};

export const deleteUser = (params) => {
  return request({
    url: api.deleteUser,
    method: "DELETE",
    params,
  });
};

export const userInfo = (params) => {
  return request({
    url: api.userInfo,
    method: "GET",
    params,
  });
};

export const login = (data) => {
  return request({
    url: api.login,
    method: "POST",
    data,
  });
};
