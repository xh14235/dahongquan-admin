import request from "@/utils/request";

const api = {
  addCategory: "addCategory",
  categoryList: "categoryList",
  categoryInfo: "categoryInfo",
  editCategory: "editCategory",
  deleteCategory: "deleteCategory",
  articalList: "articalList",
  addArtical: "addArtical",
  articalInfo: "articalInfo",
  editArtical: "editArtical",
  deleteArtical: "deleteArtical",
};

export const categoryList = (params) => {
  return request({
    url: api.categoryList,
    method: "GET",
    params,
  });
};

export const addCategory = (data) => {
  return request({
    url: api.addCategory,
    method: "POST",
    data,
  });
};

export const editCategory = (data) => {
  return request({
    url: api.editCategory,
    method: "PUT",
    data,
  });
};

export const deleteCategory = (params) => {
  return request({
    url: api.deleteCategory,
    method: "DELETE",
    params,
  });
};

export const categoryInfo = (params) => {
  return request({
    url: api.categoryInfo,
    method: "GET",
    params,
  });
};

export const articalList = (data) => {
  return request({
    url: api.articalList,
    method: "POST",
    data,
  });
};

export const addArtical = (data) => {
  return request({
    url: api.addArtical,
    method: "POST",
    data,
  });
};

export const editArtical = (data) => {
  return request({
    url: api.editArtical,
    method: "PUT",
    data,
  });
};

export const deleteArtical = (params) => {
  return request({
    url: api.deleteArtical,
    method: "DELETE",
    params,
  });
};

export const articalInfo = (params) => {
  return request({
    url: api.articalInfo,
    method: "GET",
    params,
  });
};
