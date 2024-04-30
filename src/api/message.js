import request from "@/utils/request";

const api = {
  messageList: "messageList",
  deleteMessage: "deleteMessage",
  messageInfo: "messageInfo",
};

export const messageList = (data) => {
  return request({
    url: api.messageList,
    method: "POST",
    data,
  });
};

export const deleteMessage = (params) => {
  return request({
    url: api.deleteMessage,
    method: "DELETE",
    params,
  });
};

export const messageInfo = (params) => {
  return request({
    url: api.messageInfo,
    method: "GET",
    params,
  });
};
