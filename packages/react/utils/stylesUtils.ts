import hexToRgba from 'hex-to-rgba';
import parseColor from 'parse-color';
import { WidgetPositionType, WidgetPositionLimitsType, BackgroundType, BorderType } from '../types';

interface Stroke {
  strokeThickness: number;
  strokeColor: BorderType;
  strokeOpacity: number;
  fillBorderRadius?: number;
}

export const renderColor = (color: string, opacity?: number) => {
  if (color.includes('#') && opacity) {
    color = hexToRgba(color, opacity / 100);
  }

  return color;
};

export const renderGradient = (colors: string[], opacity?: number) => {
  const first = renderColor(colors[0], opacity);
  const second = renderColor(colors[1], opacity);

  return `linear-gradient(180deg, ${first} 0%, ${second} 100%)`;
};

export const renderBackgroundStyles = (background: BackgroundType, opacity?: number): string => {
  let color = background.value;

  switch (background.type) {
    case 'color':
      if (color.includes('#') && opacity !== undefined) {
        color = hexToRgba(background.value, opacity / 100);
      } else if (opacity !== undefined) {
        const parsed = parseColor(background.value);
        return `rgba(${parsed.rgb[0]}, ${parsed.rgb[1]}, ${parsed.rgb[2]}, ${opacity / 100})`;
      }
      return color as string;
    case 'gradient':
      return `linear-gradient(180deg, ${background.value[0]} 0%, ${background.value[1]} 100%)`;
    case 'image':
      return `center / cover url("${background.value}")`;
    default:
      return 'transparent';
  }
};

export const renderBorderStyles = ({
  strokeThickness,
  strokeColor,
  strokeOpacity,
  fillBorderRadius
}: Stroke): any => {
  switch (strokeColor.type) {
    case 'color':
      return {
        border: `${strokeThickness}px solid ${renderColor(strokeColor.value, strokeOpacity)}`
      };
    case 'gradient':
      return {
        border: `${strokeThickness}px solid`,
        borderImageSlice: `1`,
        borderImageSource: renderGradient(strokeColor.value, strokeOpacity),
        borderRadius: `${fillBorderRadius}px`
      };
    default:
      return {
        background: 'transparent'
      };
  }
};

export const renderTextBackgroundStyles = ({
  color,
  opacity
}: {
  color: BorderType;
  opacity?: number;
}): React.CSSProperties => {
  switch (color.type) {
    case 'color':
      return {
        color: color.value
      };
    case 'gradient':
      return {
        background: renderGradient(color.value, opacity)
      };
    default:
      return {
        background: 'transparent'
      };
  }
};

export const renderPosition = (
  position: WidgetPositionType,
  positionLimits: WidgetPositionLimitsType,
  zIndex: number
) => ({
  left: `${position.x}px`,
  top: `${position.y}px`,
  width: positionLimits.isAutoWidth ? 'auto' : `${position.width}px`,
  height: positionLimits.isAutoHeight ? 'auto' : `${position.height}px`,
  zIndex,
  transform: `rotate(${position.rotate}deg)`
});

export const calculateElementSize = (
  position: WidgetPositionType,
  positionLimits: WidgetPositionLimitsType,
  elementSize: number
) =>
  positionLimits.minWidth
    ? Math.round((elementSize * +position.width) / positionLimits?.minWidth)
    : elementSize;

export const calculateElementSizeByHeight = (
  position: WidgetPositionType,
  positionLimits: WidgetPositionLimitsType,
  elementSize: number
) =>
  positionLimits.minHeight
    ? Math.round((elementSize * position.height) / positionLimits?.minHeight)
    : elementSize;
