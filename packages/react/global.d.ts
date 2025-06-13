declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '../../assets/images/*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '@assets/*' {
  const content: string;
  export default content;
}

declare module '@assets/images/*.svg' {
  const content: string;
  export default content;
}

// React Native WebView types
interface ReactNativeWebView {
  postMessage: (message: string) => void;
}

declare global {
  interface Window {
    ReactNativeWebView?: ReactNativeWebView;
  }
}

export { };
