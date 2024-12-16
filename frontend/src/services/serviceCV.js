import { del, get, patch, post } from '../utils/request';

export const createCV = async (options) => {
  const result = await post('api/submit-profile', options);
  return result;
};

export const getListCV = async (id) => {
  const result = await get(`api/list-users/${id}`);
  return result;
};

export const bookInterview = async (options) => {
  const result = await post(`api/interview`, options);
  return result;
};

export const infoInterview = async (id) => {
  const result = await get(`api/view-interview/${id}`);
  return result;
};

export const acceptInterview = async (id) => {
  const result = await get(`api/accept-interview/${id}`);
  return result;
};

export const rejectInterview = async (id) => {
  const result = await get(`api/reject-interview/${id}`);
  return result;
};

export const getDetailCVForProcess = async (id) => {
  const result = await get(`api/check-spam/${id}`);
  return result;
};

export const unsubmitApply = async (id) => {
  const result = await del(`api/unsubmit-profile/${id}`);
  return result;
};

export const scoreInterview = async (options) => {
  const result = await post(`api/rate-user`, options);
  return result;
};
