# StorySDK React

## Introduction

`@storysdk/react` provides React components for StorySDK, allowing easy integration of interactive stories and onboarding experiences into React applications. This package builds on the functionality of the core StorySDK package (`@storysdk/core`), offering a more React-friendly implementation.

StorySDK is an open-source platform for creating and integrating video stories and onboarding experiences. For more information, visit [storysdk.com](https://storysdk.com).

## Installation

### NPM

```bash
npm install @storysdk/react
```

### Yarn

```bash
yarn add @storysdk/react
```

## Basic Usage

```jsx
import { GroupsList, GroupType, WidgetsTypes } from "@storysdk/react"; 
import "@storysdk/react/dist/bundle.css";

function StoryComponent() {
  return (
    <GroupsList 
      groups={<GROUPS_ARRAY_HERE>}
      token="<APP_TOKEN_HERE>"
    />
  );
}

export default StoryComponent;
```

For more advanced event handling, refer to the [@storysdk/core documentation](https://docs.storysdk.com).

## Integration with Next.js

When using StorySDK React with Next.js, use dynamic imports to avoid server-side rendering issues:

```jsx
import dynamic from 'next/dynamic';
import '@storysdk/react/dist/bundle.css';

// Dynamically import the component with SSR disabled
const StoryComponent = dynamic(
  () => import('../components/StoryComponent'),
  { ssr: false }
);

function HomePage() {
  return (
    <div>
      <h1>My Next.js App</h1>
      <StoryComponent />
    </div>
  );
}

export default HomePage;
```

## Further Resources

- [StorySDK Website](https://storysdk.com)
- [Full Documentation](https://docs.storysdk.com)
