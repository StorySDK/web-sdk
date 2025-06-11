# @storysdk/types

TypeScript definitions and interfaces for StorySDK. This package provides shared type definitions used across all StorySDK packages, ensuring type safety and consistency.

## Installation

```bash
npm install @storysdk/types
```

## Overview

This package contains TypeScript definitions for:
- **Common data structures** (colors, fonts, backgrounds, etc.)
- **Widget type definitions** (text, image, video, quiz widgets, etc.)
- **Story and group structures**
- **UI element types** (buttons, icons, animations)

## Package Structure

```
src/
├── common/           # Common data types and utilities
├── widgets/          # Widget-specific type definitions
├── groups/           # Group and story structure types
├── WidgetType.ts     # Core widget type definitions
├── GroupType.ts      # Core group type definitions
├── StoryContext.ts   # Story context and state types
└── index.ts          # Main exports
```

## Basic Usage

```typescript
import { 
  GroupType, 
  WidgetType, 
  MaterialIconValueType,
  BackgroundType,
  ColorValue
} from '@storysdk/types';

// Define a custom group
const myGroup: GroupType = {
  id: 'custom-group',
  name: 'My Custom Group',
  // ... other properties
};

// Type-safe widget configuration
const textWidget: TextWidgetParamsType = {
  text: 'Hello World',
  fontParams: {
    fontSize: 16,
    fontWeight: 'bold'
  }
};
```

## Type Categories

### Common Types (`common/`)

Core data types used throughout the SDK:

- **`MaterialIconValueType`** - Enumeration of supported Material Design icons
- **`BackgroundType`** - Background configuration (color, gradient, image)
- **`BorderType`** - Border styling properties
- **`ColorValue`** - Color representation (hex, rgba, named colors)
- **`FontParamsType`** - Typography configuration
- **`VideoMetadataType`** - Video file metadata and properties
- **`QuizAnswersScoreParams`** - Quiz scoring and answer validation
- **`EmojiItemType`** - Emoji data structure

### Widget Types (`widgets/`)

Type definitions for all supported widget types:

- **`TextWidgetParamsType`** - Text content and styling
- **`ImageWidgetParamsType`** - Image display and positioning
- **`VideoWidgetParamsType`** - Video playback and controls
- **`RectangleWidgetParamsType`** - Shape and container widgets
- **`QuizWidgetParamsType`** - Interactive quiz elements
- **`EmojiWidgetParamsType`** - Emoji reaction widgets
- **`IconWidgetParamsType`** - Icon display and styling
- **`WidgetType`** - Base widget interface

### Group and Story Types

High-level structure definitions:

- **`GroupType`** - Story group configuration and metadata
- **`StoryContext`** - Runtime story state and context
- **`GroupsListProps`** - Props for rendering story groups

## Advanced Usage

### Custom Widget Development

```typescript
import { WidgetType, WidgetParamsType } from '@storysdk/types';

// Define custom widget parameters
interface CustomWidgetParams extends WidgetParamsType {
  customProperty: string;
  customConfig: {
    enabled: boolean;
    value: number;
  };
}

// Use in widget implementation
const customWidget: WidgetType<CustomWidgetParams> = {
  type: 'custom',
  params: {
    customProperty: 'value',
    customConfig: {
      enabled: true,
      value: 42
    }
  }
};
```

### Type Guards and Validation

```typescript
import { WidgetType } from '@storysdk/types';

function isTextWidget(widget: WidgetType): widget is WidgetType<TextWidgetParamsType> {
  return widget.type === 'text';
}

// Usage
if (isTextWidget(someWidget)) {
  // TypeScript now knows this is a text widget
  console.log(someWidget.params.text);
}
```

## Contributing

When adding new types:

1. Place common types in `common/`
2. Widget-specific types go in `widgets/`
3. Export new types from `index.ts`
4. Add JSDoc comments for complex types
5. Ensure backward compatibility

## Version Compatibility

- **v1.6.x**: Compatible with StorySDK Core 1.9.x and React 1.9.x
- Follows semantic versioning for type additions and changes
- Breaking changes will increment major version

## Related Packages

- **[@storysdk/react](../react)** - React components (depends on this package)
- **[@storysdk/core](../core)** - Core SDK (depends on this package)

For more information, visit [storysdk.com](https://storysdk.com). 