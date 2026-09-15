import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { meta, clients, commands, templates, overview, steps, closing, sources } from '../docs/workshops/copilot-across-platforms/content.mjs';

export const guideDirectory = fileURLToPath(new URL('../docs/workshops/copilot-across-platforms/', import.meta.url));
export const fields = [
  ['navigation', 'Navigate'],
  ['actions', 'Act'],
  ['evidence', 'Expected evidence'],
  ['checkpoint', 'Checkpoint'],
  ['limitations', 'Limitations'],
  ['fallback', 'Fallback'],
];
const escape = text => String(text).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const paragraph = text => `<p>${escape(text)}</p>`;
const list = items => `<ul>\n${items.map(item => `<li>${escape(item)}</li>`).join('\n')}\n</ul>`;
const links = items => `<ul>${items.map(item => `<li><a href="${escape(item.url)}">${escape(item.title)}</a></li>`).join('\n')}</ul>`;
const sourceMap = new Map(sources.map(source => [source.id, source]));

export function validateContent() {
  if (steps.length !== 7 || clients.length !== 5) throw new Error('Expected seven steps and five clients.');
  const ids = [...overview, ...steps, ...closing].map(item => item.id).concat(sources.map(item => `source-${item.id}`));
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate content IDs.');
  for (const step of steps) {
    if (Object.keys(step.panels).length !== clients.length) throw new Error(`Incomplete step ${step.id}`);
    for (const client of clients) {
      const panel = step.panels[client.id];
      for (const [field] of fields) {
        if (!Array.isArray(panel?.[field]) || !panel[field].length || panel[field].some(text => typeof text !== 'string' || text.length < 40)) {
          throw new Error(`Missing detailed ${field}: ${step.id}/${client.id}`);
        }
      }
      for (const id of panel.commands ?? []) if (!commands[id]) throw new Error(`Unknown command ${id}`);
      if (panel.template && !templates[panel.template]) throw new Error(`Unknown template ${panel.template}`);
    }
  }
  for (const item of [...overview, ...closing, ...steps.flatMap(step => Object.values(step.panels))]) {
    for (const id of item.sources ?? []) if (!sourceMap.has(id)) throw new Error(`Unknown source ${id}`);
  }
}

export function renderOutputs() {
  validateContent();
  let codeIndex = 0;
  const code = (title, text) => {
    const id = `command-${++codeIndex}`;
    return `<div class="command"><p class="command-title" id="${id}-title">${escape(title)}</p>
<pre id="${id}" tabindex="0" aria-labelledby="${id}-title"><code>${escape(text)}</code></pre>
<button type="button" class="copy-button" data-copy="${id}" aria-label="Copy: ${escape(title)}" hidden>Copy</button>
<p class="copy-status" role="status" aria-live="polite"></p></div>`;
  };
  const commandBlocks = ids => (ids ?? []).map(id => code(commands[id].title, commands[id].text)).join('\n');
  const citations = ids => ids?.length ? `<div class="citations"><h4>Official public sources</h4>${links(ids.map(id => sourceMap.get(id)))}</div>` : '';
  const table = value => `<div class="table-wrap" role="region" aria-label="${escape(value.headers.join(', '))}" tabindex="0"><table>
<thead><tr>${value.headers.map(header => `<th scope="col">${escape(header)}</th>`).join('')}</tr></thead>
<tbody>${value.rows.map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join('')}</tr>`).join('\n')}</tbody>
</table></div>`;
  const block = item => `<section class="overview-section" id="${item.id}" aria-labelledby="${item.id}-title">
<h2 id="${item.id}-title">${escape(item.title)}</h2>
${(item.paragraphs ?? []).map(paragraph).join('\n')}
${item.bullets ? list(item.bullets) : ''}
${item.table ? table(item.table) : ''}
${commandBlocks(item.commands)}
${item.links ? links(item.links) : ''}
${citations(item.sources)}
</section>`;
  const stepHtml = (step, index) => `<section class="step" id="${step.id}" aria-labelledby="${step.id}-title">
