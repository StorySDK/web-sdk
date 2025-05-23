import { useLocalStorage } from './useLocalStorage';

export const useGroupCache = (
  userId: string | null,
): [(groupId: string) => any, (groupId: string, data: any
) => void] => {
  // Convert userId to a string for safe use as a key
  const safeUserId = userId && typeof userId === 'object' ? 'promise-user-id' : String(userId || 'anonymous');

  const [storedValue, setValue] = useLocalStorage<Record<string, any>>(`storysdk_groups_data_${safeUserId}`, {});

  const setData = (groupId: string, data: any) => {
    setValue({
      ...storedValue,
      [groupId]: data,
    });
  };

  const getData = (groupId: string) => storedValue[groupId];

  return [getData, setData];
};
