# StorySDK React Native

React Native components for StorySDK using WebView to display stories.

## Installation

```bash
npm install @storysdk/react-native react-native-webview
```

## Usage

### StoryGroups

Component for displaying a list of story groups:

```jsx
import { StoryGroups } from '@storysdk/react-native';

// In your component
<StoryGroups
  token="YOUR_TOKEN"
  onGroupClick={(groupId) => {
    // Handle group click
    setSelectedGroupId(groupId);
  }}
  groupImageWidth={80}
  groupImageHeight={80}
  groupTitleSize={14}
/>
```

### StoryModal

Component for displaying stories in a modal window:

```jsx
import { StoryModal } from '@storysdk/react-native';

// In your component
<StoryModal
  token="YOUR_TOKEN"
  groupId={selectedGroupId}
  onClose={() => setSelectedGroupId(null)}
  storyWidth={300}
  storyHeight={600}
/>
```

## Onboarding Implementation

For onboarding flows, use the `StoryModal` component with an Onboarding ID instead of a regular groupId:

```jsx
import { StoryModal } from '@storysdk/react-native';

// For onboarding implementation
<StoryModal
  token="YOUR_TOKEN"
  groupId="ONBOARDING_ID" // Use your Onboarding ID here
  onClose={() => setOnboardingComplete(true)}
/>
```

**Important**: When an Onboarding ID is specified, the modal window will open automatically. Only use the `StoryModal` component for onboarding implementations.

## Props

### StoryGroups

- `token` (required) - Token for accessing StorySDK
- `onGroupClick` - Handler for group click events
- `groupImageWidth` - Width of group image in pixels
- `groupImageHeight` - Height of group image in pixels
- `groupTitleSize` - Font size of group title in pixels
- `groupClassName` - CSS class for styling individual group
- `groupsClassName` - CSS class for styling groups container
- `activeGroupOutlineColor` - Outline color for active group
- `groupsOutlineColor` - Outline color for all groups
- `arrowsColor` - Color of navigation arrows
- `backgroundColor` - Background color of the component
- `onError` - Error handler callback that receives error details

### StoryModal

- `token` (required) - Token for accessing StorySDK
- `groupId` - Group ID to display (or Onboarding ID for onboarding flows)
- `onClose` - Handler for modal close event
- `storyWidth` - Width of story in pixels
- `storyHeight` - Height of story in pixels
- `isShowMockup` - Whether to show device mockup around stories
- `isShowLabel` - Whether to show labels
- `isStatusBarActive` - Whether status bar is active
- `autoplay` - Automatically play through stories
- `arrowsColor` - Color of navigation arrows
- `backgroundColor` - Background color of the component
- `forbidClose` - Prevent modal from being closed (useful for critical onboarding flows)
- `onError` - Error handler callback that receives error details

## Usage Example

### Standard Story Implementation

```jsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { StoryGroups, StoryModal } from '@storysdk/react-native';

const App = () => {
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <StoryGroups
        token="YOUR_TOKEN"
        onGroupClick={setSelectedGroupId}
      />
      <StoryModal
        token="YOUR_TOKEN"
        groupId={selectedGroupId}
        onClose={() => setSelectedGroupId(null)}
      />
    </View>
  );
};

export default App;
```

### Onboarding Implementation

```jsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StoryModal } from '@storysdk/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
        if (onboardingCompleted !== 'true') {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    checkOnboardingStatus();
  }, []);
  
  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
      {/* Onboarding modal */}
      <StoryModal
        token="YOUR_TOKEN"
        groupId={showOnboarding ? "ONBOARDING_ID" : null}
        onClose={handleOnboardingComplete}
        forbidClose={false} // Set to true if onboarding must be completed
      />
    </View>
  );
};

export default App;
```