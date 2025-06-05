# View transitions

Astro supports view transitions with just a few lines of code. View transitions update your page content without the browser's normal, full-page navigation refresh and provide seamless animations between pages. Where browser support for the View Transition API is lacking, Astro allows you to control fallback strategies for the best possible experience for all visitors.

Astro provides a `<ClientRouter />` routing component that can be added to a single page's `<head>` to control page transitions as you navigate away to another page. It provides a lightweight client-side router that intercepts navigation and allows you to customize the transition between pages.

Add this component to a reusable `.astro` component, such as a common head or layout, for animated page transitions across your entire site (SPA mode).

Astro's view transitions support is powered by the new View Transitions browser API and also includes:

- A few built-in animation options, such as `fade`, `slide`, and `none`.
- Support for both forwards and backwards navigation animations.
- The ability to fully customize all aspects of transition animation, and build your own animations.
- The option to prevent client-side navigation for non-page links.
- Control over fallback behavior for browsers that do not yet support the View Transition APIs.
- Automatic support for prefers-reduced-motion.

**Note**
By default, every page will use regular, full-page, browser navigation. You must opt in to view transitions and can use them either on a per-page basis or site-wide.

## Adding View Transitions to a Page

To add view transitions to a single page, import and add the `<ClientRouter />` component to the `<head>` of that page.

```astro
---
// src/pages/index.astro
import { ClientRouter } from 'astro:transitions/client';
---
<html lang="en">
  <head>
    <title>My Homepage</title>
    <ClientRouter />
  </head>
  <body>
    <h1>Welcome to my website!</h1>
    <a href="/about/">About</a>
  </body>
</html>
```

## Full site view transitions (SPA mode)

To enable view transitions across your entire site (also known as SPA mode), import and add the `<ClientRouter />` component to a common `<head>` component or shared layout.

```astro
---
// src/layouts/Layout.astro
import { ClientRouter } from 'astro:transitions/client';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title><slot name="title" /></title>
    <ClientRouter />
  </head>
  <body>
    <slot />
  </body>
</html>
```

Navigating between pages will now be accompanied by a subtle fade animation, the default animation when using view transitions.

## Transition Directives

Astro also provides several transition directives to customize the animation of a view transition and to control how elements are transitioned between pages.

### Naming a transition

By default, elements are matched from the old page to the new by looking for an element in the same position in the DOM.

Give an element a unique `transition:name` to tell Astro how to identify a pair of elements from two different pages. Any element in both the old and new page that shares the same `transition:name` will transition together.

```astro
---
// src/components/MyComponent.astro
---
<div transition:name="my-transition-name" class="my-fancy-box">
  Some content here
</div>
```

The `transition:name` attribute must be a string, and must be unique. The value of `transition:name` does not matter, only that it is the same on both pages.

### Maintaining State

Use the `transition:persist` directive on an element to keep its component state and DOM elements when navigating between pages.

```astro
---
// src/components/MyComponent.astro
import MyInteractiveComponent from './MyInteractiveComponent.jsx';
---
<div transition:persist class="my-fancy-box">
  <MyInteractiveComponent client:load />
</div>
```

You can also manually persist components when they are not in the same Astro component:

```astro
---
// src/pages/index.astro
import MyInteractiveComponent from '../components/MyInteractiveComponent.jsx';
---
<div transition:persist="my-interactive-component">
  <MyInteractiveComponent client:load />
</div>
```

The `transition:persist` attribute, when given a string value, must be unique. Elements with the same `transition:persist` name will persist together. If no value is specified, the component instance itself is used as the identifier.

`transition:persist` can also be used on Astro Islands components (UI framework components).

### Built-in Animation Directives

Astro provides several built-in animations that you can use with transition directives.

- `transition:fade` (default): A cross-fade animation. The old content fades out and the new content fades in.
- `transition:slide`: An animation where the old content slides out to the left and the new content slides in from the right. On backwards navigation, the animations are reversed.
- `transition:none`: Disables the default cross-fade animation, swapping old content for new immediately with no visual transition.

You can use these directives on any element, including the `<ClientRouter />` component itself, to control the animation for a specific transition.

```astro
---
// src/layouts/Layout.astro
import { ClientRouter }    from 'astro:transitions/client';
---
<html lang="en">
<head>
  <ClientRouter transition:slide />
</head>
<body>
  <slot />
</body>
</html>
```

### Customizing Animations

You can customize all aspects of a transition by providing `forwards`, `backwards`, and `initial` animation properties to a transition directive.

```astro
---
// src/components/MyComponent.astro
import { slide } from 'astro:transitions';
---
<div
  transition:name="my-fancy-box"
  transition:animate={slide({ duration: '2s' })}
  class="my-fancy-box"
>
  Some content here
</div>
```

This is an example of a custom animation using the built-in `slide` animation but with a custom duration.

## Router control

The `<ClientRouter />` component provides several ways to control the client-side router.

