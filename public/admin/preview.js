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

// Code Block with syntax highlighting
CMS.registerEditorComponent({
  id: 'codeblock',
  label: 'Code Block',
  fields: [
    {
      name: 'language',
      label: 'Language',
      widget: 'select',
      options: [
        'javascript', 'typescript', 'python', 'html', 'css', 'json',
        'bash', 'shell', 'markdown', 'jsx', 'tsx', 'go', 'rust', 'sql',
        'yaml', 'xml', 'swift', 'kotlin', 'java', 'csharp', 'php', 'ruby'
      ],
      default: 'javascript'
    },
    {
      name: 'code',
      label: 'Code',
      widget: 'text'
    }
  ],
  pattern: /^```(\w+)\n([\s\S]*?)```$/m,
  fromBlock: function(match) {
    return {
      language: match[1],
      code: match[2].trim()
    };
  },
  toBlock: function(data) {
    return '```' + data.language + '\n' + data.code + '\n```';
  },
  toPreview: function(data) {
    const escaped = data.code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="language-${data.language}"><code>${escaped}</code></pre>`;
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
