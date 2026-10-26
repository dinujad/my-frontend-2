import assert from 'node:assert/strict';
import test from 'node:test';
import { getProductBySlug, getCategoryBySlug, getSitemapCatalog } from '../src/lib/products-data.ts';

test('only an explicit API 404 becomes a missing product or category', async () => {
  const original = globalThis.fetch;
  try {
    for (const lookup of [getProductBySlug, getCategoryBySlug]) {
      globalThis.fetch = async () => new Response('{}', { status: 404 });
      assert.equal(await lookup('missing'), undefined);
      globalThis.fetch = async () => new Response('{}', { status: 503 });
      await assert.rejects(() => lookup('existing'), /503/);
      globalThis.fetch = async () => { throw new Error('network down'); };
      await assert.rejects(() => lookup('existing'), /network down/);
      for (const body of ['[]', '{}', 'invalid-json']) {
        globalThis.fetch = async () => new Response(body);
        await assert.rejects(() => lookup('existing'));
      }
    }
  } finally { globalThis.fetch = original; }
});

test('sitemap keeps full catalogue or fails, including malformed and unavailable responses', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('[{"slug":"existing"}]');
    assert.equal((await getSitemapCatalog()).products[0].slug, 'existing');
    for (const status of [404, 429, 503]) {
      globalThis.fetch = async () => new Response('{}', { status });
      await assert.rejects(() => getSitemapCatalog());
    }
    for (const body of ['{}', '[{}]', '[null]', 'invalid-json']) {
      globalThis.fetch = async () => new Response(body);
      await assert.rejects(() => getSitemapCatalog());
    }
    globalThis.fetch = async () => new Response('[]');
    assert.deepEqual(await getSitemapCatalog(), { products: [], categories: [] });
  } finally { globalThis.fetch = original; }
});
