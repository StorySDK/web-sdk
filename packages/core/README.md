# `@storysdk/core`

A new level of engagement with your users with a familiar format. StorySDK helps app owners create amazing mobile marketing content via stories. Add StorySDK and create a stories with a couple of clicks.

## Usage

### React

```
import { Story } from "@storysdk/core"; 
import "@storysdk/core/dist/bundle.umd.css";

const ref = useRef(null);

useEffect(() => {
  const story = new Story("<APP_TOKEN_HERE>");

  const element = ref.current;
  story.renderGroups(element);
}, []);
```

### JavaScript (ES6)

```
import { Story } from "@storysdk/core"; 
import "@storysdk/core/dist/bundle.umd.css";

const story = new Story("<APP_TOKEN_HERE>");

const element = document.querySelector("<SELECTOR_HERE>");
story.renderGroups(element);
```

### Static HTML

```
<head>
  <script src="https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.umd.min.js"></script>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@storysdk/core@latest/dist/bundle.umd.css">
</head>
<body>
  <div data-storysdk-token="<APP_TOKEN_HERE>"></div>
</body>
```

