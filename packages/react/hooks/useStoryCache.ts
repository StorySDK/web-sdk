import { useLocalStorage } from './useLocalStorage';

export const useStoryCache = (
  userId: string | null
): [(storyId: string) => any, (storyId: string, data: any) => void] => {
  const safeUserId =
    userId && typeof userId === 'object' ? 'promise-user-id' : String(userId || 'anonymous');

  const [storedValue, setValue] = useLocalStorage(`StorySdkStoriesData-${safeUserId}`, {});

  const setData = (storyId: string, data: any) => {
    setValue({
      ...storedValue,
      [storyId]: data
    });
  };

  const getData = (storyId: string) => storedValue[storyId];

  return [getData, setData];
};