<div class="step-heading"><span class="step-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
<div><h2 id="${step.id}-title">${escape(step.title)}</h2><p>${escape(step.outcome)}</p></div></div>
<div class="client-tabs" role="tablist" aria-label="${escape(step.title)} — choose a client" hidden>
${clients.map((client, clientIndex) => `<button type="button" role="tab" id="${step.id}-tab-${client.id}" aria-controls="${step.id}-${client.id}" aria-selected="${clientIndex === 0}" tabindex="${clientIndex === 0 ? 0 : -1}" data-client="${client.id}">${escape(client.name)}</button>`).join('\n')}
</div>
${clients.map(client => {
    const panel = step.panels[client.id];
    return `<article class="client-panel" role="tabpanel" id="${step.id}-${client.id}" aria-labelledby="${step.id}-tab-${client.id}" tabindex="0" data-client="${client.id}">
<h3>${escape(client.name)}</h3><p class="mode">${escape(panel.mode)}</p>
${fields.map(([field, title]) => `<div class="panel-field ${field}"><h4>${title}</h4>${list(panel[field])}</div>`).join('\n')}
${commandBlocks(panel.commands)}
${panel.template ? code(templates[panel.template].title, templates[panel.template].text) : ''}
${citations(panel.sources)}
<a class="permalink" href="#${step.id}-${client.id}">Link to ${escape(step.title)} / ${escape(client.name)}</a>
</article>`;
  }).join('\n')}
</section>`;
  const html = `<!doctype html>
