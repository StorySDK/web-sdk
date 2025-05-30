import { useLocalStorage } from './useLocalStorage';

export const useGroupCache = (
  userId: string | null,
  token?: string,
): [(groupId: string) => any, (groupId: string, data: any
) => void] => {
  const safeUserId = userId && typeof userId === 'object' ? 'promise-user-id' : String(userId || 'anonymous');
  const safeToken = token || 'no-token';

  const [storedValue, setValue] = useLocalStorage(`storysdk_groups_data_${safeToken}_${safeUserId}`, {});

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

  const getData = (groupId: string): any => storedValue[groupId as keyof typeof storedValue];

  return [getData, setData];
};
