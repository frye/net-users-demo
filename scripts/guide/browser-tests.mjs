import assert from 'node:assert/strict';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { createServer } from 'node:http';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { guideDirectory } from '../build-workshop-guide.mjs';
import { clients, steps, templates } from '../../docs/workshops/copilot-across-platforms/content.mjs';

// Standard-library CDP fallback: no npm install, personal browser profile, or external service.
async function findBrowser() {
  const candidates = process.env.WORKSHOP_BROWSER ? [process.env.WORKSHOP_BROWSER] : [
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/microsoft-edge',
  ];
  for (const executable of candidates) {
    try { await access(executable, constants.X_OK); return executable; } catch { /* Try an installed alternative. */ }
  }
  throw new Error('Browser gate unavailable: no installed Chromium/Edge/Chrome. Set WORKSHOP_BROWSER to an approved existing executable. No packages or browsers were installed.');
}

function connect(browser) {
  let counter = 0;
  let buffer = '';
  let diagnostics = '';
  const pending = new Map();
  const exceptions = [];
  const requests = [];
  browser.stderr.on('data', data => { diagnostics = (diagnostics + data.toString()).slice(-4000); });
  browser.stdio[4].on('data', data => {
    buffer += data.toString();
    let boundary;
    while ((boundary = buffer.indexOf('\0')) !== -1) {
      const text = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 1);
      if (!text) continue;
      const message = JSON.parse(text);
      if (message.id) {
        const item = pending.get(message.id);
        if (!item) continue;
        pending.delete(message.id);
        clearTimeout(item.timer);
        if (message.error) item.reject(new Error(`${item.method}: ${message.error.message}`));
        else item.resolve(message.result);
      } else if (message.method === 'Runtime.exceptionThrown') {
        exceptions.push(message.params.exceptionDetails.text);
      } else if (message.method === 'Network.requestWillBeSent') {
        requests.push(message.params.request.url);
      }
    }
  });
  const fail = error => {
    for (const item of pending.values()) { clearTimeout(item.timer); item.reject(error); }
    pending.clear();
  };
  browser.on('error', fail);
  browser.on('exit', code => fail(new Error(`Browser exited (${code}). ${diagnostics}`)));
  browser.stdio[3].on('error', fail);
  return {
    exceptions, requests,
    send(method, params = {}, sessionId) {
      const id = ++counter;
      return new Promise((resolveRequest, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`Browser command timed out: ${method}. ${diagnostics}`));
        }, 20000);
        pending.set(id, { resolve: resolveRequest, reject, timer, method });
        browser.stdio[3].write(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }) + '\0');
      });
    },
  };
}