<!-- Generated by scripts/build-workshop-guide.mjs from content.mjs. Do not edit generated files. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${escape(meta.subtitle)}">
<meta name="color-scheme" content="light">
<title>${escape(meta.title)} — DELETE workshop</title>
<link rel="stylesheet" href="./guide.css">
<script src="./guide.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to guide</a>
<header class="hero">
<div class="hero-inner"><p class="eyebrow">A practical, 60-minute workshop</p>
<h1>${escape(meta.title)}</h1><p class="subtitle">${escape(meta.subtitle)}</p>
<div class="hero-links"><a href="${meta.repo}">Public sample repository</a><a href="./guide.md">All-client Markdown guide</a><a href="#templates">Task &amp; handoff templates</a></div>
<p class="hero-note">One task, not five implementations. Choose a client at each step or stay in the one you prefer.</p></div>
</header>
<div class="layout">
<aside class="navigation"><nav aria-label="Workshop navigation">
<p class="eyebrow">Your route</p>
<a href="#start">Prework &amp; access gates</a>
<a href="#exercise">The DELETE contract</a>
<a href="#run-of-show">60-minute run of show</a>
<a href="#checkpoints">C0–C4 checkpoints</a>
<ol>${steps.map(step => `<li><a href="#${step.id}" data-step="${step.id}">${escape(step.title)}</a></li>`).join('\n')}</ol>
<a href="#templates">Copyable templates</a><a href="#recovery">Recovery &amp; evidence gates</a><a href="#sources">Public sources</a>
</nav><p class="navigation-tip">Client tabs: Left / Right, Home / End. Your chosen client carries across steps and reloads when browser storage is available.</p>
<button type="button" id="print-guide" hidden>Print all clients</button></aside>
<main id="main" tabindex="-1">
<div class="notice"><strong>Know which gate you passed.</strong><p>${escape(meta.status)}</p><p>Documentation checked ${meta.verified}. Deployment target: <span class="breakable">${escape(meta.deployment)}</span></p></div>
<noscript><p class="notice">JavaScript is off. All 35 client panels and commands are visible below. Select command text manually to copy. Print also includes all clients.</p></noscript>
${overview.map(block).join('\n')}
<div class="journey-heading"><p class="eyebrow">The seven-step journey</p><p>Each tab gives navigation, actions, evidence, a checkpoint, limitations and a fallback. Operation labels tell you where work actually runs.</p></div>
${steps.map(stepHtml).join('\n')}
<section class="overview-section" id="templates" aria-labelledby="templates-title">
<h2 id="templates-title">Task and handoff templates</h2>
<p>Replace every placeholder before use. Fill checkout paths locally only; redact them before sharing with cloud or in public. Copy buttons report failure honestly—manual selection always works.</p>
${Object.values(templates).map(template => `<h3>${escape(template.title)}</h3><p><a href="./${template.file}">Download ${escape(template.file)}</a></p>${code(template.title, template.text)}`).join('\n')}
</section>
${closing.map(block).join('\n')}
<section class="overview-section" id="sources" aria-labelledby="sources-title"><h2 id="sources-title">Official public sources</h2>
<p>Reviewed ${meta.verified}. Public documentation describes available capabilities; it is not an installed-version or live-session rehearsal. Recheck client UI and policy before presenting.</p>
<ul>${sources.map(source => `<li id="source-${source.id}"><a href="${escape(source.url)}">${escape(source.title)}</a> <span class="source-date">— checked ${source.verified}</span></li>`).join('\n')}</ul>
</section>
</main></div>
<footer><p>${escape(meta.title)} · One task, one next writer, one evidence trail.</p><p>No login or external page assets. Print and Markdown include every client.</p></footer>
</body>
</html>
`;
  const mdCode = (title, text, language = 'text') => `**${title}**\n\n\`\`\`${language}\n${text}\n\`\`\`\n`;
  const mdCommands = ids => (ids ?? []).map(id => mdCode(commands[id].title, commands[id].text, commands[id].language)).join('\n');
  const mdSources = ids => ids?.length ? `**Official public sources:** ${ids.map(id => `[${sourceMap.get(id).title}](${sourceMap.get(id).url})`).join(' · ')}\n` : '';
  const mdTable = value => `| ${value.headers.join(' | ')} |\n| ${value.headers.map(() => '---').join(' | ')} |\n${value.rows.map(row => `| ${row.join(' | ')} |`).join('\n')}\n`;
  const mdBlock = item => `<a id="${item.id}"></a>\n\n## ${item.title}\n\n${(item.paragraphs ?? []).join('\n\n')}\n\n${item.bullets ? item.bullets.map(text => `- ${text}`).join('\n') + '\n\n' : ''}${item.table ? mdTable(item.table) + '\n' : ''}${mdCommands(item.commands)}${item.links ? item.links.map(link => `- [${link.title}](${link.url})`).join('\n') + '\n\n' : ''}${mdSources(item.sources)}`;
  const markdown = `<!-- Generated by scripts/build-workshop-guide.mjs from content.mjs. -->
# ${meta.title}

${meta.subtitle}

[Interactive guide](./index.html) · [Public sample repository](${meta.repo}) · [Templates](#templates)

${meta.status}

Documentation checked ${meta.verified}. Deployment target: ${meta.deployment}

All 35 client panels are included below. Choose one client throughout or follow the timed path. No Node or sign-in is needed to read this guide.

## Contents

${overview.map(item => `- [${item.title}](#${item.id})`).join('\n')}
${steps.map((step, index) => `- [${index + 1}. ${step.title}](#${step.id})`).join('\n')}
- [Task and handoff templates](#templates)
- [Recovery and evidence gates](#recovery)
- [Official sources](#sources)

${overview.map(mdBlock).join('\n\n')}

${steps.map((step, index) => `<a id="${step.id}"></a>\n\n## ${index + 1}. ${step.title}\n\n${step.outcome}\n\n${clients.map(client => {
    const panel = step.panels[client.id];
    return `<a id="${step.id}-${client.id}"></a>\n\n### ${client.name}\n\n**${panel.mode}**\n\n${fields.map(([field, title]) => `#### ${title}\n\n${panel[field].map(text => `- ${text}`).join('\n')}`).join('\n\n')}\n\n${mdCommands(panel.commands)}${panel.template ? mdCode(templates[panel.template].title, templates[panel.template].text) : ''}${mdSources(panel.sources)}`;
  }).join('\n\n')}`).join('\n\n')}

<a id="templates"></a>

## Task and handoff templates

Replace every placeholder before use. Keep checkout paths locally only; redact them before public/cloud sharing.

${Object.values(templates).map(template => `### ${template.title}\n\n[Download ${template.file}](./${template.file})\n\n${mdCode(template.title, template.text)}`).join('\n')}

${closing.map(mdBlock).join('\n\n')}

<a id="sources"></a>

## Official public sources

Reviewed ${meta.verified}; not an installed-client or live cloud rehearsal.

${sources.map(source => `- [${source.title}](${source.url}) — checked ${source.verified}`).join('\n')}
`;
  return new Map([
    ['index.html', html],
    ['guide.md', markdown],
    ...Object.values(templates).map(template => [template.file,
      `<!-- Generated from content.mjs. Replace placeholders; redact private paths before public/cloud sharing. -->\n# ${template.title}\n\n\`\`\`text\n${template.text}\n\`\`\`\n`]),
  ]);
}

export async function build({ check = false } = {}) {
  const outputs = renderOutputs();
  const stale = [];
  for (const [name, content] of outputs) {
    const path = resolve(guideDirectory, name);
    if (check) {
      const existing = await readFile(path, 'utf8').catch(error => {
        if (error.code === 'ENOENT') return null;
        throw error;
      });
      if (existing !== content) stale.push(name);
    } else {
      await writeFile(path, content, 'utf8');
    }
  }
  if (stale.length) throw new Error(`Generated guide is stale or missing: ${stale.join(', ')}. Run node scripts/build-workshop-guide.mjs`);
  return outputs.size;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.slice(2).some(arg => arg !== '--check')) throw new Error('Usage: node scripts/build-workshop-guide.mjs [--check]');
    const count = await build({ check: process.argv.includes('--check') });
    console.log(`${process.argv.includes('--check') ? 'Checked' : 'Generated'} ${count} deterministic guide files (7 steps × 5 clients).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
