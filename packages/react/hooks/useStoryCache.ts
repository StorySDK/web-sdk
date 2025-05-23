import { useLocalStorage } from './useLocalStorage';

interface StoryCache {
  [key: string]: any;
}

export const useStoryCache = (
  userId: string | null,
): [(storyId: string) => any, (storyId: string, data: any
) => void] => {
  const safeUserId = userId && typeof userId === 'object' ? 'promise-user-id' : String(userId || 'anonymous');

  const [storedValue, setValue] = useLocalStorage<StoryCache>(`StorySdkStoriesData-${safeUserId}`, {});

  const setData = (storyId: string, data: any) => {
    setValue({
      ...storedValue,
      [storyId]: data,
    });
  };

  const getData = (storyId: string) => storedValue[storyId];

  return [getData, setData];
};
