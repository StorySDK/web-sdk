export const getUniqUserId = (): string => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return '';

  let userId = localStorage.getItem('uniq_user_id');

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('uniq_user_id', userId);
  }

  return userId;
};
