export const getNavigatorLanguage = (appLocale: any) => {
  const language =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : // @ts-ignore
        navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';

  const langArr = language.split('-');

  if (!appLocale.languages.find((item: string) => item === langArr[0])) {
    return appLocale.default;
  }

  return langArr[0];
};
