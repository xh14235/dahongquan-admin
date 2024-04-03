import request from "@/utils/request";

const api = {
  editSetting: "editSetting",
  baseSetting: "baseSetting",
  addBanner: "addBanner",
  bannerList: "bannerList",
  deleteBanner: "deleteBanner",
  bannerInfo: "bannerInfo",
  editBanner: "editBanner",
};

export const baseSetting = (params) => {
  return request({
    url: api.baseSetting,
    method: "GET",
    params,
  });
};

export const editSetting = (data) => {
  return request({
    url: api.editSetting,
    method: "POST",
    data,
  });
};

export const bannerList = (params) => {
  return request({
    url: api.bannerList,
    method: "GET",
    params,
  });
};

export const addBanner = (data) => {
  return request({
    url: api.addBanner,
    method: "POST",
    data,
  });
};

export const deleteBanner = (params) => {
  return request({
    url: api.deleteBanner,
    method: "DELETE",
    params,
  });
};

export const editBanner = (data) => {
  return request({
    url: api.editBanner,
    method: "PUT",
    data,
  });
};

export const bannerInfo = (params) => {
  return request({
    url: api.bannerInfo,
    method: "GET",
    params,
  });
};
