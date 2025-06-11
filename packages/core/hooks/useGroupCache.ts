import { useLocalStorage } from './useLocalStorage';

export const useGroupCache = (
  userId: string | null,
  token?: string,
): [(groupId: string) => any, (groupId: string, data: any
) => void] => {
  // Convert userId to a string for safe use as a key
  const safeUserId = userId && typeof userId === 'object' ? 'promise-user-id' : String(userId || 'anonymous');
  const safeToken = token || 'no-token';

  // Use token-specific cache key: storysdk_groups_data_{token}_{userId}
  const cacheKey = `storysdk_groups_data_${safeToken}_${safeUserId}`;

  const [storedValue, setValue] = useLocalStorage<{ [key: string]: any }>(cacheKey, {});

  // SECURITY CHECK: Don't use cache if token is invalid or userId is not provided
  const isValidToken = token && token !== 'no-token' && token.length >= 5;
  const isValidUserId = userId && userId !== 'anonymous' && userId !== 'promise-user-id';

  if (!isValidToken || !isValidUserId) {
    // Return dummy functions that don't use cache
    return [
      () => null, // getData returns null (no cache hit)
      () => { }, // setData does nothing
    ];
  }

  const setData = (groupId: string, data: any) => {
    setValue({
      ...storedValue,
      [groupId]: data,
    });
  };

  const getData = (groupId: string) => storedValue[groupId];

  return [getData, setData];
};
