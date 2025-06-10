Embedding YouTube videos in an Astro website can be done efficiently using community components that are optimized for performance and user experience. Here’s how you can do it:

## Using the Community `` Component

The recommended way is to use the `@astro-community/astro-embed-youtube` package, which provides a performant `` component that only loads the YouTube iframe when the user clicks play[1][2][3].

**Steps:**

1. **Install the Package**

   ```bash
   npm install @astro-community/astro-embed-youtube
   ```

2. **Import the Component**

   In your `.astro` or `.mdx` file:

   ```js
   import { YouTube } from "@astro-community/astro-embed-youtube";
   ```

3. **Use the Component**

   Add the following where you want the video to appear. You can use the video ID or a full YouTube URL:

   ```jsx

   ```

   or

   ```jsx

   ```

4. **Optional Props**

   - **poster:** Set a custom poster image URL.
   - **posterQuality:** Choose image quality for the default poster (`'max' | 'high' | 'default' | 'low'`).
   - **params:** Pass YouTube player parameters (e.g., `params="start=30"`).
   - **playlabel:** Customize the play button label.
   - **title:** Set a visible title for the video.

   Example with props:

   ```jsx

   ```

## Alternative: Using the Main `astro-embed` Package

If you want to embed other media types as well (like Vimeo or Twitter), you can use the main `astro-embed` package[5][9]:

1. **Install the Package**

   ```bash
   npm install astro-embed
   ```

2. **Import and Use the YouTube Component**

   ```js
   import { YouTube } from "astro-embed";
   ```

   Usage is the same as above.

## Manual Embedding (Lightweight Option)

If you prefer a lightweight, manual approach, you can use a custom Astro component that embeds a YouTube video with a placeholder that only loads the iframe on click[4]:

```js
---
// Example: YouTube.astro
export interface Props {
  title: string;
  videoCode: string;
}
let { title, videoCode } = Astro.props;
let playButtonSvg = ``; // (truncated for brevity, see source)
let srcdoc = `...${title}${playButtonSvg}`;
---

```

Use this component in your Astro files as ``.

## Summary Table

| Method                                 | Performance | Ease of Use | Customization |
| -------------------------------------- | ----------- | ----------- | ------------- |
| `@astro-community/astro-embed-youtube` | High        | Easy        | High          |
| `astro-embed` (multi-media)            | High        | Easy        | High          |
| Manual (custom component)              | High        | Moderate    | Very High     |

## Conclusion

For most use cases, installing and using the `@astro-community/astro-embed-youtube` package is the easiest and most performant way to embed YouTube videos in your Astro website[1][2][5]. For more flexibility, you can use a custom component or the main `astro-embed` package.

[1] https://www.npmjs.com/package/@astro-community/astro-embed-youtube
[2] https://astro-embed.netlify.app/components/youtube/
[3] https://astro.build/integrations/2/
[4] https://gist.github.com/insin/a743249ed7a0f8b60f51537e1c4354aa
[5] https://www.bitdoze.com/responsive-youtube-astrojs/
[6] https://www.mux.com/video-for/astro
[7] https://classic.yarnpkg.com/en/package/@astro-community/astro-embed-youtube
[8] https://codesandbox.io/examples/package/@astro-community/astro-embed-youtube
[9] https://astro-embed.netlify.app
