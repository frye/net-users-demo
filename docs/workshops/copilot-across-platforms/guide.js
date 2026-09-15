(() => {
  'use strict';
  const storageKey = 'copilot-across-platforms.client.v1';
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const clients = Array.from(new Set(tabs.map(tab => tab.dataset.client)));
  let selected = clients[0];
  try {
    const stored = localStorage.getItem(storageKey);
    if (clients.includes(stored)) selected = stored;
  } catch {
    // file: pages and restricted browsers may deny storage.
  }

  function hashPanel() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return undefined; }
    return panels.find(panel => panel.id === id);
  }

  function select(client, tab) {
    if (!clients.includes(client)) return;
    selected = client;
    for (const item of tabs) {
      const active = item.dataset.client === selected;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.dataset.client !== selected;
    for (const link of document.querySelectorAll('[data-step]')) {
      link.setAttribute('href', `#${link.dataset.step}-${selected}`);
    }
    try { localStorage.setItem(storageKey, selected); } catch { /* Best-effort preference only. */ }
    if (tab) tab.focus({ preventScroll: true });
  }

  function activate(tab) {
    select(tab.dataset.client, tab);
    const id = tab.getAttribute('aria-controls');
    if (location.hash !== `#${id}`) {
      try { history.pushState(null, '', `#${id}`); } catch { location.hash = id; }
    }
  }

  for (const tablist of document.querySelectorAll('[role="tablist"]')) {
    tablist.hidden = false;
    tablist.addEventListener('click', event => {
      const tab = event.target.closest('[role="tab"]');
      if (tab && tablist.contains(tab)) activate(tab);
    });
    tablist.addEventListener('keydown', event => {
      const tab = event.target.closest('[role="tab"]');
      if (!tab) return;
      const siblings = Array.from(tablist.querySelectorAll('[role="tab"]'));
      const index = siblings.indexOf(tab);
      const next = {
        ArrowRight: (index + 1) % siblings.length,
        ArrowLeft: (index - 1 + siblings.length) % siblings.length,
        Home: 0,
        End: siblings.length - 1,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      activate(siblings[next]);
    });
  }
  const initialPanel = hashPanel();
  select(initialPanel?.dataset.client ?? selected);
  document.documentElement.classList.add('enhanced');
  if (initialPanel) initialPanel.scrollIntoView();
  window.addEventListener('hashchange', () => {
    const panel = hashPanel();
    if (panel) {
      select(panel.dataset.client);
      panel.scrollIntoView();
    }
  });
  window.addEventListener('popstate', () => {
    const panel = hashPanel();
    if (panel) select(panel.dataset.client);
  });

  for (const button of document.querySelectorAll('[data-copy]')) {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copy);
      const status = button.parentElement.querySelector('.copy-status');
      button.disabled = true;
      status.textContent = '';
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(target.textContent);
        status.textContent = 'Copied to clipboard.';
      } catch {
        status.textContent = 'Copy unavailable. Select the command text and copy manually with Ctrl+C or Command+C.';
        target.focus();
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNodeContents(target);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } finally {
        button.disabled = false;
      }
    });
  }
  const print = document.getElementById('print-guide');
  print.hidden = false;
  print.addEventListener('click', () => window.print());
})();