export async function browserTests() {
  const executable = await findBrowser();
  const profile = resolve(fileURLToPath(new URL('./', import.meta.url)), `.browser-profile-${process.pid}`);
  await mkdir(profile);
  const allowed = new Set(['index.html', 'guide.css', 'guide.js', 'guide.md', ...Object.values(templates).map(template => template.file)]);
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, 'http://localhost').pathname;
      const name = pathname.replace(/^\/net-users-demo\//, '').replace(/^\//, '') || 'index.html';
      if (name === 'favicon.ico') { response.writeHead(204); response.end(); return; }
      if (!allowed.has(name)) { response.writeHead(404); response.end('Not found'); return; }
      const types = { html: 'text/html', css: 'text/css', js: 'text/javascript', md: 'text/plain' };
      response.setHeader('Content-Type', `${types[name.split('.').at(-1)]}; charset=utf-8`);
      response.end(await readFile(join(guideDirectory, name)));
    } catch { response.writeHead(500); response.end('Read failure'); }
  });
  let browser;
  let connection;
  try {
    await new Promise((resolveListen, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolveListen);
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = spawn(executable, [
      '--headless=new', '--disable-gpu', '--disable-extensions', '--disable-sync',
      '--disable-background-networking', '--no-first-run', '--no-default-browser-check',
      '--remote-debugging-pipe', `--user-data-dir=${profile}`, 'about:blank',
    ], { stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'] });
    connection = connect(browser);
    const version = await connection.send('Browser.getVersion');
    const { targetId } = await connection.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await connection.send('Target.attachToTarget', { targetId, flatten: true });
    const send = (method, params) => connection.send(method, params, sessionId);
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    const evaluate = async (expression, extra = {}) => {
      const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, ...extra });
      if (response.exceptionDetails) throw new Error(`Browser evaluation: ${response.exceptionDetails.exception?.description ?? response.exceptionDetails.text}`);
      return response.result.value;
    };
    const until = async (expression, label) => {
      for (let attempt = 0; attempt < 100; attempt++) {
        try { if (await evaluate(expression)) return; } catch (error) {
          if (!/context|navigat/i.test(error.message)) throw error;
        }
        await delay(50);
      }
      throw new Error(`Browser condition timed out: ${label}`);
    };
    const check = async (expression, label) => assert(await evaluate(expression), label);
    const go = async (url, enhanced = true) => {
      const result = await send('Page.navigate', { url });
      assert(!result.errorText, result.errorText);
      await until(`location.href === ${JSON.stringify(url)} && document.readyState === 'complete'${enhanced ? " && document.documentElement.classList.contains('enhanced')" : ''}`, `load ${url}`);
    };
    const visible = `Array.from(document.querySelectorAll('[role="tabpanel"]')).filter(p => getComputedStyle(p).display !== 'none')`;
    const selected = id => `Array.from(document.querySelectorAll('[role="tab"][aria-selected="true"]')).every(t => t.dataset.client === '${id}')`;
    await go(`${origin}/`);
    await check(`${visible}.length === 7`, 'Seven active panels after enhancement');
    await check(`getComputedStyle(document.body).backgroundColor === 'rgb(13, 17, 23)'`, 'GitHub-style dark background at artifact root');
    await check(`getComputedStyle(document.documentElement).colorScheme === 'dark'`, 'Native controls use dark color scheme');
    const contrast = await evaluate(`(() => {
      const luminance = color => {
        const values = color.match(/[\\d.]+/g).slice(0, 3).map(Number).map(value => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
      };
      return ['body', '.subtitle', '.hero-note', '.navigation a', '.notice', '.step-heading p',
        '.step-number', '.mode', '.limitations', '.fallback', '.command-title', 'pre',
        '.copy-button', '.source-date', '[role="tab"][aria-selected="true"]', '[role="tab"][aria-selected="false"]']
        .map(selector => {
          const element = document.querySelector(selector);
          let parent = element;
          while (parent && getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)') parent = parent.parentElement;
          const foreground = luminance(getComputedStyle(element).color);
          const background = luminance(getComputedStyle(parent || document.body).backgroundColor);
          return { selector, ratio: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05) };
        });
    })()`);
    for (const sample of contrast) assert(sample.ratio >= 4.5, `${sample.selector} text contrast ${sample.ratio.toFixed(2)} must be at least 4.5:1`);
    for (const step of steps) {
      for (const client of clients) {
        await evaluate(`document.getElementById('${step.id}-tab-${client.id}').click()`);
        await check(`${selected(client.id)} && location.hash === '#${step.id}-${client.id}' && !document.getElementById('${step.id}-${client.id}').hidden`,
          `Tab and hash: ${step.id}/${client.id}`);
      }
    }
    const key = async (value, code) => {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: value, code: value, windowsVirtualKeyCode: code });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: value, code: value, windowsVirtualKeyCode: code });
    };
    await evaluate(`document.getElementById('access-tab-vscode').click()`);
    for (const [value, code, expected] of [
      ['ArrowRight', 39, 'cli'], ['ArrowLeft', 37, 'vscode'],
      ['ArrowLeft', 37, 'mobile'], ['Home', 36, 'vscode'], ['End', 35, 'mobile'],
    ]) {
      await key(value, code);
      await check(`${selected(expected)} && document.activeElement.id === 'access-tab-${expected}'`, `Keyboard ${value}`);
    }
    await check(`getComputedStyle(document.activeElement).outlineStyle !== 'none'`, 'Visible keyboard focus');
    await evaluate(`document.querySelector('[data-step="plan"]').click()`);
    await until(`location.hash === '#plan-mobile'`, 'Selected client follows step link');
    await send('Page.reload');
    await until(`document.readyState === 'complete' && document.documentElement.classList.contains('enhanced')`, 'Reload');
    await check(selected('mobile'), 'Deep-link reload preserves client');
    await go(`${origin}/net-users-demo/`);
    await check(selected('mobile'), 'Client persists without hash at repository base path');
    await check(`getComputedStyle(document.body).backgroundColor === 'rgb(13, 17, 23)'`, 'Dark assets load at repository base path');
    await go(`${origin}/net-users-demo/#implement-app`);
    await check(selected('app'), 'Explicit hash overrides stored client');
    await evaluate(`document.getElementById('implement-tab-cli').click(); history.back()`);
    await until(`location.hash === '#implement-app' && ${selected('app')}`, 'Back navigation updates panels');
    await go(`${origin}/net-users-demo/#%E0%A4%A`);
    await check(`${visible}.length === 7`, 'Malformed hash does not break enhancement');

    const deniedStorage = await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } });`,
    });
    await go(`${origin}/net-users-demo/#finish-cli`);
    await check(selected('cli'), 'Tabs and hash work when storage is denied');
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: deniedStorage.identifier });

    await evaluate(`Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText: async text => {window.copiedText = text;}}});
      document.querySelector('[data-copy]').click();`);
    await until(`document.querySelector('.copy-status').textContent === 'Copied to clipboard.'`, 'Copy success feedback after resolved API');
    await check(`window.copiedText === document.getElementById(document.querySelector('[data-copy]').dataset.copy).textContent`, 'Copied command is exact');
    await evaluate(`Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText: async () => {throw new Error('Denied');}}});
      document.querySelector('[data-copy]').click();`);
    await until(`document.querySelector('.copy-status').textContent.startsWith('Copy unavailable.')`, 'Denied clipboard is reported truthfully');
    await check(`window.getSelection().toString() === document.getElementById(document.querySelector('[data-copy]').dataset.copy).textContent`, 'Manual copy fallback selects command');
    await evaluate(`Object.defineProperty(navigator, 'clipboard', {configurable:true, value:undefined}); document.querySelector('[data-copy]').click();`);
    await until(`document.querySelector('.copy-status').textContent.startsWith('Copy unavailable.')`, 'Missing clipboard fallback');

    for (const width of [320, 375, 768, 1440]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 });
      await check(`document.documentElement.scrollWidth <= ${width}`, `No page overflow at ${width}px`);
      await check(`Array.from(document.querySelectorAll('[role="tablist"]')).every(t => t.clientWidth > 0 && t.scrollWidth >= t.clientWidth)`, 'Tab rows remain reachable');
    }
    if (process.env.WORKSHOP_SCREENSHOTS) {
      const directory = resolve(process.env.WORKSHOP_SCREENSHOTS);
      await mkdir(directory, { recursive: true });
      for (const [name, width, height, hash] of [
        ['workshop-dark-recovery-desktop.png', 1440, 1100, 'checkpoints'],
        ['workshop-dark-mobile.png', 390, 1000, 'delegate-cli'],
      ]) {
        await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
        await go(`${origin}/#${hash}`);
        await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
        const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        await writeFile(join(directory, name), Buffer.from(screenshot.data, 'base64'));
      }
    }
    await send('Emulation.setEmulatedMedia', { media: 'print' });
    await check(`${visible}.length === 35`, 'Print reveals all client panels');
    await check(`Array.from(document.querySelectorAll('[role="tablist"],[data-copy]')).every(e => getComputedStyle(e).display === 'none')`, 'Print hides interactive controls');
    await check(`getComputedStyle(document.body).backgroundColor === 'rgb(255, 255, 255)' && getComputedStyle(document.querySelector('pre')).color === 'rgb(0, 0, 0)'`, 'Print uses readable black text on light surfaces');
    await check(`getComputedStyle(document.querySelector('.step')).backgroundColor === 'rgb(255, 255, 255)'`, 'Print does not retain dark panel backgrounds');
    await send('Emulation.setEmulatedMedia', { media: '' });
    await check(`${visible}.length === 7`, 'Screen selection restored after print');
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await check(`matchMedia('(prefers-reduced-motion: reduce)').matches`, 'Reduced-motion media supported');
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    await check(`getComputedStyle(document.querySelector('[role="tab"][aria-selected="true"]')).borderTopWidth === '3px'`, 'Forced-colors selected tab remains identifiable');
    await send('Emulation.setEmulatedMedia', { features: [] });
    await send('Emulation.clearDeviceMetricsOverride');

    const fileUrl = pathToFileURL(join(guideDirectory, 'index.html')).href;
    await go(`${fileUrl}#monitor-mobile`);
    await check(`${selected('mobile')} && ${visible}.length === 7`, 'Local file tabs and deep-link');
    await check(`getComputedStyle(document.body).backgroundColor === 'rgb(13, 17, 23)'`, 'Local file dark stylesheet');
    await send('Emulation.setScriptExecutionDisabled', { value: true });
    await go(`${origin}/net-users-demo/`, false);
    await check(`${visible}.length === 35`, 'No-JS reveals all 35 panels');
    await check(`Array.from(document.querySelectorAll('[role="tablist"],[data-copy]')).every(e => getComputedStyle(e).display === 'none')`, 'No-JS hides unusable controls');
    await go(fileUrl, false);
    await check(`${visible}.length === 35`, 'No-JS local file reveals all content');
    assert.equal(connection.exceptions.length, 0, 'No uncaught browser JavaScript errors');
    assert(connection.requests.every(url => url.startsWith(origin) || url.startsWith('file:') || url === 'about:blank'), 'No external page asset/network requests');
    console.log(`PASS browser (${version.product}): dark theme with 4.5:1+ text contrast, root/base/file loading, 35 tabs, keyboard/focus, history/storage, clipboard, 320–1440px, light print, no-JS, reduced motion, forced colors, no external requests.`);
    console.log('Browser scope is the static guide only; clipboard API outcomes were controlled in-browser. No Copilot client or live cloud task was rehearsed.');
  } finally {
    if (browser && browser.exitCode === null) {
      if (connection) await connection.send('Browser.close').catch(() => {});
      if (browser.exitCode === null) {
        await Promise.race([new Promise(resolveExit => browser.once('exit', resolveExit)), delay(3000)]);
      }
      if (browser.exitCode === null) browser.kill('SIGTERM');
      if (browser.exitCode === null) await new Promise(resolveExit => browser.once('exit', resolveExit));
    }
    if (server.listening) await new Promise(resolveClose => server.close(resolveClose));
    await rm(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }
}
