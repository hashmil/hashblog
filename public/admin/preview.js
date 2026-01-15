import React from 'react';
import h from 'react-hyperscript';

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function calculateReadingTime(body) {
  const words = body.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

const BlogPostPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']);
    const description = entry.getIn(['data', 'description']);
    const pubDate = entry.getIn(['data', 'pubDate']);
    const updatedDate = entry.getIn(['data', 'updatedDate']);
    const heroImage = entry.getIn(['data', 'heroImage']);
    const tags = entry.getIn(['data', 'tags']);
    const body = entry.getIn(['data', 'body']);
    const widgetFor = this.props.widgetFor;

    return h('div', { className: 'preview-container' },
      heroImage && h('div', { className: 'preview-hero' },
        h('img', {
          src: heroImage,
          alt: title,
          className: 'preview-hero-image'
        })
      ),
      h('div', { className: 'preview-content' },
        h('nav', { className: 'preview-breadcrumb' },
          h('span', { className: 'preview-breadcrumb-text' }, '← Back to Blog')
        ),
        h('div', { className: 'preview-meta' },
          formatDate(pubDate),
          ' • ',
          calculateReadingTime(body),
          updatedDate && h('span', { className: 'preview-updated' },
            ' • Updated: ' + formatDate(updatedDate)
          )
        ),
        h('h1', { className: 'preview-title' }, title),
        description && h('div', { className: 'preview-description' }, description),
        h('div', { className: 'preview-body' }, widgetFor('body')),
        tags && tags.size > 0 && h('div', { className: 'preview-tags' },
          tags.map(tag => h('span', { className: 'preview-tag' }, tag))
        )
      )
    );
  }
});

CMS.registerPreviewTemplate('blog', BlogPostPreview);
