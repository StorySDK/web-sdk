# StoryPreview

Компонент для отображения превью истории без возможности взаимодействия.

## Описание

`StoryPreview` - это упрощенная версия компонента `StoryContent`, предназначенная для отображения историй в режиме предварительного просмотра. Компонент автоматически масштабирует историю под размер контейнера и блокирует все интерактивные элементы.

## Использование

```tsx
import { StoryPreview } from '@storysdk/react';
import type { StoryType } from '@storysdk/types';

const story: StoryType = {
  // ... данные истории
};

function MyComponent() {
  return (
    <StoryPreview 
      story={story}
      width={300}
      height={400}
    />
  );
}
```

## Параметры

| Параметр | Тип | Обязательный | По умолчанию | Описание |
|----------|-----|--------------|--------------|----------|
| `story` | `StoryType` | ✅ | - | Данные истории для отображения |
| `width` | `number \| string` | ✅ | - | Ширина контейнера |
| `height` | `number \| string` | ✅ | - | Высота контейнера |
| `className` | `string` | ❌ | - | Дополнительный CSS класс |
| `isVideoMuted` | `boolean` | ❌ | `true` | Отключить звук видео |
| `disableInteraction` | `boolean` | ❌ | `true` | Отключить взаимодействие с виджетами |
| `storyWidth` | `number` | ❌ | `360` | Ширина истории в пикселях |
| `storyHeight` | `number` | ❌ | `640` | Высота истории в пикселях |

## Особенности

- **Автоматическое масштабирование**: История автоматически масштабируется под размер контейнера с сохранением пропорций
- **Отключение интерактивности**: По умолчанию все виджеты неинтерактивны
- **Оптимизация производительности**: Не загружаются соседние истории, отключена анимация
- **Поддержка видео**: Видео отображается, но не воспроизводится автоматически

## Примеры

### Базовое использование

```tsx
<StoryPreview 
  story={story}
  width={200}
  height={350}
/>
```

### С кастомными размерами истории

```tsx
<StoryPreview 
  story={story}
  width="100%"
  height={500}
  storyWidth={414}
  storyHeight={896}
/>
```

### С дополнительным классом

```tsx
<StoryPreview 
  story={story}
  width={300}
  height={400}
  className="my-story-preview"
/>
```

### Включение интерактивности

```tsx
<StoryPreview 
  story={story}
  width={300}
  height={400}
  disableInteraction={false}
/>
```

## CSS классы

Компонент использует БЭМ методологию с блоком `StorySdkPreview`:

- `.StorySdkPreview` - основной контейнер
- `.StorySdkPreview__background` - фон истории
- `.StorySdkPreview__imageBackground` - фоновое изображение
- `.StorySdkPreview__content` - контейнер с содержимым
- `.StorySdkPreview__widget` - отдельный виджет

## Стилизация

```scss
.StorySdkPreview {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: scale(1.02);
  }
}
``` 