### Preventing client-side navigation

Add the `data-astro-reload` attribute to any `<a>` tag to force a full-page, browser navigation instead of using client-side routing. This is useful for links to pages that do not use the `<ClientRouter />` component, or for when you specifically want to trigger a full browser refresh.

```html
<a href="/some/page" data-astro-reload>Full browser navigation</a>
```

### Trigger navigation

The `navigate` function from the `astro:transitions/client` module allows you to trigger client-side navigation programmatically. This can be useful when you need to navigate the user after an action, for example after submitting a form.

```javascript
import { navigate } from "astro:transitions/client";

if (await canLogin()) {
  // Redirect to the dashboard.
  return navigate("/dashboard");
}
```

### Replace entries in the browser history

The `navigate` function also accepts an optional `history` option that allows you to control how the browser history is updated.

- `push` (default): The new URL is added to the browser history.
- `replace`: The current entry in browser history is replaced with the new URL.

```javascript
import { navigate } from "astro:transitions/client";

// The current history entry will be replaced by `/another-page`.
// Clicking the browser's back button will take the user to the page
// before the current one.
navigate("/another-page", { history: "replace" });
```

### Transitions with forms

Client-side navigation works with HTML `<form>` submissions. When a form would normally cause a GET navigation, the `<ClientRouter />` will intercept this and perform client-side navigation.

POST form submissions will still use full-page navigation.

## Fallback control

The View Transitions API is not yet supported in all browsers. Astro provides fallback options to control how transitions behave in unsupported browsers.

Add a `fallback` property to the `<ClientRouter />` component to specify a fallback behavior.

- `swap` (default): Astro will attempt to simulate view transitions by swapping the old page with the new page content without any animation.
- `animate`: Astro will attempt a "slide" animation as a fallback for browsers without View Transition support.
- `reload`: Astro will perform a full-page navigation if view transitions are not supported.

```astro
---
// src/layouts/Layout.astro
import { ClientRouter } from 'astro:transitions/client';
---
<html lang="en">
<head>
  <ClientRouter fallback="animate" />
</head>
<body>
  <slot />
</body>
</html>
```

## Client-side navigation process

When client-side navigation occurs, the following process takes place:

1.  The user triggers navigation (e.g. clicks a link).
2.  Astro intercepts the navigation and fetches the next page's HTML content.
3.  Astro parses the new HTML and begins the view transition.
4.  The old page's content is captured as an image.
5.  The new page's content is swapped into the DOM.
6.  The new page's scripts are executed.
7.  The view transition animates the captured image of the old page out and the new page in.

## Script behavior with view transitions

Scripts in `<head>` and `<body>` are handled differently during client-side navigation.

### Script order

During initial page load, Astro guarantees script execution order. However, when using client-side navigation, the order of execution for scripts can change.

### Script re-execution

By default, Astro will re-run any `<script>` tags on the new page after navigation. This is usually the desired behavior, but it can be controlled with the `data-astro-rerun` attribute.

- `data-astro-rerun`: Add this attribute to a `<script>` tag to force it to re-run after every client-side navigation. This is the default behavior.
- `data-astro-rerun="once"`: Add this attribute to a `<script>` tag to prevent it from re-running if it has already run once.
- `data-astro-rerun="never"`: Add this attribute to a `<script>` tag to prevent it from ever re-running during client-side navigation.

## Lifecycle events

Astro dispatches several events on the `document` object during client-side navigation. These allow you to hook into the navigation process and run custom code.

### `astro:before-preparation`

**Added in:** `astro@3.6.0`

An event that fires at the start of the preparation phase, before the new page's content has been fetched.

You can use this event:

- To do something before loading has started, such as showing a loading spinner.
- To alter loading, such as loading content you've defined in a template rather than from the external URL.
- To change the `direction` of the navigation (which is usually either `forward` or `backward`) for custom animation.

Here is an example of using the `astro:before-preparation` event to load a spinner before the content is loaded and stop it immediately after loading. Note that using the `loader` callback in this way allows asynchronous execution of code.

```html
<script is:inline>
  document.addEventListener("astro:before-preparation", (event) => {
    const originalLoader = event.loader;
    event.loader = async function () {
      const { startSpinner } = await import("./spinner.js");
      const stop = startSpinner();
      await originalLoader();
      stop();
    };
  });
</script>
```

### `astro:after-preparation`

**Added in:** `astro@3.6.0`

An event that fires at the end of the preparation phase, after the new page's content has been loaded and parsed into a document. This event occurs before the view transitions phase.

This example uses the `astro:before-preparation` event to start a loading indicator and the `astro:after-preparation` event to stop it:

```html
<script is:inline>
  document.addEventListener("astro:before-preparation", () => {
    document.querySelector("#loading").classList.add("show");
  });
  document.addEventListener("astro:after-preparation", () => {
    document.querySelector("#loading").classList.remove("show");
  });
</script>
```

