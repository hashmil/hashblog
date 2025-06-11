import test from 'node:test';
import assert from 'node:assert/strict';
import { getPostUrl } from '../src/utils/url.js';

test('getPostUrl generates expected path', () => {
  const result = getPostUrl('post', new Date('2024-05-13'));
  assert.equal(result, '/2024/05/post');
});
