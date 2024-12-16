import { del, get, patch, post } from '../utils/request';

export const getAllJobs = async () => {
  const result = await get('api/list-jobs');
  return result;
};

export const getDetailJob = async (id) => {
  const result = await get(`api/get-job/${id}`);
  return result;
};

export const createJob = async (options) => {
  const result = await post('api/create-job', options);
  return result;
};

export const updateJob = async (options) => {
  const result = await post(`api/update-job`, options);
  return result;
};

export const deleteJob = async (id) => {
  const result = await del(`api/delete-job/${id}`);
  return result;
};
