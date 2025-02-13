import ReactGA from 'react-ga4';

export const initGA = (GA_MEASUREMENT_ID?: string) => {
  if (!GA_MEASUREMENT_ID) return;

  const isCordovaApp = !!window?.cordova;
  ReactGA.initialize(GA_MEASUREMENT_ID, {
    gaOptions: isCordovaApp ? { cookieDomain: 'none', cookieFlags: 'SameSite=None;Secure' } : {}
  });
  ReactGA.send('pageview');
};
