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
export declare const loadFontsToPage: (fonts: GoogleFont[]) => void;
export {};
