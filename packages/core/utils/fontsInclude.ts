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
  const fontsLink = fonts
    .map((font, index) => {
      let string = '';

      string += `${font.family}:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700`;

      if (index !== fonts.length - 1) {
        string += '&family=';
      }

      return string;
    })
    .join('');

  const updateLink = `https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=${fontsLink}`;

  link.href = updateLink;
};

export const loadFontsToPage = (fonts: GoogleFont[]) => {
  const googleFontsLink = document.getElementById('storySdkGoogleFonts');

  if (googleFontsLink) {
    updateLinkHref(googleFontsLink, fonts);
    return;
  }

  updateLinkHref(createLinkElement(), fonts);
};

export const preloadFonts = (fonts: any[]): void => {
  fonts.forEach((font) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font.url;
    link.as = 'font';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};
