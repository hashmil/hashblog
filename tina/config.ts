import { defineConfig, type Template } from 'tinacms';

// =============================================================================
// Block Templates for Visual Editing
// =============================================================================

/**
 * Content Block - Rich text with markdown support
 * Primary block for paragraphs, headings, lists, inline links
 */
const contentBlock: Template = {
  name: 'content',
  label: 'Content',
  ui: {
    defaultItem: {
      body: 'Start writing...',
    },
  },
  fields: [
    {
      type: 'rich-text',
      name: 'body',
      label: 'Content',
      required: true,
    },
  ],
};

/**
 * Image Block - Single image with optional caption
 */
const imageBlock: Template = {
  name: 'image',
  label: 'Image',
  fields: [
    {
      type: 'image',
      name: 'src',
      label: 'Image',
      required: true,
    },
    {
      type: 'string',
      name: 'alt',
      label: 'Alt Text',
      description: 'Describe the image for accessibility',
    },
    {
      type: 'string',
      name: 'caption',
      label: 'Caption',
      description: 'Optional caption displayed below the image',
    },
  ],
};

/**
 * Video Block - YouTube, Vimeo, or local video
 */
const videoBlock: Template = {
  name: 'video',
  label: 'Video',
  fields: [
    {
      type: 'string',
      name: 'type',
      label: 'Video Type',
      options: [
        { value: 'youtube', label: 'YouTube' },
        { value: 'vimeo', label: 'Vimeo' },
        { value: 'local', label: 'Local Video' },
      ],
      required: true,
    },
    {
      type: 'string',
      name: 'url',
      label: 'Video URL',
      description: 'YouTube/Vimeo URL or path to local video (e.g., /media/video.mp4)',
      required: true,
    },
    {
      type: 'string',
      name: 'caption',
      label: 'Caption',
    },
    {
      type: 'boolean',
      name: 'autoplay',
      label: 'Autoplay (muted)',
      description: 'Only for local videos',
    },
    {
      type: 'boolean',
      name: 'loop',
      label: 'Loop',
      description: 'Only for local videos',
    },
  ],
};

/**
 * Code Block - Syntax highlighted code snippets
 */
const codeBlock: Template = {
  name: 'code',
  label: 'Code',
  fields: [
    {
      type: 'string',
      name: 'language',
      label: 'Language',
      options: [
        'javascript',
        'typescript',
        'python',
        'bash',
        'css',
        'html',
        'json',
        'jsx',
        'tsx',
        'markdown',
        'yaml',
        'sql',
        'go',
        'rust',
        'other',
      ],
    },
    {
      type: 'string',
      name: 'code',
      label: 'Code',
      required: true,
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'string',
      name: 'filename',
      label: 'Filename',
      description: 'Optional filename to display above the code',
    },
  ],
};

/**
 * Quote Block - Blockquote with attribution
 */
const quoteBlock: Template = {
  name: 'quote',
  label: 'Quote',
  fields: [
    {
      type: 'string',
      name: 'quote',
      label: 'Quote',
      required: true,
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'string',
      name: 'author',
      label: 'Author',
    },
    {
      type: 'string',
      name: 'source',
      label: 'Source',
      description: 'Book, article, or other source',
    },
  ],
};

/**
 * Callout Block - Note, tip, warning, important boxes
 */
const calloutBlock: Template = {
  name: 'callout',
  label: 'Callout',
  fields: [
    {
      type: 'string',
      name: 'type',
      label: 'Type',
      options: [
        { value: 'note', label: '📝 Note' },
        { value: 'tip', label: '💡 Tip' },
        { value: 'warning', label: '⚠️ Warning' },
        { value: 'important', label: '❗ Important' },
      ],
      required: true,
    },
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      description: 'Optional custom title',
    },
    {
      type: 'rich-text',
      name: 'content',
      label: 'Content',
      required: true,
    },
  ],
};