This is a simpler version of loading a spinner than the example shown above: if all of the listener's code can be executed synchronously, there is no need to hook into the `loader` callback.

### `astro:before-swap`

**Added in:** `astro@3.6.0`

An event that fires before the new document (which is populated during the preparation phase) replaces the current document. This event occurs inside of the view transition, where the user is still seeing a snapshot of the old page.

This event can be used to make changes before the swap occurs. The `newDocument` property on the event represents the incoming document. Here is an example of ensuring the browser's light or dark mode preference in `localStorage` is carried over to the new page:

```html
<script is:inline>
  function setDarkMode(document) {
    let theme = localStorage.darkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
  }

  setDarkMode(document);

  document.addEventListener("astro:before-swap", (event) => {
    // Pass the incoming document to set the theme on it
    setDarkMode(event.newDocument);
  });
</script>
```

The `astro:before-swap` event can also be used to change the _implementation_ of the swap. The default swap implementation diffs head content, moves **persistent** elements from the old document to the `newDocument`, and then replaces the entire `body` with the body of the new document.

At this point of the lifecycle, you could choose to define your own swap implementation, for example to diff the entire contents of the existing document (which some other routers do):

```html
<script is:inline>
  document.addEventListener("astro:before-swap", (event) => {
    event.swap = () => {
      diff(document, event.newDocument);
    };
  });
</script>
```

#### Building a custom swap function

**Added in:** `astro@4.15.0`

The `swapFunctions` object of the `astro:transitions/client` module provides five utility functions that handle specific swap-related tasks, including handling document attributes, page elements, and script execution. These functions can be used directly to define a custom swap implementation.

The following example demonstrates how to use these functions to recreate Astro's built-in swap implementation:

```javascript
import { swapFunctions } from "astro:transitions/client";

// substitutes `window.document` with `doc`
function mySwap(doc: Document) {
  swapFunctions.deselectScripts(doc);
  swapFunctions.swapRootAttributes(doc);
  swapFunctions.swapHeadElements(doc);
  const restoreFocusFunction = swapFunctions.saveFocus();
  swapFunctions.swapBodyElement(doc.body, document.body);
  restoreFocusFunction();
}

event.swap = () => mySwap(event.newDocument);
```

Custom swap implementations can start with this template and add or replace individual steps with custom logic as needed.

### `astro:after-swap`

An event that fires immediately after the new page replaces the old page. You can listen to this event on the `document` and trigger actions that will occur before the new page's DOM elements render and scripts run.

This event, when listened to on the **outgoing page**, is useful to pass along and restore any state on the DOM that needs to transfer over to the new page.

This is the latest point in the lifecycle where it is still safe to, for example, add a dark mode class name (`<html class="dark-mode">`), though you may wish to do so in an earlier event.

The `astro:after-swap` event occurs immediately after the browser history has been updated and the scroll position has been set. Therefore, one use of targeting this event is to override the default scroll restore for history navigation. The following example resets the horizontal and vertical scroll position to the top left corner of the page for each navigation.

```javascript
document.addEventListener("astro:after-swap", () =>
  window.scrollTo({ left: 0, top: 0, behavior: "instant" })
);
```

### `astro:page-load`

An event that fires at the end of page navigation, after the new page is visible to the user and blocking styles and scripts are loaded. You can listen to this event on the `document`.

The `<ClientRouter />` component fires this event both on initial page navigation for a pre-rendered page and on any subsequent navigation, either forwards or backwards.

You can use this event to run code on every page navigation, for example to set up event listeners that would otherwise be lost during navigation.

```html
<script>
  document.addEventListener("astro:page-load", () => {
    // This runs on first page load and after every navigation.
    setupStuff(); // e.g. add event listeners
  });
</script>
```

## Accessibility

Enabling client-side routing and animating page transitions both come with accessibility challenges, and Astro aims to make sites opting in to View Transitions as accessible-by-default as possible.

### Route announcement

**Added in:** `astro@3.2.0`

The `<ClientRouter />` component includes a route announcer for page navigation during client-side routing. No configuration or action is needed to enable this.

Assistive technologies let visitors know that the page has changed by announcing the new page title after navigation. When using server-side routing with traditional full-page browser refreshes, this happens by default after the new page loads. In client-side routing, the `<ClientRouter />` component performs this action.

To add route announcement to client-side routing, the component adds an element to the new page with the `aria-live` attribute set to `assertive`. This tells AT (assistive technology) to announce immediately. The component also checks for the following, in priority order, to determine the announcement text:

- The `<title>`, if it exists.
- The first `<h1>` it finds.
- The `pathname` of the page.

We strongly recommend you always include a `<title>` in each page for accessibility.

### `prefers-reduced-motion`

Astro's `<ClientRouter />` component includes a CSS media query that disables _all_ view transition animations, including fallback animation, whenever the prefer-reduced-motion setting is detected. Instead, the browser will simply swap the DOM elements without an animation.
