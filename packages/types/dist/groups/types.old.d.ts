import { WidgetType } from '../widgets/types';
/**
 * Group type
 */
export type GroupType = {
    /** Group ID */
    id: string;
    /** Group name */
    name: string;
    /** Group description */
    description: string;
    /** Widgets in group */
    widgets: WidgetType[];
    /** X position */
    x: number;
    /** Y position */
    y: number;
    /** Width */
    width: number;
    /** Height */
    height: number;
    /** Rotation angle */
    rotation: number;
    /** Scale */
    scale: number;
    /** Opacity */
    opacity: number;
    /** Visibility */
    visible: boolean;
    /** Lock status */
    locked: boolean;
    /** Editor parameters */
    editor?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        rotation?: number;
        scale?: number;
        opacity?: number;
        visible?: boolean;
        locked?: boolean;
    };
};
/**
 * Groups list properties
 */
export type GroupsListProps = {
    /** Groups */
    groups: GroupType[];
    /** Groups change handler */
    onChange: (groups: GroupType[]) => void;
    /** Group selection handler */
    onSelect: (group: GroupType) => void;
    /** Selected group */
    selectedGroup?: GroupType;
    /** Editing mode */
    isEditing?: boolean;
    /** Editor parameters */
    editor?: {
        onChange?: (groups: GroupType[]) => void;
        onSelect?: (group: GroupType) => void;
        selectedGroup?: GroupType;
        isEditing?: boolean;
    };
};
