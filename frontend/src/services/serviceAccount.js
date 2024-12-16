import { get, post } from '../utils/request';

export const createAccount = async (options) => {
  const result = await post(`api/register-user`, options);
  return result;
};

export const login = async (options) => {
  const result = await post(`api/login-user`, options);
  return result;
};

export const createProfileUser = async (options) => {
  const result = await post(`api/create-profile`, options);
  return result;
};
