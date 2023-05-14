import { useLocalStorage } from './useLocalStorage';

export const useGroupCache = (
  userId: string | null
): [(groupId: string) => any, (groupId: string, data: any) => void] => {
  const [storedValue, setValue] = useLocalStorage(`StorySdkGroupsData-${userId}`, {});

  const setData = (groupId: string, data: any) => {
    setValue({
      ...storedValue,
      [groupId]: data
    });
  };

  const getData = (groupId: string) => storedValue[groupId];

  return [getData, setData];
};
