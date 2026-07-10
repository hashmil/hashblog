import test from 'node:test';
import assert from 'node:assert/strict';
import { pickDate, truncateDescription } from '../scripts/notion-blog.mjs';

test('pickDate prefers the Notion Date property over the creation time', () => {
  const page = {
    created_time: '2026-06-01T10:00:00.000Z',
    properties: {
      Date: {
        type: 'date',
        date: { start: '2026-07-01' },
      },
    },
  };

  assert.equal(pickDate(page), '2026-07-01');
});

test('pickDate falls back to the page creation date', () => {
  assert.equal(
    pickDate({ created_time: '2026-06-01T10:00:00.000Z', properties: {} }),
    '2026-06-01',
  );
});

test('truncateDescription keeps exported descriptions within 160 characters', () => {
  const description = truncateDescription('word '.repeat(50));

  assert.ok(description.length <= 160);
  assert.match(description, /…$/);
});
