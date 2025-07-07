import React from 'react';
export declare const isReactDomClientAvailable: () => Promise<boolean>;
export declare const renderElement: (element: React.ReactElement, container: Element) => Promise<any>;
export declare const isReact18Plus: () => boolean;
export declare const unmountComponent: (container?: Element | null, root?: any) => Promise<void>;
