# `@storysdk/core`

A new level of engagement with your users with a familiar format. StorySDK helps app owners create amazing mobile marketing content via stories. Add StorySDK and create a stories with a couple of clicks.

## Usage

### React

```
import Story from "@storysdk/core"; 
import "@storysdk/core/dist/bundle.css";

const ref = useRef(null);

useEffect(() => {
  const story = new Story("<APP_TOKEN_HERE>");

  const element = ref.current;
  story.renderGroups(element);
}, []);
```

### JavaScript (ES6)

```
import Story from "@storysdk/core"; 
import "@storysdk/core/dist/bundle.css";

const story = new Story("<APP_TOKEN_HERE>");

const element = document.querySelector("<SELECTOR_HERE>");
story.renderGroups(element);
```

