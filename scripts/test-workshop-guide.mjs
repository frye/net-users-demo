import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { build, renderOutputs, guideDirectory, fields } from './build-workshop-guide.mjs';
import { clients, steps, templates, sources, commands } from '../docs/workshops/copilot-across-platforms/content.mjs';

async function structuralTests() {
  await build({ check: true });
  const outputs = renderOutputs();
  assert.deepEqual(outputs, renderOutputs(), 'Build output must be byte-deterministic.');
  const html = outputs.get('index.html');
  const markdown = outputs.get('guide.md');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Every HTML ID must be unique.');
  assert.equal((html.match(/role="tabpanel"/g) ?? []).length, 35);
  assert.equal((html.match(/role="tablist"/g) ?? []).length, 7);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 35);
  assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 7);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<a class="skip-link" href="#main">/);
  assert.doesNotMatch(html, /<article[^>]*\shidden/);
  assert.doesNotMatch(html, /<base\b|<iframe\b|<form\b|on(?:click|load)=/i);
  const escape = text => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  for (const step of steps) {
    for (const client of clients) {
      const id = `${step.id}-${client.id}`;
      const tabId = `${step.id}-tab-${client.id}`;
      assert(html.includes(`id="${tabId}" aria-controls="${id}"`), `Tab controls ${id}`);
      assert(html.includes(`id="${id}" aria-labelledby="${tabId}"`), `Panel names ${tabId}`);
      assert(markdown.includes(`<a id="${id}"></a>`), `Markdown deep-link ${id}`);
      const panel = step.panels[client.id];
      assert(panel.sources.length > 0, `Citations required: ${id}`);
      for (const [field] of fields) {
        for (const text of panel[field]) {
          assert(html.includes(escape(text)), `HTML content parity: ${id}/${field}`);
          assert(markdown.includes(text), `Markdown content parity: ${id}/${field}`);
        }
      }
    }
  }
  for (const [, template] of Object.entries(templates)) {
    assert(outputs.get(template.file).includes(template.text));
    assert(html.includes(escape(template.text)), 'HTML template parity');
    assert(markdown.includes(template.text), 'Markdown template parity');
  }
  for (const match of html.matchAll(/\b(?:aria-controls|aria-labelledby)="([^"]+)"/g)) {
    for (const id of match[1].split(' ')) assert(ids.includes(id), `ARIA target ${id} exists`);
  }
  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = match[1];
    if (href.startsWith('#')) assert(ids.includes(href.slice(1)), `Anchor ${href} exists`);
    else if (href.startsWith('./')) await access(join(guideDirectory, href.slice(2)));
    else assert(href.startsWith('https://'), `Unexpected hyperlink: ${href}`);
  }
  for (const match of html.matchAll(/\bsrc="([^"]+)"/g)) {
    assert(match[1].startsWith('./'), 'Only relative, local script/assets allowed');
    await access(join(guideDirectory, match[1].slice(2)));
  }
  assert.deepEqual([...html.matchAll(/<link[^>]+href="([^"]+)"/g)].map(match => match[1]), ['./guide.css']);
  for (const [name, output] of outputs) {
    assert.doesNotMatch(output, /\/Users\/|\/home\/|[A-Z]:\\Users\\|gh copilot suggest|ghp_[A-Za-z0-9]+/, `No private paths, credentials or obsolete CLI instructions: ${name}`);
    assert.doesNotMatch(output, /9\.0\.120/, `No obsolete SDK pin: ${name}`);
  }
  assert.equal(new Set(sources.map(source => source.url)).size, sources.length);
  assert(commands.baseline.text.includes('node scripts/workshop/validate.mjs baseline'));
  assert(commands.baseline.text.includes("readFileSync('global.json', 'utf8')).sdk.version"), 'Read the authoritative SDK pin from global.json');
  assert(commands.local.text.includes('node scripts/workshop/validate.mjs local'));
  assert(commands.complete.text.includes('node scripts/workshop/validate.mjs complete'));
  assert.equal(commands.reference.text, 'node scripts/workshop/verify-reference.mjs <full-starter-commit-SHA>');
  assert(templates.task.text.includes('NetUsersApi.Tests.Infrastructure.UserStoreTest'));
  assert(templates.cloud.text.includes('UsersApiFactory (WebApplicationFactory)'));
  assert(html.includes('href="https://github.com/frye/net-users-demo/blob/main/workshop/reference/README.md"'), 'Recovery link works at the Pages artifact root');
  const css = await readFile(join(guideDirectory, 'guide.css'), 'utf8');
  const js = await readFile(join(guideDirectory, 'guide.js'), 'utf8');
  assert.match(css, /@media print/);
  assert.match(css, /\.client-panel\[hidden\]\s*\{\s*display:\s*block !important/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /forced-colors/);
  assert.doesNotMatch(css, /@import|url\s*\(/i, 'No external CSS resources');
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon|import\s*\(|document\.write|innerHTML/, 'No network/content injection in static enhancement');
  assert.match(js, /await navigator\.clipboard\.writeText/);
  assert.match(js, /Copy unavailable/);
  console.log('PASS structural: deterministic generated files, 35 detailed panels, source/template parity, ARIA targets, anchors, local-only assets, privacy and print/no-JS invariants.');
}

try {
  if (process.argv.slice(2).some(arg => arg !== '--browser')) throw new Error('Usage: node scripts/test-workshop-guide.mjs [--browser]');
  await structuralTests();
  if (process.argv.includes('--browser')) {
    const { browserTests } = await import('./guide/browser-tests.mjs');
    await browserTests();
  } else {
    console.log('Browser gate not requested. Run node scripts/test-workshop-guide.mjs --browser for actual browser automation.');
  }
} catch (error) {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
}
