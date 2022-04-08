import '@storysdk/react/dist/bundle.css';
export declare class Story {
    token: string;
    groupClassName?: string;
    groupsClassName?: string;
    constructor(token: string, groupClassName?: string, groupsClassName?: string);
    renderGroups(element?: Element | HTMLDivElement | null): void;
}
