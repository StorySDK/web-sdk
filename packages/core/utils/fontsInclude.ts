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
  link.href = `https://fonts.googleapis.com/css2?family=${fonts
    .map((font) => font.family.split(' ').join('+'))
    .join('&family=')}`;
};

export const loadFontsToPage = (fonts: GoogleFont[]) => {
  const googleFontsLink = document.getElementById('storySdkGoogleFonts');

  if (googleFontsLink) {
    updateLinkHref(googleFontsLink, fonts);
    return;
  }

  updateLinkHref(createLinkElement(), fonts);
};
