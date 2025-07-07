/**
 * Type for Material Design icons
 */
export type MaterialIconValueType = {
    name: string;
};
export type MaterialIconChangeType = (params: {
    name: string;
}) => void;
/**
 * Type for background (simple version)
 */
export type SimpleBackgroundType = string;
/**
 * Type for borders (simple version)
 */
export type SimpleBorderType = string;
/**
 * Type for colors (simple version)
 */
export type SimpleColorValue = string;
/**
 * Font parameters (simple version)
 */
export type SimpleFontParamsType = {
    /** Font weight */
    fontWeight: number;
    /** Font style */
    fontStyle: string;
    /** Text decoration */
    textDecoration: string;
};
/**
 * Video metadata (simple version)
 */
export type SimpleVideoMetadataType = {
    /** Duration in seconds */
    duration: number;
    /** Width in pixels */
    width: number;
    /** Height in pixels */
    height: number;
};
/**
 * Quiz answer score parameters
 */
export type QuizAnswersScoreParams = {
    /** Answer letter */
    letter: string;
    /** Points amount */
    points: number;
};
/**
 * Type for emoji
 */
export type EmojiItemType = {
    /** Emoji name */
    name: string;
    /** Unicode representation */
    unicode: string;
};
