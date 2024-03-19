import request from "@/utils/request";

const api = {
  addMenu: "addMenu",
  menuList: "menuList",
  parentMenuList: "parentMenuList",
  menuInfo: "menuInfo",
  editMenu: "editMenu",
  deleteMenu: "deleteMenu",
};

export const menuList = (params) => {
  return request({
    url: api.menuList,
    method: "GET",
    params,
  });
};

export const parentMenuList = (params) => {
  return request({
    url: api.parentMenuList,
    method: "GET",
    params,
  });
};

export const addMenu = (data) => {
  return request({
    url: api.addMenu,
    method: "POST",
    data,
  });
};

export const editMenu = (data) => {
  return request({
    url: api.editMenu,
    method: "PUT",
    data,
  });
};

export const deleteMenu = (params) => {
  return request({
    url: api.deleteMenu,
    method: "DELETE",
    params,
  });
};

export const menuInfo = (params) => {
  return request({
    url: api.menuInfo,
    method: "GET",
    params,
  });
};
