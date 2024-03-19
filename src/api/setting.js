import request from "@/utils/request";

const api = {
  editSetting: "editSetting",
  baseSetting: "baseSetting",
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
