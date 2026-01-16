import { defineConfig } from 'tinacms';

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
      mediaRoot: 'media', // Use existing /public/media/ folder
    },
  },

  schema: {
    collections: [
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
          filename: {
            readonly: true,
            slugify: (values) => {
              // Generate directory name: YYYY-MM-DD-slug
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
          {
            type: 'rich-text',
            name: 'body',
            label: 'Content',
            isBody: true,
            templates: [
              // YouTube embed
              {
                name: 'YouTube',
                label: 'YouTube Video',
                fields: [
                  {
                    type: 'string',
                    name: 'url',
                    label: 'YouTube URL',
                    description: 'Full YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)',
                    required: true,
                  },
                ],
              },
              // Vimeo embed
              {
                name: 'Vimeo',
                label: 'Vimeo Video',
                fields: [
                  {
                    type: 'string',
                    name: 'url',
                    label: 'Vimeo URL',
                    description: 'Full Vimeo URL (e.g., https://vimeo.com/VIDEO_ID)',
                    required: true,
                  },
                ],
              },
              // Callout box
              {
                name: 'Callout',
                label: 'Callout',
                fields: [
                  {
                    type: 'string',
                    name: 'type',
                    label: 'Type',
                    options: ['note', 'tip', 'warning', 'important'],
                    required: true,
                  },
                  {
                    type: 'rich-text',
                    name: 'content',
                    label: 'Content',
                    required: true,
                  },
                ],
              },
              // Local video
              {
                name: 'Video',
                label: 'Local Video',
                fields: [
                  {
                    type: 'string',
                    name: 'src',
                    label: 'Video Path',
                    description: 'Path to video (e.g., /media/video.mp4)',
                    required: true,
                  },
                  {
                    type: 'boolean',
                    name: 'autoplay',
                    label: 'Autoplay (muted)',
                  },
                  {
                    type: 'boolean',
                    name: 'loop',
                    label: 'Loop',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
