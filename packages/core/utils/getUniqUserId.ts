import { nanoid } from 'nanoid';

export const getUniqUserId = () => {
  if (localStorage.getItem('StorySdkUserId')) {
    return localStorage.getItem('StorySdkUserId');
  }
  const id = nanoid();
  localStorage.setItem('StorySdkUserId', id);

  return id;
};