/**
 * Embed Block - Social media and external embeds
 */
const embedBlock: Template = {
  name: 'embed',
  label: 'Embed',
  fields: [
    {
      type: 'string',
      name: 'type',
      label: 'Embed Type',
      options: [
        { value: 'twitter', label: 'Twitter/X' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'codepen', label: 'CodePen' },
        { value: 'generic', label: 'Generic Link Preview' },
      ],
      required: true,
    },
    {
      type: 'string',
      name: 'url',
      label: 'URL',
      description: 'Full URL to the embedded content',
      required: true,
    },
  ],
};

/**
 * Divider Block - Visual separator
 */
const dividerBlock: Template = {
  name: 'divider',
  label: 'Divider',
  fields: [
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      options: [
        { value: 'line', label: 'Line' },
        { value: 'dots', label: 'Dots' },
        { value: 'space', label: 'Space Only' },
      ],
    },
  ],
};

// =============================================================================
// TinaCMS Configuration
// =============================================================================

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.HEAD || 'main',

  // Required for TinaCloud - leave empty for local-only mode
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'media',
    },
  },

  schema: {
    collections: [
      // Pages collection for static pages (About, etc.)
      {
        name: 'page',
        label: 'Pages',
        path: 'src/content/pages',
        format: 'mdx',
        ui: {
          router: ({ document }) => {
            const slug = document._sys.filename;
            return `/${slug}`;
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            required: true,
            isTitle: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            description: 'SEO description (max 160 characters)',
            required: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'image',
            name: 'image',
            label: 'Page Image',
            description: 'Optional image for the page',
          },
          {
            type: 'object',
            list: true,
            name: 'blocks',
            label: 'Content Blocks',
            description: 'Build your page with draggable content blocks',
            templates: [
              contentBlock,
              imageBlock,
              videoBlock,
              codeBlock,
              quoteBlock,
              calloutBlock,
              embedBlock,
              dividerBlock,
            ],
          },
        ],
      },
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'mdx',

        // Match files inside subdirectories (YYYY-MM-DD-slug/index.mdx)
        match: {
          include: '**/index',
        },

        ui: {
          // Enable visual editing router
          router: ({ document }) => {
            // Extract URL parts from relativePath: YYYY-MM-DD-slug/index
            const relativePath = document._sys.relativePath || '';
            const dirName = relativePath.replace('/index.mdx', '').replace('/index', '');
            const match = dirName.match(/^(\d{4})-(\d{2})-\d{2}-(.+)$/);
            if (match) {
              const [, year, month, slug] = match;
              return `/${year}/${month}/${slug}`;
            }
            return '/';
          },
          filename: {
            readonly: true,
            slugify: (values) => {
              const date = values?.pubDate
                ? new Date(values.pubDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
              const slug = values?.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
                || 'untitled';
              return `${date}-${slug}/index`;
            },
          },
        },

        fields: [
          // Post metadata fields
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            required: true,
            isTitle: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            description: 'SEO description (max 160 characters)',
            required: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'datetime',
            name: 'pubDate',
            label: 'Publish Date',
            required: true,
          },
          {
            type: 'datetime',
            name: 'updatedDate',
            label: 'Updated Date',
          },
          {
            type: 'image',
            name: 'heroImage',
            label: 'Hero Image',
            description: 'Recommended: 1200x630px for social sharing',
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
          },
          {
            type: 'boolean',
            name: 'draft',
            label: 'Draft',
            description: 'Draft posts are hidden in production',
          },

          // Block-based content - primary editing method
          {
            type: 'object',
            list: true,
            name: 'blocks',
            label: 'Content Blocks',
            description: 'Build your post with draggable content blocks',
            templates: [
              contentBlock,
              imageBlock,
              videoBlock,
              codeBlock,
              quoteBlock,
              calloutBlock,
              embedBlock,
              dividerBlock,
            ],
          },
        ],
      },
    ],
  },
});
