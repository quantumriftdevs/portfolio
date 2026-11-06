(() => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'theme-toggle';
  const contact = [...nav.querySelectorAll('a')].find(a => /contact/i.test(a.textContent));
  if (contact) contact.insertAdjacentElement('afterend', toggle);
  else nav.append(toggle);
  function update() {
    const light = document.documentElement.dataset.theme === 'light';
    toggle.textContent = light ? '☾ DARK' : '☀ LIGHT';
    toggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    toggle.setAttribute('aria-pressed', String(light));
  }
  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (_) {}
    update();
  });
  update();
})();
