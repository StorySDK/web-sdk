/**
 * Type for Material Design icons
 */
export type MaterialIconValueType = string;

/**
 * Type for background
 */
export type BackgroundType = string;

/**
 * Type for borders
 */
export type BorderType = string;

/**
 * Type for colors
 */
export type ColorValue = string;

/**
 * Font parameters
 */
export type FontParamsType = {
  /** Font weight */
  fontWeight: number;
  /** Font style */
  fontStyle: string;
  /** Text decoration */
  textDecoration: string;
};

/**
 * Video metadata
 */
export type VideoMetadataType = {
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