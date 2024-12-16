import { get, post } from '../utils/request';

export const getDashBoard = async () => {
  const result = await get('api/dashboard');
  return result;
};

export const setScorePass = async (options) => {
  const result = await post('api/score',options);
  return result;
};
