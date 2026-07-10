import test from 'node:test';
import assert from 'node:assert/strict';
import { getAbsoluteUrl, getPostUrl } from '../src/utils/url.js';

test('getPostUrl generates expected path', () => {
  const result = getPostUrl('post', new Date('2024-05-13'));
  assert.equal(result, '/2024/05/post');
});

test('getPostUrl keeps UTC calendar dates stable west of UTC', () => {
  const previousTimeZone = process.env.TZ;
  process.env.TZ = 'America/Los_Angeles';

  try {
    const result = getPostUrl('july-post', new Date('2026-07-01T00:00:00.000Z'));
    assert.equal(result, '/2026/07/july-post');
  } finally {
    if (previousTimeZone === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = previousTimeZone;
    }
  }
});

test('getAbsoluteUrl joins site paths without doubled slashes', () => {
  assert.equal(
    getAbsoluteUrl('/about', new URL('https://hashir.blog/')),
    'https://hashir.blog/about',
  );
  assert.equal(
    getAbsoluteUrl('/', new URL('https://hashir.blog/')),
    'https://hashir.blog/',
  );
});
