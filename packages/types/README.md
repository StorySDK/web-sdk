# @storysdk/types

Package with common types for StorySDK.

## Structure

- `common/` - common data types
- `widgets/` - widget types
- `groups/` - group types
- `index.ts` - main file for type exports

## Usage

```typescript
import { 
  GroupType, 
  WidgetType, 
  MaterialIconValueType 
} from '@storysdk/types';
```

## Types

### Common Types (`common/`)
- `MaterialIconValueType` - type for Material Design icons
- `BackgroundType` - type for background
- `BorderType` - type for borders
- `ColorValue` - type for colors
- `FontParamsType` - font parameters
- `VideoMetadataType` - video metadata
- `QuizAnswersScoreParams` - quiz answer score parameters
- `EmojiItemType` - type for emoji

### Widget Types (`widgets/`)
- `RectangleWidgetParamsType` - rectangle widget parameters
- `TextWidgetParamsType` - text widget parameters
- `ImageWidgetParamsType` - image widget parameters
- `VideoWidgetParamsType` - video widget parameters
- `QuizWidgetParamsType` - quiz widget parameters
- `EmojiWidgetParamsType` - emoji widget parameters
- `IconWidgetParamsType` - icon widget parameters
- `WidgetType` - general widget type

### Group Types (`groups/`)
- `GroupType` - group type
- `GroupsListProps` - groups list properties 