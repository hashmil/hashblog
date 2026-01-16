/**
 * Decap CMS Preview Configuration
 *
 * Global dependencies (provided by Decap CMS via Preact):
 * - CMS: The Decap CMS global object
 * - createClass: Preact component factory (like React.createClass)
 * - h: Preact hyperscript function for creating virtual DOM elements
 *
 * These are loaded globally by the Decap CMS script in index.html
 */

// Register the preview stylesheet so it applies inside the iframe
CMS.registerPreviewStyle('/admin/preview.css');

// ============================================
// EDITOR COMPONENTS - Add toolbar buttons for embeds
// These output URLs that astro-embed auto-transforms
// ============================================

// YouTube Embed - outputs URL for astro-embed auto-transformation
CMS.registerEditorComponent({
  id: 'youtube',
  label: 'YouTube',
  fields: [
    {
      name: 'id',
      label: 'YouTube Video ID or URL',
      widget: 'string',
      hint: 'Enter the video ID (e.g., dQw4w9WgXcQ) or full URL'
    }
  ],
  // Match YouTube URLs in content
  pattern: /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
  fromBlock: function(match) {
    return { id: match[1] };
  },
  toBlock: function(data) {
    // Extract ID if full URL was provided
    const idMatch = data.id.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const videoId = idMatch ? idMatch[1] : data.id;
    // Output URL - astro-embed will auto-transform this
    return `https://www.youtube.com/watch?v=${videoId}`;
  },
  toPreview: function(data) {
    const idMatch = data.id.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const videoId = idMatch ? idMatch[1] : data.id;
    return `<div class="video-embed youtube-embed">
      <iframe
        src="https://www.youtube.com/embed/${videoId}"
        title="YouTube Video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>`;
  }
});

