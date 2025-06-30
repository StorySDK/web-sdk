interface GoogleFont {
  kind: string;
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: {
    [key: string]: string;
  };
  category: string;
}

const createLinkElement = () => {
  const headID = document.getElementsByTagName('head')[0];
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.id = 'storySdkGoogleFonts';
  headID.appendChild(link);

  return link;
};

const updateLinkHref = (link: any, fonts: GoogleFont[]) => {
  // Use the same URL building logic as preloadFonts for consistency
  const googleFontsCSSUrl = buildGoogleFontsCSSUrl(fonts);
  link.href = googleFontsCSSUrl;
};

export const loadFontsToPage = (fonts: GoogleFont[]) => {
  if (!fonts || !Array.isArray(fonts) || fonts.length === 0) {
    console.warn('StorySDK: loadFontsToPage received invalid or empty fonts array');
    return;
  }

  // Filter out invalid fonts
  const validFonts = fonts.filter((font) => {
    if (!font || !font.family || typeof font.family !== 'string') {
      console.warn('StorySDK: Skipping invalid font in loadFontsToPage:', font);
      return false;
    }
    return true;
  });

  if (validFonts.length === 0) {
    console.warn('StorySDK: No valid fonts found in loadFontsToPage');
    return;
  }

  const googleFontsLink = document.getElementById('storySdkGoogleFonts');

  if (googleFontsLink) {
    updateLinkHref(googleFontsLink, validFonts);
    return;
  }

  updateLinkHref(createLinkElement(), validFonts);
};

const buildGoogleFontsCSSUrl = (fonts: GoogleFont[]): string => {
  const fontsQuery = fonts
    .map((font) => `family=${encodeURIComponent(font.family)}:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700`)
    .join('&');

  return `https://fonts.googleapis.com/css2?${fontsQuery}&display=swap`;
};

export const preloadFonts = (fonts: any[]): void => {
  if (!fonts || !Array.isArray(fonts)) {
    console.warn('StorySDK: preloadFonts received invalid fonts array');
    return;
  }

  // Filter and validate Google Fonts
  const validGoogleFonts: GoogleFont[] = fonts.filter((font) => {
    if (!font || !font.family || typeof font.family !== 'string') {
      // If font has a direct URL, it's a custom font - handle separately
      if (font && font.url && typeof font.url === 'string' && font.url.trim() !== '') {
        // Create preload link for custom font
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = font.url;
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
      return false;
    }
    return true;
  });

  if (validGoogleFonts.length === 0) {
    // No Google Fonts to preload
    return;
  }

  // Check if we already have a preload link for Google Fonts CSS
  const existingPreload = document.querySelector('link[rel="preload"][href*="fonts.googleapis.com/css2"]');
  if (existingPreload) {
    // Already preloaded, avoid duplication
    return;
  }

  // Preload the Google Fonts CSS file instead of individual font files
  // This matches what loadFontsToPage will actually load
  const googleFontsCSSUrl = buildGoogleFontsCSSUrl(validGoogleFonts);

  const cssLink = document.createElement('link');
  cssLink.rel = 'preload';
  cssLink.href = googleFontsCSSUrl;
  cssLink.as = 'style';
  // Don't set crossOrigin for Google Fonts CSS as it's not needed
  // and can cause credentials mismatch
  document.head.appendChild(cssLink);

  // Also preconnect to Google Fonts domains for faster loading
  const preconnectDomains = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
  preconnectDomains.forEach((domain) => {
    const existingPreconnect = document.querySelector(`link[rel="preconnect"][href="${domain}"]`);
    if (!existingPreconnect) {
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = domain;
      // crossOrigin is not needed for preconnect to Google Fonts domains
      document.head.appendChild(preconnectLink);
    }
  });
};
