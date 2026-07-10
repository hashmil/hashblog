import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesSearch, normaliseSearchText } from '../src/utils/search.js';

test('normaliseSearchText retains body-only terms while removing MDX markup', () => {
  const body = `
import { YouTube } from "@astro-community/astro-embed-youtube";

## A heading

The searchable body mentions chromesthesia, which is absent from its metadata.

<YouTube id="example" />
`;

  const searchText = normaliseSearchText(body);

  assert.match(searchText, /chromesthesia/);
  assert.doesNotMatch(searchText, /astro-community|<youtube|##/i);
  assert.equal(
    matchesSearch(
      {
        title: 'A generic title',
        description: 'A generic description',
        tags: ['design'],
        searchText,
      },
      'chromesthesia',
    ),
    true,
  );
});
