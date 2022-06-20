import '@storysdk/react/dist/bundle.css';
export declare class Story {
    token: string;
    groupImageWidth?: number;
    groupImageHeight?: number;
    groupTitleSize?: number;
    groupClassName?: string;
    groupsClassName?: string;
    constructor(token: string, groupImageWidth?: number, groupImageHeight?: number, groupTitleSize?: number, groupClassName?: string, groupsClassName?: string);
    renderGroups(element?: Element | HTMLDivElement | null): void;
}
