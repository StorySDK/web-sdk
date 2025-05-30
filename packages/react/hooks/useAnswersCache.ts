import { useLocalStorage } from './useLocalStorage';

export const useAnswersCache = (
  userId: string | null,
  token?: string,
): [(widgetId: string) => any, (widgetId: string, answer: string | number
) => void] => {
  const safeUserId = userId && typeof userId === 'object' ? 'promise-user-id' : String(userId || 'anonymous');
  const safeToken = token || 'no-token';

  const [storedValue, setValue] = useLocalStorage<Record<string, any>>(`storysdk_answers_${safeToken}_${safeUserId}`, {});

  // SECURITY CHECK: Don't use cache if token is invalid or userId is not provided
  const isValidToken = token && token !== 'no-token' && token.length >= 5;
  const isValidUserId = userId && userId !== 'anonymous' && userId !== 'promise-user-id';

  if (!isValidToken || !isValidUserId) {
    // Return dummy functions that don't use cache
    return [
      () => null, // getAnswer returns null (no cache hit)
      () => { }, // setAnswer does nothing
    ];
  }

  const setAnswer = (widgetId: string, answer: string | number) => {
    setValue({
      ...storedValue,
      [widgetId]: answer,
    });
  };

  const getAnswer = (widgetId: string) => storedValue[widgetId];

  return [getAnswer, setAnswer];
};
