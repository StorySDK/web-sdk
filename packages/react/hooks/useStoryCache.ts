import { useLocalStorage } from './useLocalStorage';

interface StoryCache {
  [key: string]: any;
}

export const useStoryCache = (
  userId: string | null,
  token?: string,
): [(storyId: string) => any, (storyId: string, data: any
) => void] => {
  const safeUserId = userId && typeof userId === 'object' ? 'promise-user-id' : String(userId || 'anonymous');
  const safeToken = token || 'no-token';

  const [storedValue, setValue] = useLocalStorage<StoryCache>(`storysdk_stories_data_${safeToken}_${safeUserId}`, {});

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

  const setData = (storyId: string, data: any) => {
    setValue({
      ...storedValue,
      [storyId]: data,
    });
  };

  const getData = (storyId: string) => storedValue[storyId];

  return [getData, setData];
};