// Vimeo Embed - outputs URL for astro-embed auto-transformation
CMS.registerEditorComponent({
  id: 'vimeo',
  label: 'Vimeo',
  fields: [
    {
      name: 'id',
      label: 'Vimeo Video ID or URL',
      widget: 'string',
      hint: 'Enter the video ID (e.g., 123456789) or full URL'
    }
  ],
  pattern: /^https:\/\/(?:www\.)?vimeo\.com\/(\d+)/,
  fromBlock: function(match) {
    return { id: match[1] };
  },
  toBlock: function(data) {
    const idMatch = data.id.match(/vimeo\.com\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : data.id;
    return `https://vimeo.com/${videoId}`;
  },
  toPreview: function(data) {
    const idMatch = data.id.match(/vimeo\.com\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : data.id;
    return `<div class="video-embed vimeo-embed">
      <iframe
        src="https://player.vimeo.com/video/${videoId}"
        title="Vimeo Video"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>`;
  }
});

// Twitter/X Embed - outputs URL for astro-embed auto-transformation
CMS.registerEditorComponent({
  id: 'tweet',
  label: 'Tweet',
  fields: [
    {
      name: 'url',
      label: 'Tweet URL',
      widget: 'string',
      hint: 'Full URL of the tweet (e.g., https://twitter.com/user/status/123456789)'
    }
  ],
  pattern: /^https:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/\d+/,
  fromBlock: function(match) {
    return { url: match[0] };
  },
  toBlock: function(data) {
    return data.url;
  },
  toPreview: function(data) {
    return `<div class="tweet-embed">
      <a href="${data.url}" target="_blank" rel="noopener noreferrer">
        <div class="tweet-placeholder">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>View Tweet</span>
        </div>
      </a>
    </div>`;
  }
});

// Local Video (MP4)
CMS.registerEditorComponent({
  id: 'video',
  label: 'Video (MP4)',
  fields: [
    {
      name: 'src',
      label: 'Video Path',
      widget: 'string',
      hint: 'Path to video, e.g., /media/video.mp4 or /videos/post-slug/video.mp4'
    },
    {
      name: 'autoplay',
      label: 'Autoplay (muted)',
      widget: 'boolean',
      default: false
    },
    {
      name: 'loop',
      label: 'Loop',
      widget: 'boolean',
      default: true
    }
  ],
  // Match both formats: <video src="..."> and <video><source src="...">
  pattern: /^<video[^>]*>[\s\S]*?(?:src="([^"]+)"|<source[^>]*src="([^"]+)")[\s\S]*?<\/video>/m,
  fromBlock: function(match) {
    return { src: match[1] || match[2] };
  },
  toBlock: function(data) {
    let attrs = 'controls';
    if (data.loop) attrs += ' loop';
    attrs += ' playsinline';
    if (data.autoplay) attrs += ' autoplay muted';
    return `<video ${attrs}>
  <source src="${data.src}" type="video/mp4" />
  Your browser does not support the video tag.
</video>`;
  },
  toPreview: function(data) {
    let attrs = 'controls playsinline';
    if (data.autoplay) attrs += ' autoplay muted';
    if (data.loop) attrs += ' loop';
    return `<div class="video-embed local-video">
      <video ${attrs}>
        <source src="${data.src}" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>`;
  }
});

// Note: Code Block is handled by Decap CMS built-in component
// Using standard markdown fenced code blocks: ```language\ncode\n```

// ============================================
// CONTENT COMPONENTS - For rich blog content
// ============================================

// Callout/Note Box - for tips, warnings, important notes
CMS.registerEditorComponent({
  id: 'callout',
  label: 'Callout',
  fields: [
    {
      name: 'type',
      label: 'Type',
      widget: 'select',
      options: ['note', 'tip', 'warning', 'important'],
      default: 'note'
    },
    {
      name: 'content',
      label: 'Content',
      widget: 'text'
    }
  ],
  pattern: /^<div class="callout callout-(\w+)">\s*([\s\S]*?)\s*<\/div>$/m,
  fromBlock: function(match) {
    return { type: match[1], content: match[2] };
  },
  toBlock: function(data) {
    return `<div class="callout callout-${data.type}">\n${data.content}\n</div>`;
  },
  toPreview: function(data) {
    const icons = {
      note: 'ℹ️',
      tip: '💡',
      warning: '⚠️',
      important: '❗'
    };
    return `<div class="callout callout-${data.type}">
      <span class="callout-icon">${icons[data.type] || 'ℹ️'}</span>
      <div class="callout-content">${data.content}</div>
    </div>`;
  }
});

// Figure - Image with caption
CMS.registerEditorComponent({
  id: 'figure',
  label: 'Figure',
  fields: [
    {
      name: 'src',
      label: 'Image Path',
      widget: 'image',
      hint: 'Upload or enter path like /media/image.jpg'
    },
    {
      name: 'alt',
      label: 'Alt Text',
      widget: 'string',
      hint: 'Describe the image for accessibility'
    },
    {
      name: 'caption',
      label: 'Caption',
      widget: 'string',
      hint: 'Caption text shown below the image'
    }
  ],
  pattern: /^<figure>\s*<img src="([^"]+)" alt="([^"]*)"[^>]*>\s*<figcaption>([^<]*)<\/figcaption>\s*<\/figure>$/m,
  fromBlock: function(match) {
    return { src: match[1], alt: match[2], caption: match[3] };
  },
  toBlock: function(data) {
    return `<figure>
  <img src="${data.src}" alt="${data.alt || ''}" />
  <figcaption>${data.caption}</figcaption>
</figure>`;
  },
  toPreview: function(data) {
    return `<figure class="content-figure">
      <img src="${data.src}" alt="${data.alt || ''}" />
      <figcaption>${data.caption}</figcaption>
    </figure>`;
  }
});

// Button/CTA Link
CMS.registerEditorComponent({
  id: 'button',
  label: 'Button',
  fields: [
    {
      name: 'text',
      label: 'Button Text',
      widget: 'string'
    },
    {
      name: 'url',
      label: 'URL',
      widget: 'string',
      hint: 'Link destination'
    },
    {
      name: 'style',
      label: 'Style',
      widget: 'select',
      options: ['primary', 'secondary', 'outline'],
      default: 'primary'
    }
  ],
  pattern: /^<a href="([^"]+)" class="cta-button cta-(\w+)">([^<]+)<\/a>$/m,
  fromBlock: function(match) {
    return { url: match[1], style: match[2], text: match[3] };
  },
  toBlock: function(data) {
    return `<a href="${data.url}" class="cta-button cta-${data.style}">${data.text}</a>`;
  },
  toPreview: function(data) {
    return `<a href="${data.url}" class="cta-button cta-${data.style}">${data.text}</a>`;
  }
});

