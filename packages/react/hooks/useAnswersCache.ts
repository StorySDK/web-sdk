import { useLocalStorage } from './useLocalStorage';

export const useAnswersCache = (
  userId: string | null
): [(widgetId: string) => any, (widgetId: string, answer: string | number) => void] => {
  const [storedValue, setValue] = useLocalStorage(`StorySdkAnswers-${userId}`, {});

  const setAnswer = (widgetId: string, answer: string | number) => {
    setValue({
      ...storedValue,
      [widgetId]: answer
    });
  };

  const getAnswer = (widgetId: string) => storedValue[widgetId];

  return [getAnswer, setAnswer];
};
