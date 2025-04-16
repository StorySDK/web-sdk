import { Story, init } from './Story';

export { adaptGroupData } from './utils';

export { Story };

export { StoryEventTypes } from './types';

export { init };

declare const IS_UMD: boolean | undefined;

const initForUMD = () => {
  if (typeof IS_UMD !== 'undefined' && IS_UMD === true) {
    if (typeof window !== 'undefined') {
      window.Story = Story;
    }
    init();
  }
  return null;
};

initForUMD();

export default Story;