// Blockquote with Attribution
CMS.registerEditorComponent({
  id: 'quote',
  label: 'Quote',
  fields: [
    {
      name: 'text',
      label: 'Quote Text',
      widget: 'text'
    },
    {
      name: 'author',
      label: 'Author',
      widget: 'string',
      required: false,
      hint: 'Optional attribution'
    },
    {
      name: 'source',
      label: 'Source',
      widget: 'string',
      required: false,
      hint: 'Optional source (book, article, etc.)'
    }
  ],
  pattern: /^<blockquote class="attributed-quote">\s*<p>([\s\S]*?)<\/p>\s*(?:<cite>— ([^<]*?)(?:, <em>([^<]*)<\/em>)?<\/cite>)?\s*<\/blockquote>$/m,
  fromBlock: function(match) {
    return { text: match[1], author: match[2] || '', source: match[3] || '' };
  },
  toBlock: function(data) {
    let cite = '';
    if (data.author) {
      cite = `\n  <cite>— ${data.author}${data.source ? `, <em>${data.source}</em>` : ''}</cite>`;
    }
    return `<blockquote class="attributed-quote">
  <p>${data.text}</p>${cite}
</blockquote>`;
  },
  toPreview: function(data) {
    let cite = '';
    if (data.author) {
      cite = `<cite>— ${data.author}${data.source ? `, <em>${data.source}</em>` : ''}</cite>`;
    }
    return `<blockquote class="attributed-quote">
      <p>${data.text}</p>
      ${cite}
    </blockquote>`;
  }
});

// Details/Collapsible Section
CMS.registerEditorComponent({
  id: 'details',
  label: 'Collapsible',
  fields: [
    {
      name: 'summary',
      label: 'Summary (visible text)',
      widget: 'string',
      hint: 'Clickable header text'
    },
    {
      name: 'content',
      label: 'Hidden Content',
      widget: 'text',
      hint: 'Content revealed when expanded'
    },
    {
      name: 'open',
      label: 'Start Open',
      widget: 'boolean',
      default: false
    }
  ],
  pattern: /^<details( open)?>\s*<summary>([^<]+)<\/summary>\s*([\s\S]*?)\s*<\/details>$/m,
  fromBlock: function(match) {
    return { open: !!match[1], summary: match[2], content: match[3] };
  },
  toBlock: function(data) {
    const openAttr = data.open ? ' open' : '';
    return `<details${openAttr}>
  <summary>${data.summary}</summary>
  ${data.content}
</details>`;
  },
  toPreview: function(data) {
    const openAttr = data.open ? ' open' : '';
    return `<details${openAttr} class="collapsible">
      <summary>${data.summary}</summary>
      <div class="details-content">${data.content}</div>
    </details>`;
  }
});

// ============================================
// PREVIEW TEMPLATE
// ============================================

const BlogPostPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']);
    const widgetFor = this.props.widgetFor;

    // Match actual site: dark background, just title + body content
    return h('div', { className: 'preview-container' },
      h('div', { className: 'preview-content' },
        h('h1', { className: 'preview-title' }, title),
        h('div', { className: 'preview-body' }, widgetFor('body'))
      )
    );
  }
});

CMS.registerPreviewTemplate('blog', BlogPostPreview);
