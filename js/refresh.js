/* Shared navigation, compact LeadConnector chat, and non-identifying event hooks. */
(() => {
  'use strict';
  if (document.body.classList.contains('mds-refresh')) document.body.classList.add('dark');
  const menu = document.querySelector('.mds-nav');
  const menuButton = document.querySelector('.mds-menu-toggle');
  const setMenu = (open, restoreFocus = false) => {
    if (!menu || !menuButton) return;
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) menu.querySelector('a')?.focus();
    if (restoreFocus) menuButton.focus();
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', (event) => {
    if (menu && !event.target.closest('.mds-header')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  window.matchMedia('(min-width:941px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  // These hooks distinguish link clicks from actual submissions. No form input is collected.
  const emit = (name, source) => {
    const detail = { event: `mds_${name}`, source, page: window.location.pathname };
    window.dispatchEvent(new CustomEvent('mds:site-event', { detail }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail);
  };
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-mds-track]');
    if (target) emit(target.dataset.mdsTrack, target.dataset.source || 'website');
  });

  if (!document.body.classList.contains('mds-refresh') || document.querySelector('.mds-chat-toggle')) return;
  const chatIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2V12a9 9 0 0 1 18-.5Z"/><path d="M7 10h8M7 14h5"/></svg>';
  const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mds-chat-toggle';
  button.setAttribute('aria-label', 'Chat with Mary');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = `${chatIcon}<span>Chat with Mary</span>`;
  const help = document.createElement('div');
  help.className = 'mds-chat-help';
  help.setAttribute('role', 'status');
  help.hidden = true;
  help.innerHTML = 'Chat is taking a little longer to load. You can <a href="contact.html#inquiry">send the MDS team an inquiry</a> instead.';
  document.body.append(button, help);

  let isOpen = false;
  let pending = false;
  let request = 0;
  const api = () => window.leadConnector?.chatWidget;
  const setOpen = (open) => {
    isOpen = Boolean(open);
    pending = false;
    document.body.classList.toggle('mds-ghl-chat-open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    button.setAttribute('aria-label', isOpen ? 'Close Chat with Mary' : 'Chat with Mary');
    button.innerHTML = isOpen ? `${closeIcon}<span>Close chat</span>` : `${chatIcon}<span>Chat with Mary</span>`;
  };
  const close = () => {
    request += 1;
    const widget = api();
    try {
      if (typeof widget?.closeWidget === 'function') widget.closeWidget();
      else if (typeof widget?.close === 'function') widget.close();
    } catch (_) { /* The official widget close control remains available. */ }
    setOpen(false);
  };
  const open = () => {
    help.hidden = true;
    pending = true;
    const current = ++request;
    let attempts = 0;
    const tryOpen = () => {
      if (current !== request) return;
      const widget = api();
      if (typeof widget?.openWidget === 'function') {
        try {
          widget.openWidget();
          setOpen(true);
          emit('chat_open', 'compact_launcher');
          return;
        } catch (_) { /* Retry while the existing widget initializes. */ }
      }
      attempts += 1;
      if (attempts < 24) window.setTimeout(tryOpen, 200);
      else {
        setOpen(false);
        help.hidden = false;
      }
    };
    tryOpen();
  };
  button.addEventListener('click', () => {
    help.hidden = true;
    if (isOpen || pending) close();
    else open();
  });
  window.addEventListener('LC_chatWidgetOpened', () => { help.hidden = true; setOpen(true); });
  window.addEventListener('LC_chatWidgetClosed', () => { request += 1; setOpen(false); });
})();
